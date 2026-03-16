import type {
  RichTextFormatAction,
  RichTextPlaceholder,
} from "../rich-text-editor.types";
import type { LinkDialogResult } from "../link-dialog/link-dialog.component";
import type {
  RichTextEditorContext,
  RichTextEditorStrategy,
} from "../rich-text-editor.strategy";

/**
 * CSS class applied to placeholder chips inside the editable area.
 * @internal
 */
const PLACEHOLDER_CLASS = "rte-placeholder";

/**
 * Regex matching serialised placeholder tokens: `{{key}}`.
 * @internal
 */
const PLACEHOLDER_TOKEN_RE = /\{\{([\w.:-]+)\}\}/g;

/**
 * HTML editing strategy for the rich-text editor.
 *
 * Uses the native `contenteditable` API with `document.execCommand`
 * for formatting.  Content is stored as HTML strings with
 * placeholder tokens serialised as `{{key}}`.
 *
 * @internal
 */
export class HtmlEditingStrategy implements RichTextEditorStrategy {
  public readonly sourceToggleLabel = "Edit HTML source";
  public readonly previewLabel = "Preview";

  // ── Formatting ────────────────────────────────────────────

  public execAction(
    action: RichTextFormatAction,
    _ctx: RichTextEditorContext,
  ): boolean {
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
      case "horizontalRule":
        document.execCommand("insertHorizontalRule");
        break;
      case "indent":
        document.execCommand("indent");
        break;
      case "outdent":
        document.execCommand("outdent");
        break;
      case "undo":
        document.execCommand("undo");
        break;
      case "redo":
        document.execCommand("redo");
        break;
      case "link":
        return false; // deferred — link dialog opens separately
      case "removeFormat":
        document.execCommand("removeFormat");
        break;
    }
    return true;
  }

  // ── Serialisation ─────────────────────────────────────────

  public serialiseContent(
    editorEl: HTMLDivElement,
    _ctx: RichTextEditorContext,
  ): string {
    const clone = editorEl.cloneNode(true) as HTMLDivElement;
    const chips = clone.querySelectorAll(`.${PLACEHOLDER_CLASS}`);
    chips.forEach((chip) => {
      const key = chip.getAttribute("data-placeholder-key") ?? "";
      const token = document.createTextNode(`{{${key}}}`);
      chip.replaceWith(token);
    });
    return clone.innerHTML;
  }

  public deserialiseContent(value: string, ctx: RichTextEditorContext): string {
    const placeholders = ctx.placeholders;
    return value.replace(PLACEHOLDER_TOKEN_RE, (_match, key: string) => {
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

  // ── Sanitisation ──────────────────────────────────────────

  public sanitiseHtml(html: string): string {
    const temp = document.createElement("div");
    temp.innerHTML = html;

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
      "PRE",
      "CODE",
      "BLOCKQUOTE",
      "HR",
      "IMG",
    ]);

    const safeAttrs: ReadonlySet<string> = new Set([
      "class",
      "href",
      "target",
      "rel",
      "src",
      "alt",
    ]);

    const dangerousSchemeRe = /^\s*(javascript|vbscript|data)\s*:/i;
    const dataImageRe = /^\s*data:image\//i;

    const walk = (el: Element): void => {
      for (const child of Array.from(el.children)) {
        if (dangerous.has(child.tagName)) {
          child.remove();
          continue;
        }

        if (!allowed.has(child.tagName)) {
          child.replaceWith(...Array.from(child.childNodes));
          continue;
        }

        const isChip = child.classList.contains(PLACEHOLDER_CLASS);
        for (const attr of Array.from(child.attributes)) {
          const name = attr.name.toLowerCase();

          if (name.startsWith("on")) {
            child.removeAttribute(attr.name);
            continue;
          }

          if (name === "style") {
            child.removeAttribute(attr.name);
            continue;
          }

          if (
            isChip &&
            (name === "contenteditable" || name === "data-placeholder-key")
          ) {
            continue;
          }

          if (
            (name === "href" || name === "src" || name === "action") &&
            dangerousSchemeRe.test(attr.value)
          ) {
            // Allow data:image/* URIs on <img> src
            if (
              name === "src" &&
              child.tagName === "IMG" &&
              dataImageRe.test(attr.value)
            ) {
              continue;
            }
            child.removeAttribute(attr.name);
            continue;
          }

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

  // ── Active format detection ───────────────────────────────

  public refreshActiveFormats(
    ctx: RichTextEditorContext,
  ): ReadonlySet<RichTextFormatAction> {
    const formats = new Set<RichTextFormatAction>();

    // Inline toggles
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

    // Block format (headings, blockquote, code)
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

    // Lists
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

    // Alignment
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

    // Link detection
    {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        let node: Node | null = sel.anchorNode;
        while (node && node !== ctx.editorEl) {
          if (node instanceof HTMLAnchorElement) {
            formats.add("link");
            break;
          }
          node = node.parentNode;
        }
      }
    }

    return formats;
  }

  // ── Paste ─────────────────────────────────────────────────

  public handlePaste(event: ClipboardEvent, ctx: RichTextEditorContext): void {
    event.preventDefault();
    const html = event.clipboardData?.getData("text/html");
    const text = event.clipboardData?.getData("text/plain") ?? "";

    if (html) {
      const cleaned = ctx.sanitise ? this.sanitiseHtml(html) : html;
      document.execCommand("insertHTML", false, cleaned);
    } else {
      document.execCommand("insertText", false, text);
    }
  }

  // ── Link ──────────────────────────────────────────────────

  public applyLink(
    result: LinkDialogResult,
    existingAnchor: HTMLAnchorElement | null,
    savedRange: Range | null,
    ctx: RichTextEditorContext,
  ): void {
    const { url, text } = result;

    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
    }

    ctx.restoreFocus();

    if (existingAnchor) {
      existingAnchor.setAttribute("href", url);
      existingAnchor.setAttribute("target", "_blank");
      existingAnchor.setAttribute("rel", "noopener noreferrer");
      existingAnchor.textContent = text;
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = text;

      if (savedRange) {
        savedRange.deleteContents();
        savedRange.insertNode(a);

        const range = document.createRange();
        range.setStartAfter(a);
        range.collapse(true);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  // ── Placeholder ───────────────────────────────────────────

  public createPlaceholderChip(placeholder: RichTextPlaceholder): HTMLElement {
    const chip = document.createElement("span");
    chip.className = PLACEHOLDER_CLASS;
    chip.contentEditable = "false";
    chip.dataset["placeholderKey"] = placeholder.key;
    chip.textContent = placeholder.label;
    return chip;
  }

  // ── Private helpers ───────────────────────────────────────

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
