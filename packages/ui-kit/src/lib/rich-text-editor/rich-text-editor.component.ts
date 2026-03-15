import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from "@angular/core";

import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import { PopoverService } from "../popover/popover.service";
import {
  UILinkDialog,
  type LinkDialogResult,
} from "./link-dialog/link-dialog.component";

import {
  DEFAULT_TOOLBAR_ACTIONS,
  FLAT_TOOLBAR_GROUPS,
  TOOLBAR_BUTTON_REGISTRY,
  TOOLBAR_GROUP_META,
  type RichTextFormatAction,
  type RichTextPlaceholder,
  type ToolbarButtonMeta,
  type ToolbarGroupMeta,
} from "./rich-text-editor.types";

/**
 * The CSS class applied to placeholder chips inside the editable area.
 * @internal
 */
const PLACEHOLDER_CLASS = "rte-placeholder";

/**
 * Regex matching serialised placeholder tokens: `{{key}}`.
 *
 * Keys may contain word characters, hyphens, dots, and colons
 * (e.g. `{{first-name}}`, `{{contact.email}}`).
 *
 * @internal
 */
const PLACEHOLDER_TOKEN_RE = /\{\{([\w.:-]+)\}\}/g;

// ── Component ──────────────────────────────────────────────────────

/**
 * Rich-text editor supporting basic formatting and placeholder
 * insertion.
 *
 * Uses a native `contenteditable` div for editing and
 * `document.execCommand` for inline / block formatting (bold,
 * italic, underline, strike-through, headings, lists, alignment).
 *
 * **Placeholders** are template variables (e.g. `{{firstName}}`)
 * rendered as non-editable inline chips.  In the serialised HTML
 * output they appear as `{{key}}` tokens that a downstream template
 * engine can resolve.
 *
 * The editor exposes its HTML content as a two-way `[(value)]`
 * binding.
 *
 * @example
 * ```html
 * <ui-rich-text-editor
 *   [(value)]="emailBody"
 *   [placeholders]="availablePlaceholders"
 *   ariaLabel="Email body"
 * />
 * ```
 */
@Component({
  selector: "ui-rich-text-editor",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./rich-text-editor.component.html",
  styleUrl: "./rich-text-editor.component.scss",
  host: {
    class: "ui-rich-text-editor",
    "[class.ui-rich-text-editor--disabled]": "disabled()",
    "[class.ui-rich-text-editor--readonly]": "readonly()",
  },
})
export class UIRichTextEditor implements OnInit, AfterViewInit {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly popoverService = inject(PopoverService);

  // ── View queries ───────────────────────────────────────────

  /** @internal */
  readonly editorRef =
    viewChild.required<ElementRef<HTMLDivElement>>("editorEl");

  // ── Inputs ─────────────────────────────────────────────────

  /** Whether the editor is disabled (non-interactive). */
  readonly disabled = input<boolean>(false);

  /** Whether the editor is read-only (content visible but not editable). */
  readonly readonly = input<boolean>(false);

  /**
   * Accessible label forwarded to the editable region via
   * `aria-label`.
   */
  readonly ariaLabel = input<string>("Rich text editor");

  /**
   * Placeholder text shown when the editor is empty.
   */
  readonly placeholder = input<string>("Type here…");

  /**
   * Which formatting actions to show in the toolbar.
   * Defaults to {@link DEFAULT_TOOLBAR_ACTIONS}.
   */
  readonly toolbarActions = input<readonly RichTextFormatAction[]>(
    DEFAULT_TOOLBAR_ACTIONS,
  );

  /**
   * Available placeholder definitions.
   * When non-empty a placeholder picker appears in the toolbar.
   */
  readonly placeholders = input<readonly RichTextPlaceholder[]>([]);

  /**
   * Whether to sanitise HTML content before rendering.
   *
   * When `true` (default) the editor strips dangerous elements
   * (`<script>`, `<iframe>`, etc.), `on*` event handlers,
   * `javascript:` URIs, and `style` attributes from all content
   * — whether pasted, set via `value()`, or typed in source mode.
   *
   * Set to `false` to allow arbitrary HTML. **Only disable this
   * for trusted users/roles** (e.g. developers crafting
   * bookmarklets or embed snippets).
   *
   * @default true
   */
  readonly sanitise = input<boolean>(true);

  // ── Two-way value ──────────────────────────────────────────

  /**
   * HTML content of the editor.  Two-way bindable via `[(value)]`.
   *
   * Placeholder chips are serialised as `{{key}}` tokens in the
   * emitted string.
   */
  readonly value = model<string>("");

