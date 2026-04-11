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

import { LoggerFactory, UISurface } from "@theredhead/foundation";

import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import { UIEmojiPicker } from "../emoji-picker/emoji-picker.component";
import type { EmojiCategory } from "../emoji-picker/emoji-picker.types";
import { PopoverService } from "../popover/popover.service";
import {
  UILinkDialog,
  type LinkDialogResult,
} from "./link-dialog/link-dialog.component";

import {
  UIImageDialog,
  type ImageDialogResult,
} from "./image-dialog/image-dialog.component";

import {
  DEFAULT_TOOLBAR_ACTIONS,
  FLAT_TOOLBAR_GROUPS,
  TOOLBAR_BUTTON_REGISTRY,
  TOOLBAR_GROUP_META,
  type RichTextFormatAction,
  type RichTextImageHandler,
  type RichTextPlaceholder,
  type ToolbarButtonMeta,
  type ToolbarGroupMeta,
} from "./rich-text-editor.types";

import type {
  RichTextEditorContext,
  RichTextEditorMode,
  RichTextEditorStrategy,
} from "./rich-text-editor.strategy";

import { HtmlEditingStrategy } from "./strategies/html-editing.strategy";
import { MarkdownEditingStrategy } from "./strategies/markdown-editing.strategy";
import { MARKDOWN_PARSER, type MarkdownParser } from "./markdown-parser";

/**
 * The CSS class applied to placeholder chips inside the editable area.
 * @internal
 */
const PLACEHOLDER_CLASS = "rte-placeholder";

// ── Component ──────────────────────────────────────────────────────

/**
 * Rich-text editor supporting basic formatting and placeholder
 * insertion.
 *
 * Supports two editing modes controlled by the `mode` input:
 *
 * - **`'html'`** (default) — WYSIWYG editing with a native
 *   `contenteditable` div and `document.execCommand` for
 *   formatting.  Content is stored as HTML.
 *
 * - **`'markdown'`** — Plain-text Markdown editing in a
 *   `<textarea>` with a live HTML preview below.  Formatting
 *   actions insert Markdown syntax.  Content is stored as
 *   Markdown.
 *
 * **Placeholders** are template variables (e.g. `{{firstName}}`)
 * rendered as non-editable inline chips.  In the serialised
 * output they appear as `{{key}}` tokens that a downstream
 * template engine can resolve.
 *
 * The editor exposes its content as a two-way `[(value)]` binding.
 *
 * @example
 * ```html
 * <ui-rich-text-editor
 *   [(value)]="emailBody"
 *   [placeholders]="availablePlaceholders"
 *   ariaLabel="Email body"
 * />
 *
 * <ui-rich-text-editor
 *   mode="markdown"
 *   [(value)]="readmeContent"
 *   ariaLabel="README editor"
 * />
 * ```
 */
