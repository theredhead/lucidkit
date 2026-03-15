import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";

import {
  DEFAULT_TOOLBAR_ACTIONS,
  TOOLBAR_BUTTON_REGISTRY,
  type RichTextFormatAction,
  type RichTextPlaceholder,
  type ToolbarButtonMeta,
} from "./rich-text-editor.types";

/**
 * The CSS class applied to placeholder chips inside the editable area.
 * @internal
 */
const PLACEHOLDER_CLASS = "rte-placeholder";

/**
 * Regex matching serialised placeholder tokens: `{{key}}`.
 * @internal
 */
const PLACEHOLDER_TOKEN_RE = /\{\{(\w+)\}\}/g;

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./rich-text-editor.component.html",
  styleUrl: "./rich-text-editor.component.scss",
  host: {
    class: "ui-rich-text-editor",
    "[class.ui-rich-text-editor--disabled]": "disabled()",
    "[class.ui-rich-text-editor--readonly]": "readonly()",
  },
})
export class UIRichTextEditor implements AfterViewInit {
  private readonly elRef = inject(ElementRef<HTMLElement>);

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
    const groups: { group: string; buttons: ToolbarButtonMeta[] }[] = [];
    let currentGroup = "";
    for (const btn of buttons) {
      const g = btn.group ?? "";
      if (g !== currentGroup) {
        currentGroup = g;
        groups.push({ group: g, buttons: [] });
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

  // ── Lifecycle ──────────────────────────────────────────────

  ngAfterViewInit(): void {
    this.renderHtmlToEditor(this.value());
    this.initialised = true;
  }

  // ── Formatting commands ────────────────────────────────────

  /**
   * Executes a formatting action.
   *
   * @internal
   */
  protected execAction(action: RichTextFormatAction): void {
    if (this.disabled() || this.readonly()) return;
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
      case "heading1":
        document.execCommand("formatBlock", false, "h1");
        break;
      case "heading2":
        document.execCommand("formatBlock", false, "h2");
        break;
      case "heading3":
        document.execCommand("formatBlock", false, "h3");
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
      case "removeFormat":
        document.execCommand("removeFormat");
        break;
    }

    this.syncValueFromEditor();
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
  protected togglePlaceholderPicker(): void {
    if (this.disabled() || this.readonly()) return;
    this.isPlaceholderPickerOpen.update((v) => !v);
  }

  /** @internal */
  protected closePlaceholderPicker(): void {
    this.isPlaceholderPickerOpen.set(false);
  }

  // ── Editor event handlers ──────────────────────────────────

  /** @internal */
  protected onEditorInput(): void {
    this.syncValueFromEditor();
  }

  /** @internal */
  protected onEditorFocus(): void {
    this.isFocused.set(true);
  }

  /** @internal */
  protected onEditorBlur(): void {
    this.isFocused.set(false);
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
      // Strip to basic formatting only
      const cleaned = this.sanitiseHtml(html);
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
    this.value.set(html);
  }

  /**
   * Renders the given HTML string into the editor element,
   * expanding `{{key}}` tokens into placeholder chips.
   *
   * @internal
   */
  private renderHtmlToEditor(html: string): void {
    const editor = this.editorRef().nativeElement;
    editor.innerHTML = this.deserialiseContent(html);
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
   * Very basic HTML sanitisation — keeps only inline formatting
   * tags.  This is intentionally simple; the component is not a
   * security boundary.
   */
  private sanitiseHtml(html: string): string {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Walk and strip disallowed elements but keep their text
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
    ]);
    const walk = (el: Element) => {
      for (const child of Array.from(el.children)) {
        if (!allowed.has(child.tagName)) {
          child.replaceWith(...Array.from(child.childNodes));
        } else {
          // Remove all attributes except class on spans
          for (const attr of Array.from(child.attributes)) {
            if (attr.name !== "class") child.removeAttribute(attr.name);
          }
          walk(child);
        }
      }
    };
    walk(temp);
    return temp.innerHTML;
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