  // ── Outputs ────────────────────────────────────────────────

  /** Fired when a placeholder chip is inserted. */
  readonly placeholderInserted = output<RichTextPlaceholder>();

  // ── Internal state ─────────────────────────────────────────

  /** Whether the placeholder picker dropdown is open. */
  protected readonly isPlaceholderPickerOpen = signal(false);

  /** Whether the editor area is currently focused. */
  protected readonly isFocused = signal(false);

  /** Which toolbar dropdown group is currently open, if any. */
  protected readonly openDropdownGroup = signal<string | null>(null);

  /** Whether the editor is in raw HTML source editing mode. */
  protected readonly isSourceMode = signal(false);

  /** SVG content for the source-toggle toolbar button. @internal */
  protected readonly sourceIcon = UIIcons.Lucide.Development.CodeXml;

  /**
   * Saved selection range captured when the link dialog opens,
   * so we can restore it when applying the link.
   * @internal
   */
  private savedRange: Range | null = null;

  /**
   * The DOM element the link popover is anchored to.
   * @internal
   */
  private linkAnchorEl: Element | null = null;

  /**
   * Set of formatting actions currently active at the caret
   * position.  Updated on every selection change, keypress,
   * and formatting command.
   *
   * @internal
   */
  protected readonly activeFormats = signal<ReadonlySet<RichTextFormatAction>>(
    new Set(),
  );

  /** Resolved toolbar button metadata from the actions list. */
  protected readonly toolbarButtons = computed<ToolbarButtonMeta[]>(() =>
    this.toolbarActions()
      .map((a) => TOOLBAR_BUTTON_REGISTRY[a])
      .filter(Boolean),
  );

  /**
   * Grouped toolbar buttons for rendering separators between
   * groups.
   *
   * @internal
   */
  protected readonly groupedToolbarButtons = computed(() => {
    const buttons = this.toolbarButtons();
    const groups: {
      group: string;
      buttons: ToolbarButtonMeta[];
      flat: boolean;
      meta: ToolbarGroupMeta | null;
    }[] = [];
    let currentGroup = "";
    for (const btn of buttons) {
      const g = btn.group ?? "";
      if (g !== currentGroup) {
        currentGroup = g;
        const isFlat = FLAT_TOOLBAR_GROUPS.has(g);
        groups.push({
          group: g,
          buttons: [],
          flat: isFlat,
          meta: isFlat ? null : (TOOLBAR_GROUP_META[g] ?? null),
        });
      }
      groups[groups.length - 1].buttons.push(btn);
    }
    return groups;
  });

  /**
   * Placeholder categories for the picker dropdown.
   *
   * @internal
   */
  protected readonly placeholdersByCategory = computed(() => {
    const ph = this.placeholders();
    if (!ph.length) return [];
    const catMap = new Map<string, RichTextPlaceholder[]>();
    for (const p of ph) {
      const cat = p.category ?? "";
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push(p);
    }
    return Array.from(catMap.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  });

  /** Tracks whether init has happened to avoid premature reads. */
  private initialised = false;

  /**
   * The last value that was synced to/from the editor,
   * used to distinguish internal edits from external
   * model changes and avoid feedback loops.
   */
  private lastSyncedValue = "";

  /**
   * Watches the `value` model signal and re-renders the
   * editor whenever the value changes externally (i.e. not
   * from the editor itself).
   */
  private readonly valueChangeEffect = effect(() => {
    const html = this.value();
    if (this.initialised && html !== this.lastSyncedValue) {
      untracked(() => {
        this.lastSyncedValue = html;
        this.renderHtmlToEditor(html);
      });
    }
  });

  // ── Lifecycle ──────────────────────────────────────────────

  ngOnInit(): void {
    const onSelectionChange = () => {
      if (this.isFocused()) {
        this.refreshActiveFormats();
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener("selectionchange", onSelectionChange);
    });
  }

  ngAfterViewInit(): void {
    const html = this.value();
    this.lastSyncedValue = html;
    this.renderHtmlToEditor(html);
    this.initialised = true;
  }

  // ── Formatting commands ────────────────────────────────────

  /**
   * Executes a formatting action.
   *
   * @internal
   */
  protected execAction(action: RichTextFormatAction, anchorEl?: Element): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.restoreFocus();

    switch (action) {
      case "bold":
        document.execCommand("bold");
        break;
      case "italic":
        document.execCommand("italic");
        break;
      case "underline":
        document.execCommand("underline");
        break;
      case "strikethrough":
        document.execCommand("strikeThrough");
        break;
      case "paragraph":
        document.execCommand("formatBlock", false, "p");
        break;
      case "heading1":
        document.execCommand("formatBlock", false, "h1");
        break;
      case "heading2":
        document.execCommand("formatBlock", false, "h2");
        break;
      case "heading3":
        document.execCommand("formatBlock", false, "h3");
        break;
      case "blockquote":
        document.execCommand("formatBlock", false, "blockquote");
        break;
      case "codeBlock":
        document.execCommand("formatBlock", false, "pre");
        break;
      case "unorderedList":
        document.execCommand("insertUnorderedList");
        break;
      case "orderedList":
        document.execCommand("insertOrderedList");
        break;
      case "alignLeft":
        document.execCommand("justifyLeft");
        break;
      case "alignCenter":
        document.execCommand("justifyCenter");
        break;
      case "alignRight":
        document.execCommand("justifyRight");
        break;
      case "link":
        this.openLinkDialog(anchorEl ?? null);
        return; // early return — no sync/refresh until apply
      case "removeFormat":
        document.execCommand("removeFormat");
        break;
    }

    this.syncValueFromEditor();
    this.refreshActiveFormats();
  }