@Component({
  selector: "ui-rich-text-editor",
  standalone: true,
  imports: [UIIcon, UIEmojiPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  templateUrl: "./rich-text-editor.component.html",
  styleUrl: "./rich-text-editor.component.scss",
  host: {
    class: "ui-rich-text-editor",
    "[class.disabled]": "disabled()",
    "[class.readonly]": "readonly()",
    "[class.markdown]": "mode() === 'markdown'",
  },
})
export class UIRichTextEditor implements OnInit, AfterViewInit {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly popoverService = inject(PopoverService);
  private readonly log = inject(LoggerFactory).createLogger("UIRichTextEditor");

  /**
   * Optional external Markdown parser injected via
   * {@link MARKDOWN_PARSER}.  When provided, the
   * {@link MarkdownEditingStrategy} delegates its Markdown → HTML
   * conversion to this parser instead of using the built-in
   * lightweight converter.
   */
  private readonly markdownParser = inject(MARKDOWN_PARSER, {
    optional: true,
  }) as MarkdownParser | null;

  // ── View queries ───────────────────────────────────────────

  /** @internal */
  public readonly editorRef =
    viewChild.required<ElementRef<HTMLDivElement>>("editorEl");

  /**
   * Optional reference to the Markdown textarea, present only
   * when `mode === 'markdown'`.
   * @internal
   */
  public readonly mdTextareaRef =
    viewChild<ElementRef<HTMLTextAreaElement>>("mdTextarea");

  /**
   * Syncs the Markdown textarea element reference into the
   * active strategy whenever it appears or disappears.
   * @internal
   */
  private readonly mdTextareaSync = effect(() => {
    const ref = this.mdTextareaRef();
    const strat = this.strategy();
    if (strat instanceof MarkdownEditingStrategy) {
      strat.textareaEl = ref?.nativeElement ?? null;
    }
  });

  // ── Inputs ─────────────────────────────────────────────────

  /**
   * Editing mode.
   *
   * - `'html'`     — WYSIWYG editing (default)
   * - `'markdown'` — Markdown source editing with live preview
   */
  public readonly mode = input<RichTextEditorMode>("html");

  /** Whether the editor is disabled (non-interactive). */
  public readonly disabled = input<boolean>(false);

  /** Whether the editor is read-only (content visible but not editable). */
  public readonly readonly = input<boolean>(false);

  /**
   * Accessible label forwarded to the editable region via
   * `aria-label`.
   */
  public readonly ariaLabel = input<string>("Rich text editor");

  /**
   * Placeholder text shown when the editor is empty.
   */
  public readonly placeholder = input<string>("Type here…");

  /**
   * Which formatting actions to show in the toolbar.
   * Defaults to {@link DEFAULT_TOOLBAR_ACTIONS}.
   */
  public readonly toolbarActions = input<readonly RichTextFormatAction[]>(
    DEFAULT_TOOLBAR_ACTIONS,
  );

  /**
   * Available placeholder definitions.
   * When non-empty a placeholder picker appears in the toolbar.
   */
  public readonly placeholders = input<readonly RichTextPlaceholder[]>([]);

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
  public readonly sanitise = input<boolean>(true);

  /**
   * Optional maximum character count.  When set, a character
   * counter is shown below the editor.  The count is based on
   * the plain-text length of the content (HTML tags and Markdown
   * syntax are excluded).
   *
   * A value of `0` or `undefined` disables the limit.
   */
  public readonly maxLength = input<number | undefined>(undefined);

  /**
   * Optional callback for handling pasted images.
   *
   * When provided, the function receives the pasted image `File`
   * and should return a `Promise<string>` resolving to a URL.
   * The URL is then inserted as an `<img>` (HTML mode) or
   * `![image](url)` (Markdown mode).
   *
   * When not provided, pasted images are embedded inline as
   * base64 `data:` URIs.
   *
   * @example
   * ```html
   * <ui-rich-text-editor [imageHandler]="uploadToS3" />
   * ```
   */
  public readonly imageHandler = input<RichTextImageHandler | undefined>(
    undefined,
  );

  /**
   * Optional custom emoji categories for the inline emoji
   * picker.  When not provided the picker uses the default
   * comprehensive emoji set.
   */
  public readonly emojiCategories = input<readonly EmojiCategory[]>([]);

  // ── Two-way value ──────────────────────────────────────────

  /**
   * Content of the editor.  Two-way bindable via `[(value)]`.
   *
   * In HTML mode this is an HTML string.  In Markdown mode this
   * is a Markdown string.  Placeholder chips are serialised as
   * `{{key}}` tokens in both modes.
   */
  public readonly value = model<string>("");

  // ── Outputs ────────────────────────────────────────────────

  /** Fired when a placeholder chip is inserted. */
  public readonly placeholderInserted = output<RichTextPlaceholder>();

  // ── Strategy ───────────────────────────────────────────────

  /**
   * The active editing strategy, derived from the `mode` input.
   * @internal
   */
  protected readonly strategy = computed<RichTextEditorStrategy>(() => {
    const m = this.mode();
    if (m === "markdown") {
      return new MarkdownEditingStrategy(this.markdownParser);
    }
    return new HtmlEditingStrategy();
  });

  // ── Internal state ─────────────────────────────────────────

  /** Whether the placeholder picker dropdown is open. */
  protected readonly isPlaceholderPickerOpen = signal(false);

  /** Search term for filtering the placeholder picker. */
  protected readonly placeholderSearchTerm = signal("");

  /** Whether the editor area is currently focused. */
  protected readonly isFocused = signal(false);

  /** Which toolbar dropdown group is currently open, if any. */
  protected readonly openDropdownGroup = signal<string | null>(null);

  /** Whether the editor is in raw source editing mode. */
  protected readonly isSourceMode = signal(false);

  /** Whether the emoji picker dropdown is open. */
  protected readonly isEmojiPickerOpen = signal(false);

  /** SVG content for the source-toggle toolbar button. @internal */
  protected readonly sourceIcon = UIIcons.Lucide.Development.CodeXml;

  /** SVG content for the emoji toolbar button. @internal */
  protected readonly emojiIcon = UIIcons.Lucide.Emoji.Smile;

  /**
   * Whether the editor is in Markdown mode.  In this mode the
   * textarea is always visible as the primary editing surface.
   * @internal
   */
  protected readonly isMarkdownMode = computed(
    () => this.mode() === "markdown",
  );

  /**
   * Current character count of the editor content, computed
   * from the plain-text representation (strips HTML/Markdown
   * syntax).
   * @internal
   */
  protected readonly charCount = computed(() => {
    const raw = this.value();
    if (!raw) return 0;
    if (this.isMarkdownMode()) {
      // Strip Markdown syntax: headers, bold, italic, links, images, code
      return raw
        .replace(/[#*_`~[\]()!>|-]/g, "")
        .replace(/\n+/g, " ")
        .trim().length;
    }
    // Strip HTML tags and decode entities
    const tmp = document.createElement("div");
    tmp.innerHTML = raw;
    return (tmp.textContent ?? "").trim().length;
  });

  /**
   * Whether the character count exceeds the max length.
   * @internal
   */
  protected readonly isOverMaxLength = computed(() => {
    const max = this.maxLength();
    return max != null && max > 0 && this.charCount() > max;
  });

  /**
   * Saved selection range captured when the link dialog opens,
   * so we can restore it when applying the link.
   * @internal
   */
  private savedRange: Range | null = null;

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
   * Actions that are hidden in Markdown mode because they have
   * no meaningful effect on plain-text Markdown.
   * @internal
   */
  private static readonly MARKDOWN_HIDDEN_GROUPS: ReadonlySet<string> = new Set(
    ["align"],
  );

  /**
   * Grouped toolbar buttons for rendering separators between
   * groups.
   *
   * In Markdown mode the `align` group is excluded because
   * text alignment is not supported in Markdown.
   *
   * @internal
   */
  protected readonly groupedToolbarButtons = computed(() => {
    const buttons = this.toolbarButtons();
    const isMarkdown = this.isMarkdownMode();
    const groups: {
      group: string;
      buttons: ToolbarButtonMeta[];
      flat: boolean;
      meta: ToolbarGroupMeta | null;
    }[] = [];
    let currentGroup = "";
    for (const btn of buttons) {
      const g = btn.group ?? "";
      if (isMarkdown && UIRichTextEditor.MARKDOWN_HIDDEN_GROUPS.has(g)) {
        continue;
      }
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
   * Placeholder categories for the picker dropdown, filtered
   * by the current search term.
   *
   * @internal
   */
  protected readonly placeholdersByCategory = computed(() => {
    const ph = this.placeholders();
    if (!ph.length) return [];
    const term = this.placeholderSearchTerm().toLowerCase().trim();
    const filtered = term
      ? ph.filter(
          (p) =>
            p.label.toLowerCase().includes(term) ||
            p.key.toLowerCase().includes(term),
        )
      : ph;
    if (!filtered.length) return [];
    const catMap = new Map<string, RichTextPlaceholder[]>();
    for (const p of filtered) {
      const cat = p.category ?? "";
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push(p);
    }
    return Array.from(catMap.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  });

  /**
   * The source-toggle button label, from the active strategy.
   * @internal
   */
  protected readonly sourceToggleLabel = computed(
    () => this.strategy().sourceToggleLabel,
  );

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
    const val = this.value();
    if (this.initialised && val !== this.lastSyncedValue) {
      untracked(() => {
        this.lastSyncedValue = val;
        this.renderToEditor(val);
      });
    }
  });

  /**
   * Watches the `strategy` computed (derived from `mode`) and
   * re-renders the editor content whenever the mode changes.
   * Also resets transient UI state that is mode-specific.
   */
  private readonly modeChangeEffect = effect(() => {
    // Track the strategy signal — it changes when mode() changes
    this.strategy();
    if (!this.initialised) return;
    untracked(() => {
      this.isSourceMode.set(false);
      this.openDropdownGroup.set(null);
      this.isPlaceholderPickerOpen.set(false);
      this.isEmojiPickerOpen.set(false);
      this.activeFormats.set(new Set());
      this.renderToEditor(this.value());
    });
  });

  // ── Lifecycle ──────────────────────────────────────────────

  public ngOnInit(): void {
    const onSelectionChange = () => {
      if (this.isFocused()) {
        this.doRefreshActiveFormats();
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener("selectionchange", onSelectionChange);
    });

    // Close dropdowns on outside click
    const onDocumentClick = (event: MouseEvent) => {
      if (
        !this.openDropdownGroup() &&
        !this.isPlaceholderPickerOpen() &&
        !this.isEmojiPickerOpen()
      ) {
        return;
      }
      const target = event.target as HTMLElement;
      // Close if the click lands outside the component entirely,
      // or inside the component but outside any dropdown/picker container.
      const host = this.elRef.nativeElement as HTMLElement;
      if (!host.contains(target)) {
        this.openDropdownGroup.set(null);
        this.isPlaceholderPickerOpen.set(false);
        this.isEmojiPickerOpen.set(false);
        return;
      }
      const inDropdown = target.closest(
        ".dropdown-group, .placeholder-picker, .emoji-picker-wrapper",
      );
      if (!inDropdown) {
        this.openDropdownGroup.set(null);
        this.isPlaceholderPickerOpen.set(false);
        this.isEmojiPickerOpen.set(false);
      }
    };
    document.addEventListener("click", onDocumentClick, true);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener("click", onDocumentClick, true);
    });
  }

  public ngAfterViewInit(): void {
    const val = this.value();
    this.lastSyncedValue = val;
    this.renderToEditor(val);
    this.initialised = true;
  }

  // ── Context factory ────────────────────────────────────────

  /**
   * Builds the {@link RichTextEditorContext} for strategy methods.
   * @internal
   */
  private buildContext(): RichTextEditorContext {
    return {
      editorEl: this.editorRef().nativeElement,
      hostEl: this.elRef.nativeElement,
      placeholders: this.placeholders(),
      sanitise: this.sanitise(),
      restoreFocus: () => this.restoreFocus(),
    };
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

    // In HTML mode, restore focus to the contenteditable element
    // before executing the action.  In Markdown mode the textarea
    // handles its own focus.
    if (!this.isMarkdownMode()) {
      this.restoreFocus();
    }

    const ctx = this.buildContext();
    const strat = this.strategy();

    if (action === "link") {
      this.openLinkDialog(anchorEl ?? null);
      return;
    }

    if (action === "image") {
      this.openImageDialog(anchorEl ?? null);
      return;
    }

    const handled = strat.execAction(action, ctx);
    if (handled) {
      this.syncValueFromEditor();
      this.doRefreshActiveFormats();
    }
  }

  // ── Placeholder insertion ──────────────────────────────────

  /**
   * Inserts a placeholder at the current caret position.
   *
   * In HTML mode this inserts a chip DOM element.
   * In Markdown mode this inserts a `{{key}}` token string.
   *
   * @internal
   */
  protected insertPlaceholder(placeholder: RichTextPlaceholder): void {
    if (this.disabled() || this.readonly()) return;

    if (this.isMarkdownMode()) {
      this.insertPlaceholderMarkdown(placeholder);
    } else {
      this.insertPlaceholderHtml(placeholder);
    }

    this.isPlaceholderPickerOpen.set(false);
    this.placeholderInserted.emit(placeholder);
  }

  /**
   * Inserts a placeholder chip into the contenteditable editor
   * (HTML mode).
   * @internal
   */
  private insertPlaceholderHtml(placeholder: RichTextPlaceholder): void {
    this.restoreFocus();
    const strat = this.strategy();
    const chip = strat.createPlaceholderChip(placeholder);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(chip);

      range.setStartAfter(chip);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      this.editorRef().nativeElement.appendChild(chip);
    }

    this.syncValueFromEditor();
  }

  /**
   * Inserts a `{{key}}` placeholder token into the Markdown
   * textarea.
   * @internal
   */
  private insertPlaceholderMarkdown(placeholder: RichTextPlaceholder): void {
    const strat = this.strategy();
    if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
      const textarea = strat.textareaEl;
      const token = `{{${placeholder.key}}}`;
      const { selectionStart, selectionEnd, value } = textarea;
      textarea.value =
        value.substring(0, selectionStart) +
        token +
        value.substring(selectionEnd);
      textarea.selectionStart = selectionStart + token.length;
      textarea.selectionEnd = selectionStart + token.length;
      textarea.focus();
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    this.syncValueFromEditor();
  }

  /** @internal */
  protected toggleDropdownGroup(group: string): void {
    if (this.disabled() || this.readonly()) return;
    this.isPlaceholderPickerOpen.set(false);
    this.isEmojiPickerOpen.set(false);
    this.openDropdownGroup.update((current) =>
      current === group ? null : group,
    );
  }

  /** @internal */
  protected togglePlaceholderPicker(): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.isEmojiPickerOpen.set(false);
    this.isPlaceholderPickerOpen.update((v) => {
      if (v) this.placeholderSearchTerm.set("");
      return !v;
    });
  }

  /** @internal */
  protected closePlaceholderPicker(): void {
    this.isPlaceholderPickerOpen.set(false);
    this.placeholderSearchTerm.set("");
  }

  // ── Emoji picker ──────────────────────────────────────────

  /**
   * Toggles the emoji picker dropdown.
   * @internal
   */
  protected toggleEmojiPicker(): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.isPlaceholderPickerOpen.set(false);
    this.isEmojiPickerOpen.update((v) => !v);
  }

  /**
   * Inserts the selected emoji at the current caret position.
   * @internal
   */
  protected insertEmoji(emoji: string): void {
    if (this.disabled() || this.readonly()) return;
    this.isEmojiPickerOpen.set(false);

    if (this.isMarkdownMode()) {
      this.insertEmojiMarkdown(emoji);
    } else {
      this.insertEmojiHtml(emoji);
    }
  }

  /**
   * Inserts an emoji character into the contenteditable editor
   * (HTML mode).
   * @internal
   */
  private insertEmojiHtml(emoji: string): void {
    this.restoreFocus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      this.editorRef().nativeElement.appendChild(
        document.createTextNode(emoji),
      );
    }
    this.syncValueFromEditor();
  }

  /**
   * Inserts an emoji character into the Markdown textarea.
   * @internal
   */
  private insertEmojiMarkdown(emoji: string): void {
    const strat = this.strategy();
    if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
      const textarea = strat.textareaEl;
      const { selectionStart, selectionEnd, value } = textarea;
      textarea.value =
        value.substring(0, selectionStart) +
        emoji +
        value.substring(selectionEnd);
      textarea.selectionStart = selectionStart + emoji.length;
      textarea.selectionEnd = selectionStart + emoji.length;
      textarea.focus();
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    this.syncValueFromEditor();
  }

  /**
   * Updates the placeholder picker search term.
   * @internal
   */
  protected onPlaceholderSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.placeholderSearchTerm.set(input.value);
  }

  // ── Hyperlink dialog ───────────────────────────────────────

  /**
   * Opens the hyperlink popover.
   * @internal
   */
  private openLinkDialog(anchorEl: Element | null): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.isPlaceholderPickerOpen.set(false);
    this.isEmojiPickerOpen.set(false);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0).cloneRange();
    }

    const existingAnchor = this.findAncestorAnchor();
    const isEdit = !!existingAnchor;
    const initialUrl = existingAnchor?.getAttribute("href") ?? "";
    const initialText = existingAnchor
      ? (existingAnchor.textContent ?? "")
      : (sel?.toString() ?? "");

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
        this.savedRange = null;
        this.restoreFocus();
      }
    });
  }

  /**
   * Applies the link result returned by the popover.
   * @internal
   */
  private applyLinkResult(
    result: LinkDialogResult,
    existingAnchor: HTMLAnchorElement | null,
  ): void {
    const ctx = this.buildContext();
    const strat = this.strategy();

    strat.applyLink(result, existingAnchor, this.savedRange, ctx);

    this.savedRange = null;
    this.syncValueFromEditor();
    this.doRefreshActiveFormats();
  }

  /**
   * Finds the closest `<a>` ancestor of the current selection.
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

  // ── Image dialog ───────────────────────────────────────────

  /**
   * Opens the image insertion popover.
   * @internal
   */
  private openImageDialog(anchorEl: Element | null): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.isPlaceholderPickerOpen.set(false);
    this.isEmojiPickerOpen.set(false);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0).cloneRange();
    }

    const anchor = anchorEl ?? this.elRef.nativeElement;

    const ref = this.popoverService.openPopover<
      UIImageDialog,
      ImageDialogResult
    >({
      component: UIImageDialog,
      anchor,
      verticalAxisAlignment: "bottom",
      horizontalAxisAlignment: "center",
      verticalOffset: 4,
      closeOnOutsideClick: true,
      inputs: {
        initialSrc: "",
        initialAlt: "",
      },
    });

    ref.closed.subscribe((result) => {
      if (result) {
        this.applyImageResult(result);
      } else {
        this.savedRange = null;
        this.restoreFocus();
      }
    });
  }

  /**
   * Applies the image result returned by the popover.
   * @internal
   */
  private applyImageResult(result: ImageDialogResult): void {
    const ctx = this.buildContext();
    const strat = this.strategy();

    if (this.isMarkdownMode()) {
      // Insert Markdown image syntax into the textarea
      if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
        const textarea = strat.textareaEl;
        const imgMarkdown = `![${result.alt}](${result.src})`;
        const { selectionStart, selectionEnd, value } = textarea;
        textarea.value =
          value.substring(0, selectionStart) +
          imgMarkdown +
          value.substring(selectionEnd);
        textarea.selectionStart = selectionStart + imgMarkdown.length;
        textarea.selectionEnd = selectionStart + imgMarkdown.length;
        textarea.focus();
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      // Restore selection range and insert <img> in HTML mode
      if (this.savedRange) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(this.savedRange);
        }
      }
      this.restoreFocus();
      const img = document.createElement("img");
      img.src = result.src;
      img.alt = result.alt;
      img.style.maxWidth = "100%";

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        ctx.editorEl.appendChild(img);
      }
    }

    this.savedRange = null;
    this.syncValueFromEditor();
    this.doRefreshActiveFormats();
  }

  /**
   * Returns `true` when the given formatting action is currently
   * active at the caret position.
   * @internal
   */
  protected isActionActive(action: RichTextFormatAction): boolean {
    return this.activeFormats().has(action);
  }

  // ── Source mode ────────────────────────────────────────────

  /**
   * Toggles between WYSIWYG-only and split source + preview mode.
   *
   * In Markdown mode this toggles the preview visibility.
   * In HTML mode this shows the raw HTML textarea.
   *
   * @internal
   */
  protected toggleSourceMode(): void {
    if (this.disabled() || this.readonly()) return;
    this.openDropdownGroup.set(null);
    this.isPlaceholderPickerOpen.set(false);
    this.isEmojiPickerOpen.set(false);
    this.isSourceMode.update((v) => !v);
  }

  /**
   * Handles input events from the source-mode `<textarea>`.
   *
   * In HTML mode: writes raw HTML to `value` and live-renders
   * the preview.
   *
   * In Markdown mode: writes Markdown to `value` and live-renders
   * the HTML preview.
   *
   * @internal
   */
  protected onSourceInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.lastSyncedValue = textarea.value;
    this.value.set(textarea.value);
    this.renderToEditor(textarea.value);
    this.doRefreshActiveFormats();
  }

  // ── Editor event handlers ──────────────────────────────────

  /** @internal */
  protected onEditorInput(): void {
    if (!this.isMarkdownMode()) {
      this.syncValueFromEditor();
    }
  }

  /** @internal */
  protected onEditorFocus(): void {
    this.isFocused.set(true);
    this.doRefreshActiveFormats();
  }

  /** @internal */
  protected onEditorBlur(): void {
    this.isFocused.set(false);
    this.activeFormats.set(new Set());
  }

  /**
   * Handles paste events.
   *
   * When the clipboard contains an image file, the image is
   * processed first:
   * - If an `imageHandler` is provided, it is called and the
   *   returned URL is inserted.
   * - Otherwise the image is embedded inline as a base64
   *   `data:` URI.
   *
   * For non-image paste data, delegates to the active strategy.
   *
   * @internal
   */
  protected onEditorPaste(event: ClipboardEvent): void {
    const imageFile = this.extractImageFile(event);
    if (imageFile) {
      event.preventDefault();
      this.handleImagePaste(imageFile);
      return;
    }
    const ctx = this.buildContext();
    this.strategy().handlePaste(event, ctx);
    this.syncValueFromEditor();
  }

  /**
   * Extracts the first image `File` from a paste event's
   * clipboard data, or `null` if none is present.
   * @internal
   */
  private extractImageFile(event: ClipboardEvent): File | null {
    const items = event.clipboardData?.items;
    if (!items) return null;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) return file;
      }
    }
    return null;
  }

  /**
   * Processes a pasted image file.
   *
   * When an `imageHandler` is provided, it is called with the
   * file and the resulting URL is inserted.  Otherwise the image
   * is read as a base64 data URI and embedded inline.
   *
   * @internal
   */
  private handleImagePaste(file: File): void {
    const handler = this.imageHandler();
    if (handler) {
      handler(file).then(
        (url) => this.insertPastedImage(url, file.name),
        (err) => this.log.error("Image upload failed", [err]),
      );
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.insertPastedImage(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Inserts an image at the current caret position.
   *
   * In HTML mode, inserts an `<img>` element.
   * In Markdown mode, inserts `![alt](url)` syntax.
   *
   * @internal
   */
  private insertPastedImage(src: string, alt: string): void {
    if (this.isMarkdownMode()) {
      const strat = this.strategy();
      if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
        const textarea = strat.textareaEl;
        const imgMarkdown = `![${alt}](${src})`;
        const { selectionStart, selectionEnd, value } = textarea;
        textarea.value =
          value.substring(0, selectionStart) +
          imgMarkdown +
          value.substring(selectionEnd);
        textarea.selectionStart = selectionStart + imgMarkdown.length;
        textarea.selectionEnd = selectionStart + imgMarkdown.length;
        textarea.focus();
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      this.restoreFocus();
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      img.style.maxWidth = "100%";

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        this.editorRef().nativeElement.appendChild(img);
      }
    }
    this.syncValueFromEditor();
  }

  /**
   * Handles keyboard shortcuts and prevents deletion of
   * placeholder chip interiors.  Applies to both HTML and
   * Markdown modes.
   *
   * @internal
   */
  protected onEditorKeydown(event: KeyboardEvent): void {
    if (this.handleKeyboardShortcut(event)) return;

    // Placeholder chip protection — HTML mode only
    if (this.isMarkdownMode()) return;

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

  /**
   * Maps common keyboard shortcuts to formatting actions.
   * Returns `true` if the event was handled.
   *
   * | Shortcut             | Action        |
   * | -------------------- | ------------- |
   * | Ctrl/⌘+B             | bold          |
   * | Ctrl/⌘+I             | italic        |
   * | Ctrl/⌘+U             | underline     |
   * | Ctrl/⌘+Shift+S       | strikethrough |
   * | Ctrl/⌘+Shift+X       | strikethrough |
   * | Ctrl/⌘+K             | link          |
   * | Ctrl/⌘+Z             | undo          |
   * | Ctrl/⌘+Shift+Z / Y   | redo          |
   *
   * @internal
   */
  private handleKeyboardShortcut(event: KeyboardEvent): boolean {
    if (this.disabled() || this.readonly()) return false;

    const mod = event.metaKey || event.ctrlKey;
    if (!mod) return false;

    const key = event.key.toLowerCase();
    let action: RichTextFormatAction | null = null;

    if (!event.shiftKey) {
      switch (key) {
        case "b":
          action = "bold";
          break;
        case "i":
          action = "italic";
          break;
        case "u":
          action = "underline";
          break;
        case "k":
          action = "link";
          break;
        case "z":
          action = "undo";
          break;
        case "y":
          action = "redo";
          break;
      }
    } else {
      switch (key) {
        case "s":
        case "x":
          action = "strikethrough";
          break;
        case "z":
          action = "redo";
          break;
      }
    }

    if (action) {
      event.preventDefault();
      this.execAction(action);
      return true;
    }
    return false;
  }

  // ── Markdown textarea hookup ──────────────────────────────

  /**
   * Called from the template when the Markdown textarea is
   * created, to pass a reference to the strategy.
   * @internal
   */
  protected onMarkdownTextareaCreated(textarea: HTMLTextAreaElement): void {
    const strat = this.strategy();
    if (strat instanceof MarkdownEditingStrategy) {
      strat.textareaEl = textarea;
    }
  }

  // ── Internal helpers ───────────────────────────────────────

  /**
   * Reads the editor content via the active strategy and pushes
   * the serialised value to `this.value`.
   * @internal
   */
  private syncValueFromEditor(): void {
    const ctx = this.buildContext();
    const strat = this.strategy();

    if (this.isMarkdownMode()) {
      // In Markdown mode the textarea is the source of truth
      if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
        const md = strat.textareaEl.value;
        this.lastSyncedValue = md;
        this.value.set(md);
        // Also update the preview
        this.renderToEditor(md);
      }
    } else {
      const editor = this.editorRef().nativeElement;
      const serialised = strat.serialiseContent(editor, ctx);
      this.lastSyncedValue = serialised;
      this.value.set(serialised);
    }
  }

  /**
   * Renders the given value into the preview/editor element
   * via the active strategy.
   * @internal
   */
  private renderToEditor(val: string): void {
    const ctx = this.buildContext();
    const strat = this.strategy();
    const editor = this.editorRef().nativeElement;
    const expanded = strat.deserialiseContent(val, ctx);
    editor.innerHTML = this.sanitise()
      ? strat.sanitiseHtml(expanded)
      : expanded;
  }

  /**
   * Refreshes the active format set via the strategy.
   * @internal
   */
  private doRefreshActiveFormats(): void {
    const ctx = this.buildContext();
    const formats = this.strategy().refreshActiveFormats(ctx);
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
}