  // ── Placeholder insertion ──────────────────────────────────

  /**
   * Inserts a placeholder chip at the current caret position.
   *
   * @internal
   */
  protected insertPlaceholder(placeholder: RichTextPlaceholder): void {
    if (this.disabled() || this.readonly()) return;
    this.restoreFocus();

    const chip = this.createPlaceholderChip(placeholder);
    // Insert the chip at the current selection
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(chip);

      // Move caret after the chip
      range.setStartAfter(chip);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      // Fallback: append to editor
      this.editorRef().nativeElement.appendChild(chip);
    }

    this.isPlaceholderPickerOpen.set(false);
    this.placeholderInserted.emit(placeholder);
    this.syncValueFromEditor();
  }

  /** @internal */
  protected toggleDropdownGroup(group: string): void {
    if (this.disabled() || this.readonly()) return;
    this.isPlaceholderPickerOpen.set(false);
    this.openDropdownGroup.update((current) =>
      current === group ? null : group,
    );
  }

  /** @internal */
  protected togglePlaceholderPicker(): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.isPlaceholderPickerOpen.update((v) => !v);
  }

  /** @internal */
  protected closePlaceholderPicker(): void {
    this.isPlaceholderPickerOpen.set(false);
  }

  // ── Hyperlink dialog ───────────────────────────────────────

  /**
   * Opens the hyperlink popover anchored to the given toolbar
   * button.  Pre-fills the display text from the current
   * selection and detects whether the caret is inside an existing
   * `<a>` element (edit mode).
   *
   * @internal
   */
  private openLinkDialog(anchorEl: Element | null): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.isPlaceholderPickerOpen.set(false);

    // Save the current selection so we can restore it on apply
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0).cloneRange();
    }

    // Detect if caret is inside an existing link
    const existingAnchor = this.findAncestorAnchor();
    const isEdit = !!existingAnchor;
    const initialUrl = existingAnchor?.getAttribute("href") ?? "";
    const initialText = existingAnchor
      ? (existingAnchor.textContent ?? "")
      : (sel?.toString() ?? "");

    // Fall back to the host element if no anchor button was passed
    const anchor = anchorEl ?? this.elRef.nativeElement;

    const ref = this.popoverService.openPopover<UILinkDialog, LinkDialogResult>(
      {
        component: UILinkDialog,
        anchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "center",
        verticalOffset: 4,
        closeOnOutsideClick: true,
        inputs: {
          initialUrl,
          initialText,
          editMode: isEdit,
        },
      },
    );

    ref.closed.subscribe((result) => {
      if (result) {
        this.applyLinkResult(result, existingAnchor);
      } else {
        // Cancelled / light-dismissed — restore focus
        this.savedRange = null;
        this.restoreFocus();
      }
    });
  }

  /**
   * Applies the link result returned by the popover.
   *
   * @internal
   */
  private applyLinkResult(
    result: LinkDialogResult,
    existingAnchor: HTMLAnchorElement | null,
  ): void {
    const { url, text } = result;

    // Restore saved selection
    if (this.savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(this.savedRange);
    }

    this.restoreFocus();

    if (existingAnchor) {
      // Edit existing link
      existingAnchor.setAttribute("href", url);
      existingAnchor.setAttribute("target", "_blank");
      existingAnchor.setAttribute("rel", "noopener noreferrer");
      existingAnchor.textContent = text;
    } else {
      // Create new link by replacing selection
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = text;

      if (this.savedRange) {
        this.savedRange.deleteContents();
        this.savedRange.insertNode(a);

        // Move caret after the link
        const range = document.createRange();
        range.setStartAfter(a);
        range.collapse(true);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }

    this.savedRange = null;
    this.syncValueFromEditor();
    this.refreshActiveFormats();
  }

  /**
   * Finds the closest `<a>` ancestor of the current selection,
   * or `null` if the caret is not inside a link.
   *
   * @internal
   */
  private findAncestorAnchor(): HTMLAnchorElement | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node: Node | null = sel.anchorNode;
    while (node && node !== this.editorRef().nativeElement) {
      if (node instanceof HTMLAnchorElement) return node;
      node = node.parentNode;
    }
    return null;
  }

  /**
   * Returns `true` when the given formatting action is currently
   * active at the caret position.
   *
   * @internal
   */
  protected isActionActive(action: RichTextFormatAction): boolean {
    return this.activeFormats().has(action);
  }

  // ── Source mode ────────────────────────────────────────────

  /**
   * Toggles between WYSIWYG-only and split source + preview mode.
   *
   * In source mode the raw HTML textarea appears above a
   * read-only WYSIWYG preview.  Edits in the textarea are
   * rendered into the preview in real time.
   *
   * @internal
   */
  protected toggleSourceMode(): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.isPlaceholderPickerOpen.set(false);
    this.isSourceMode.update((v) => !v);
  }

  /**
   * Handles input events from the source-mode `<textarea>`.
   * Writes the raw HTML to `value` and live-renders the preview.
   *
   * @internal
   */
  protected onSourceInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.lastSyncedValue = textarea.value;
    this.value.set(textarea.value);
    this.renderHtmlToEditor(textarea.value);
  }

  // ── Editor event handlers ──────────────────────────────────

  /** @internal */
  protected onEditorInput(): void {
    this.syncValueFromEditor();
  }

  /** @internal */
  protected onEditorFocus(): void {
    this.isFocused.set(true);
    this.refreshActiveFormats();
  }

  /** @internal */
  protected onEditorBlur(): void {
    this.isFocused.set(false);
    this.activeFormats.set(new Set());
  }

  /**
   * Handles paste events by stripping everything except basic
   * inline formatting to prevent pasting styled content from
   * external sources.
   *
   * @internal
   */
  protected onEditorPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const html = event.clipboardData?.getData("text/html");
    const text = event.clipboardData?.getData("text/plain") ?? "";

    if (html) {
      const cleaned = this.sanitise() ? this.sanitiseHtml(html) : html;
      document.execCommand("insertHTML", false, cleaned);
    } else {
      document.execCommand("insertText", false, text);
    }

    this.syncValueFromEditor();
  }

  /**
   * Prevents deletion of the placeholder chip's interior —
   * instead deletes the whole chip.
   *
   * @internal
   */
  protected onEditorKeydown(event: KeyboardEvent): void {
    if (event.key === "Backspace" || event.key === "Delete") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      if (!range.collapsed) return;

      const node =
        event.key === "Backspace"
          ? this.previousNode(range.startContainer, range.startOffset)
          : this.nextNode(range.startContainer, range.startOffset);

      if (
        node instanceof HTMLElement &&
        node.classList.contains(PLACEHOLDER_CLASS)
      ) {
        event.preventDefault();
        node.remove();
        this.syncValueFromEditor();
      }
    }
  }

  // ── Internal helpers ───────────────────────────────────────

  /**
   * Reads the editor's inner HTML, serialises placeholder chips
   * back to `{{key}}` tokens, and pushes the result to
   * `this.value`.
   *
   * @internal
   */
  private syncValueFromEditor(): void {
    const editor = this.editorRef().nativeElement;
    const html = this.serialiseContent(editor);
    this.lastSyncedValue = html;
    this.value.set(html);
  }

  /**
   * Renders the given HTML string into the editor element,
   * expanding `{{key}}` tokens into placeholder chips.
   *
   * When {@link sanitise} is `true`, content is sanitised before
   * insertion to strip dangerous elements, event handlers, and
   * `javascript:` URIs.
   *
   * @internal
   */
  private renderHtmlToEditor(html: string): void {
    const editor = this.editorRef().nativeElement;
    const expanded = this.deserialiseContent(html);
    editor.innerHTML = this.sanitise() ? this.sanitiseHtml(expanded) : expanded;
  }

  /**
   * Clones the editor DOM, replaces placeholder chip elements
   * with their `{{key}}` token, and returns the resulting HTML.
   */
  private serialiseContent(editor: HTMLDivElement): string {
    const clone = editor.cloneNode(true) as HTMLDivElement;
    const chips = clone.querySelectorAll(`.${PLACEHOLDER_CLASS}`);
    chips.forEach((chip) => {
      const key = chip.getAttribute("data-placeholder-key") ?? "";
      const token = document.createTextNode(`{{${key}}}`);
      chip.replaceWith(token);
    });
    return clone.innerHTML;
  }

  /**
   * Expands `{{key}}` tokens in the HTML into placeholder chip
   * markup that the editor can display.
   */
  private deserialiseContent(html: string): string {
    const placeholders = this.placeholders();
    return html.replace(PLACEHOLDER_TOKEN_RE, (_match, key: string) => {
      const ph = placeholders.find((p) => p.key === key);
      const label = ph?.label ?? key;
      return (
        `<span class="${PLACEHOLDER_CLASS}" ` +
        `contenteditable="false" ` +
        `data-placeholder-key="${this.escapeAttr(key)}">` +
        `${this.escapeHtml(label)}</span>`
      );
    });
  }

  /**
   * Creates a placeholder chip DOM element.
   */
  private createPlaceholderChip(placeholder: RichTextPlaceholder): HTMLElement {
    const chip = document.createElement("span");
    chip.className = PLACEHOLDER_CLASS;
    chip.contentEditable = "false";
    chip.dataset["placeholderKey"] = placeholder.key;
    chip.textContent = placeholder.label;
    return chip;
  }

  /**
   * Sanitises HTML before it enters the editor DOM.
   *
   * This is a **security boundary**: all content — whether pasted,
   * set via `value()`, or typed into the source textarea — passes
   * through this method before being written to `innerHTML`.
   *
   * The sanitiser:
   * - Removes elements not on the allow-list (keeping their text)
   * - Completely removes dangerous elements (script, style, etc.)
   * - Strips all `on*` event-handler attributes
   * - Strips `style` attributes (prevents CSS-based attacks)
   * - Strips `javascript:`, `vbscript:`, and `data:` URI schemes
   *   from `href` / `src` / `action` attributes
   * - Preserves placeholder-chip attributes (`contenteditable`,
   *   `data-placeholder-key`) on `.rte-placeholder` spans
   */
  private sanitiseHtml(html: string): string {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Elements that are removed entirely — including their children
    const dangerous = new Set([
      "SCRIPT",
      "STYLE",
      "IFRAME",
      "OBJECT",
      "EMBED",
      "FORM",
      "INPUT",
      "TEXTAREA",
      "SELECT",
      "BUTTON",
      "LINK",
      "META",
      "BASE",
      "APPLET",
      "SVG",
      "MATH",
    ]);

    // Elements whose tags are kept (all others are unwrapped)
    const allowed = new Set([
      "B",
      "STRONG",
      "I",
      "EM",
      "U",
      "S",
      "STRIKE",
      "BR",
      "P",
      "H1",
      "H2",
      "H3",
      "UL",
      "OL",
      "LI",
      "SPAN",
      "A",
    ]);

    // Attributes that are safe to keep on specific elements
    const safeAttrs: ReadonlySet<string> = new Set([
      "class",
      "href",
      "target",
      "rel",
    ]);

    // Schemes that are allowed in URI attributes
    const dangerousSchemeRe = /^\s*(javascript|vbscript|data)\s*:/i;

    const walk = (el: Element): void => {
      for (const child of Array.from(el.children)) {
        // 1. Nuke dangerous elements entirely
        if (dangerous.has(child.tagName)) {
          child.remove();
          continue;
        }

        // 2. Unwrap disallowed-but-harmless elements
        if (!allowed.has(child.tagName)) {
          child.replaceWith(...Array.from(child.childNodes));
          continue;
        }

        // 3. Scrub attributes on allowed elements
        const isChip = child.classList.contains(PLACEHOLDER_CLASS);
        for (const attr of Array.from(child.attributes)) {
          const name = attr.name.toLowerCase();

          // Strip all event handlers
          if (name.startsWith("on")) {
            child.removeAttribute(attr.name);
            continue;
          }

          // Strip style attributes
          if (name === "style") {
            child.removeAttribute(attr.name);
            continue;
          }

          // Preserve placeholder-chip attributes
          if (
            isChip &&
            (name === "contenteditable" || name === "data-placeholder-key")
          ) {
            continue;
          }

          // Strip URI attributes with dangerous schemes
          if (
            (name === "href" || name === "src" || name === "action") &&
            dangerousSchemeRe.test(attr.value)
          ) {
            child.removeAttribute(attr.name);
            continue;
          }

          // Keep known-safe attributes, strip everything else
          if (!safeAttrs.has(name)) {
            child.removeAttribute(attr.name);
          }
        }

        walk(child);
      }
    };

    walk(temp);
    return temp.innerHTML;
  }

  /**
   * Queries the browser for the current formatting state at the
   * caret position and updates {@link activeFormats}.
   *
   * Uses `document.queryCommandState` for inline toggles and
   * `document.queryCommandValue('formatBlock')` for block-level
   * formats (headings, lists).  Also inspects the closest ancestor
   * for alignment and list state.
   *
   * @internal
   */
  private refreshActiveFormats(): void {
    const formats = new Set<RichTextFormatAction>();

    // ── Inline toggles ──────────────────────────────────────
    const inlineChecks: [RichTextFormatAction, string][] = [
      ["bold", "bold"],
      ["italic", "italic"],
      ["underline", "underline"],
      ["strikethrough", "strikeThrough"],
    ];
    for (const [action, cmd] of inlineChecks) {
      try {
        if (document.queryCommandState(cmd)) formats.add(action);
      } catch {
        // queryCommandState may throw in some browsers
      }
    }

    // ── Block format (headings) ─────────────────────────────
    try {
      const block = document.queryCommandValue("formatBlock");
      const tag = block?.toLowerCase().replace(/[<>]/g, "") ?? "";
      if (tag === "p") formats.add("paragraph");
      else if (tag === "h1") formats.add("heading1");
      else if (tag === "h2") formats.add("heading2");
      else if (tag === "h3") formats.add("heading3");
      else if (tag === "blockquote") formats.add("blockquote");
      else if (tag === "pre") formats.add("codeBlock");
    } catch {
      // ignore
    }

    // ── Lists ───────────────────────────────────────────────
    const listChecks: [RichTextFormatAction, string][] = [
      ["unorderedList", "insertUnorderedList"],
      ["orderedList", "insertOrderedList"],
    ];
    for (const [action, cmd] of listChecks) {
      try {
        if (document.queryCommandState(cmd)) formats.add(action);
      } catch {
        // ignore
      }
    }

    // ── Alignment ───────────────────────────────────────────
    const alignChecks: [RichTextFormatAction, string][] = [
      ["alignLeft", "justifyLeft"],
      ["alignCenter", "justifyCenter"],
      ["alignRight", "justifyRight"],
    ];
    for (const [action, cmd] of alignChecks) {
      try {
        if (document.queryCommandState(cmd)) formats.add(action);
      } catch {
        // ignore
      }
    }

    // ── Link ─────────────────────────────────────────────────
    {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        let node: Node | null = sel.anchorNode;
        while (node && node !== this.editorRef().nativeElement) {
          if (node instanceof HTMLAnchorElement) {
            formats.add("link");
            break;
          }
          node = node.parentNode;
        }
      }
    }

    this.activeFormats.set(formats);
  }

  /** Restores focus to the editor element. */
  private restoreFocus(): void {
    const editor = this.editorRef().nativeElement;
    if (document.activeElement !== editor) {
      editor.focus();
    }
  }

  /**
   * Returns the DOM node immediately before the given
   * container/offset position.
   */
  private previousNode(container: Node, offset: number): Node | null {
    if (container.nodeType === Node.TEXT_NODE) {
      return offset === 0 ? container.previousSibling : null;
    }
    return offset > 0 ? container.childNodes[offset - 1] : null;
  }

  /**
   * Returns the DOM node immediately after the given
   * container/offset position.
   */
  private nextNode(container: Node, offset: number): Node | null {
    if (container.nodeType === Node.TEXT_NODE) {
      return offset === (container as Text).length
        ? container.nextSibling
        : null;
    }
    return offset < container.childNodes.length
      ? container.childNodes[offset]
      : null;
  }

  /** HTML-escape a string for safe insertion into markup. */
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Escape a string for safe use in an HTML attribute value. */
  private escapeAttr(str: string): string {
    return this.escapeHtml(str);
  }
}
