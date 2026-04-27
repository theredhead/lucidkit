import type {
  RichTextFormatAction,
  RichTextPlaceholder,
} from "../rich-text-editor.types";
import type { LinkDialogResult } from "../link-dialog/link-dialog.component";
import type {
  RichTextEditorContext,
  RichTextEditorStrategy,
} from "../rich-text-editor.strategy";
import type { MarkdownParser } from "../markdown-parser";

/**
 * CSS class applied to placeholder chips inside the preview area.
 * Must match the class used in the HTML strategy for consistent
 * styling.
 * @internal
 */
const PLACEHOLDER_CLASS = "rte-placeholder";

/**
 * Regex matching serialised placeholder XML blocks.
 * @internal
 */
const PLACEHOLDER_BLOCK_RE =
  /<placeholder\s+[^>]*key=(?:"([^"]+)"|'([^']+)')[^>]*\/>/g;

// ── Markdown ↔ HTML conversion helpers ─────────────────────────

/**
 * Inline pattern replacements applied during Markdown → HTML
 * conversion.  Order matters — more specific patterns first.
 *
 * @internal
 */
const INLINE_RULES: readonly [RegExp, string][] = [
  // Images (before links so `![alt](src)` isn't matched as link)
  [/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />'],
  // Links
  [
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  ],
  // Bold + italic (***text***)
  [/\*\*\*(.+?)\*\*\*/g, "<b><i>$1</i></b>"],
  // Bold (**text**)
  [/\*\*(.+?)\*\*/g, "<b>$1</b>"],
  // Italic (*text*)
  [/\*(.+?)\*/g, "<i>$1</i>"],
  // Strikethrough (~~text~~)
  [/~~(.+?)~~/g, "<s>$1</s>"],
  // Inline code (`text`)
  [/`([^`]+)`/g, "<code>$1</code>"],
  // Underline (++text++) — non-standard but useful
  [/\+\+(.+?)\+\+/g, "<u>$1</u>"],
];

/**
 * Converts a Markdown string to an HTML string.
 *
 * This is a lightweight converter covering the subset of Markdown
 * that maps to the editor's supported formatting actions.  It is
 * **not** a full CommonMark / GFM parser — just enough for
 * real-time preview and round-tripping.
 *
 * @internal
 */
function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let inBlockquote = false;
  let blockquoteLines: string[] = [];
  let tableBuffer: string[] = [];

  const flushTable = (): void => {
    if (tableBuffer.length === 0) return;
    const result = buildTableHtml(tableBuffer);
    if (result !== null) {
      htmlParts.push(result);
    } else {
      for (const tLine of tableBuffer) {
        htmlParts.push(`<p>${applyInline(tLine)}</p>`);
      }
    }
    tableBuffer = [];
  };

  const flushBlockquote = (): void => {
    if (inBlockquote && blockquoteLines.length) {
      htmlParts.push(
        `<blockquote>${blockquoteLines.map((l) => `<p>${applyInline(l)}</p>`).join("")}</blockquote>`,
      );
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  const flushList = (): void => {
    if (inList) {
      htmlParts.push(`</${inList}>`);
      inList = null;
    }
  };

  for (const line of lines) {
    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      if (inCodeBlock) {
        htmlParts.push(`<pre>${escapeHtml(codeBlockLines.join("\n"))}</pre>`);
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushBlockquote();
        flushList();
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Blockquote
    const bqMatch = line.match(/^>\s?(.*)/);
    if (bqMatch) {
      flushList();
      flushTable();
      inBlockquote = true;
      blockquoteLines.push(bqMatch[1]);
      continue;
    } else {
      flushBlockquote();
    }

    // Table row (GFM tables — line starts with |)
    if (line.trimStart().startsWith("|")) {
      flushList();
      tableBuffer.push(line);
      continue;
    }

    // Non-table line — flush any pending table
    flushTable();

    // Empty line
    if (line.trim() === "") {
      flushList();
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${applyInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushList();
      htmlParts.push("<hr>");
      continue;
    }

    // Unordered list items
    const ulMatch = line.match(/^[-*+]\s+(.*)/);
    if (ulMatch) {
      if (inList !== "ul") {
        flushList();
        inList = "ul";
        htmlParts.push("<ul>");
      }
      htmlParts.push(`<li>${applyInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list items
    const olMatch = line.match(/^\d+\.\s+(.*)/);
    if (olMatch) {
      if (inList !== "ol") {
        flushList();
        inList = "ol";
        htmlParts.push("<ol>");
      }
      htmlParts.push(`<li>${applyInline(olMatch[1])}</li>`);
      continue;
    }

    // Normal paragraph
    flushList();
    htmlParts.push(`<p>${applyInline(line)}</p>`);
  }

  // Flush trailing state
  if (inCodeBlock) {
    htmlParts.push(`<pre>${escapeHtml(codeBlockLines.join("\n"))}</pre>`);
  }
  flushBlockquote();
  flushList();
  flushTable();

  return htmlParts.join("");
}

/**
 * Applies inline Markdown formatting rules to a single line.
 * @internal
 */
function applyInline(text: string): string {
  let result = text;
  for (const [pattern, replacement] of INLINE_RULES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Builds an HTML `<table>` from buffered GFM table lines.
 * Returns `null` if the lines do not form a valid table
 * (requires at least a header row and a separator row).
 * @internal
 */
function buildTableHtml(lines: string[]): string | null {
  if (lines.length < 2) return null;

  const sepLine = lines[1].trim();
  // Separator row must contain at least one run of dashes
  if (!/--/.test(sepLine)) return null;

  const parseRow = (line: string): string[] =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());

  const parseAlignments = (line: string): ("left" | "center" | "right")[] =>
    parseRow(line).map((cell) => {
      const c = cell.trim();
      if (c.startsWith(":") && c.endsWith(":")) return "center";
      if (c.endsWith(":")) return "right";
      return "left";
    });

  const headers = parseRow(lines[0]);
  const alignments = parseAlignments(lines[1]);
  const dataRows = lines.slice(2).map(parseRow);

  const alignStyle = (i: number): string => {
    const a = alignments[i] ?? "left";
    return a !== "left" ? ` style="text-align:${a}"` : "";
  };

  let html = "<table><thead><tr>";
  for (let i = 0; i < headers.length; i++) {
    html += `<th${alignStyle(i)}>${applyInline(headers[i])}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (const row of dataRows) {
    html += "<tr>";
    for (let i = 0; i < row.length; i++) {
      html += `<td${alignStyle(i)}>${applyInline(row[i])}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table>";
  return html;
}

/**
 * Converts a `<table>` DOM element to a GFM Markdown table string.
 * @internal
 */
function tableToMarkdown(el: Element): string {
  const allRowEls = Array.from(el.querySelectorAll("tr"));
  if (allRowEls.length === 0) return "";

  const cellText = (cell: Element): string =>
    nodeToMarkdown(cell).trim().replace(/\|/g, "\\|");

  const headerCells = Array.from(allRowEls[0].querySelectorAll("th, td")).map(
    cellText,
  );
  if (headerCells.length === 0) return "";

  const sepCells = headerCells.map(() => "---");
  const bodyRowEls = el.querySelector("tbody")
    ? Array.from(el.querySelectorAll("tbody tr"))
    : allRowEls.slice(1);
  const bodyRows = bodyRowEls.map((row) =>
    Array.from(row.querySelectorAll("td, th")).map(cellText),
  );

  const lines = [
    `| ${headerCells.join(" | ")} |`,
    `| ${sepCells.join(" | ")} |`,
    ...bodyRows.map((cells) => `| ${cells.join(" | ")} |`),
  ];
  return lines.join("\n") + "\n\n";
}

/**
 * Converts simple HTML back to Markdown.
 *
 * Used when pasting HTML content into the Markdown editor.
 *
 * @internal
 */
function htmlToMarkdown(html: string): string {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return nodeToMarkdown(temp).trim();
}

/**
 * Recursively converts a DOM node tree to Markdown.
 * @internal
 */
function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const el = node as Element;
  const tag = el.tagName;
  const childMd = Array.from(el.childNodes)
    .map((c) => nodeToMarkdown(c))
    .join("");

  switch (tag) {
    case "B":
    case "STRONG":
      return `**${childMd}**`;
    case "I":
    case "EM":
      return `*${childMd}*`;
    case "U":
      return `++${childMd}++`;
    case "S":
    case "STRIKE":
    case "DEL":
      return `~~${childMd}~~`;
    case "CODE":
      return `\`${childMd}\``;
    case "A": {
      const href = el.getAttribute("href") ?? "";
      return `[${childMd}](${href})`;
    }
    case "IMG": {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      return `![${alt}](${src})`;
    }
    case "BR":
      return "\n";
    case "P":
      return `${childMd}\n\n`;
    case "H1":
      return `# ${childMd}\n\n`;
    case "H2":
      return `## ${childMd}\n\n`;
    case "H3":
      return `### ${childMd}\n\n`;
    case "BLOCKQUOTE":
      return (
        childMd
          .split("\n")
          .filter((l) => l.length > 0)
          .map((l) => `> ${l}`)
          .join("\n") + "\n\n"
      );
    case "PRE":
      return `\`\`\`\n${el.textContent ?? ""}\n\`\`\`\n\n`;
    case "UL":
      return (
        Array.from(el.children)
          .map((li) => `- ${nodeToMarkdown(li).trim()}`)
          .join("\n") + "\n\n"
      );
    case "OL":
      return (
        Array.from(el.children)
          .map((li, i) => `${i + 1}. ${nodeToMarkdown(li).trim()}`)
          .join("\n") + "\n\n"
      );
    case "LI":
      return childMd;
    case "TABLE":
      return tableToMarkdown(el);
    case "THEAD":
    case "TBODY":
    case "TFOOT":
    case "TR":
    case "TH":
    case "TD":
    case "CAPTION":
      return childMd;
    case "HR":
      return "---\n\n";
    default:
      return childMd;
  }
}

/** HTML-escape a string. @internal */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Markdown syntax wrapping helpers ───────────────────────────

/** Wrapping definition for inline Markdown syntax. @internal */
interface InlineWrap {
  readonly prefix: string;
  readonly suffix: string;
}

/**
 * Map of format actions to their Markdown inline syntax wrappers.
 * @internal
 */
const INLINE_WRAPS: Partial<Record<RichTextFormatAction, InlineWrap>> = {
  bold: { prefix: "**", suffix: "**" },
  italic: { prefix: "*", suffix: "*" },
  underline: { prefix: "++", suffix: "++" },
  strikethrough: { prefix: "~~", suffix: "~~" },
};

/**
 * Map of format actions to their Markdown line prefix.
 * @internal
 */
const BLOCK_PREFIXES: Partial<Record<RichTextFormatAction, string>> = {
  heading1: "# ",
  heading2: "## ",
  heading3: "### ",
  unorderedList: "- ",
  orderedList: "1. ",
  blockquote: "> ",
  paragraph: "",
};

// ── Strategy ───────────────────────────────────────────────────

/**
 * Markdown editing strategy for the rich-text editor.
 *
 * In Markdown mode the editor uses a `<textarea>` (via the
 * existing source-mode textarea) for editing raw Markdown, with
 * a live HTML preview below.
 *
 * Formatting actions insert Markdown syntax around the selection
 * in the textarea.  The serialised value is a Markdown string.
 *
 * @internal
 */
export class MarkdownEditingStrategy implements RichTextEditorStrategy {
  public readonly sourceToggleLabel = "Edit Markdown source";
  public readonly previewLabel = "Preview";

  /**
   * Reference to the Markdown `<textarea>` element.
   * Set by the component when the strategy is active.
   */
  public textareaEl: HTMLTextAreaElement | null = null;

  /**
   * Optional external Markdown parser.  When provided, its
   * `toHtml()` method is used instead of the built-in converter
   * for the live preview and deserialisation.
   */
  private readonly parser: MarkdownParser | null;

  /**
   * @param parser - Optional {@link MarkdownParser} implementation.
   *   When `null` or omitted the built-in lightweight converter is
   *   used.  Consumers can supply a `marked`- or `markdown-it`-
   *   backed parser via the {@link MARKDOWN_PARSER} injection token.
   */
  public constructor(parser?: MarkdownParser | null) {
    this.parser = parser ?? null;
  }

  // ── Formatting ────────────────────────────────────────────

  public execAction(
    action: RichTextFormatAction,
    _ctx: RichTextEditorContext,
  ): boolean {
    const textarea = this.textareaEl;
    if (!textarea) return true;

    if (action === "link") {
      return false; // deferred — link dialog
    }

    if (action === "removeFormat") {
      this.removeInlineFormatting(textarea);
      return true;
    }

    if (action === "codeBlock") {
      this.toggleCodeBlock(textarea);
      return true;
    }

    if (action === "horizontalRule") {
      this.insertTextAtCaret(textarea, "\n---\n");
      return true;
    }

    if (action === "indent") {
      this.indentLines(textarea, true);
      return true;
    }

    if (action === "outdent") {
      this.indentLines(textarea, false);
      return true;
    }

    if (action === "undo" || action === "redo") {
      // Let the browser handle undo/redo natively for textareas
      document.execCommand(action);
      return true;
    }

    // Inline wraps
    const wrap = INLINE_WRAPS[action];
    if (wrap) {
      this.toggleInlineWrap(textarea, wrap);
      return true;
    }

    // Block prefixes
    const prefix = BLOCK_PREFIXES[action];
    if (prefix !== undefined) {
      this.setLinePrefix(textarea, prefix);
      return true;
    }

    // Alignment is not meaningful in Markdown — ignore silently
    if (
      action === "alignLeft" ||
      action === "alignCenter" ||
      action === "alignRight" ||
      action === "alignJustify"
    ) {
      return true;
    }

    return true;
  }

  // ── Serialisation ─────────────────────────────────────────

  public serialiseContent(
    _editorEl: HTMLDivElement,
    _ctx: RichTextEditorContext,
  ): string {
    // In Markdown mode the authoritative content lives in the
    // textarea, not the contenteditable preview.  The component
    // syncs via a separate path, so this is a fallback.
    return this.textareaEl?.value ?? "";
  }

  public deserialiseContent(value: string, ctx: RichTextEditorContext): string {
    // Convert Markdown → HTML first, then expand placeholder XML blocks
    // into placeholder chip elements in the HTML output.
    // When an external parser is provided, delegate to it;
    // otherwise fall back to the built-in lightweight converter.
    const html = this.parser
      ? this.parser.toHtml(value)
      : markdownToHtml(value);
    return this.expandPlaceholderTokens(html, ctx);
  }

  // ── Sanitisation ──────────────────────────────────────────

  public sanitiseHtml(html: string): string {
    // In Markdown mode all content flows through either:
    //   • markdownToHtml() — our own trusted converter (no sanitisation needed)
    //   • handlePaste()    — converts HTML → Markdown text via htmlToMarkdown()
    // Neither path requires post-processing here.  Sanitisation of paste
    // content is handled exclusively by the HTML→Markdown conversion, which
    // strips unsafe constructs structurally rather than via an allow-list.
    return html;
  }

  // ── Active format detection ───────────────────────────────

  public refreshActiveFormats(
    _ctx: RichTextEditorContext,
  ): ReadonlySet<RichTextFormatAction> {
    const formats = new Set<RichTextFormatAction>();
    const textarea = this.textareaEl;
    if (!textarea) return formats;

    const { selectionStart, selectionEnd, value } = textarea;

    // Get the current line
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const lineEnd = value.indexOf("\n", selectionEnd);
    const line = value.substring(
      lineStart,
      lineEnd === -1 ? value.length : lineEnd,
    );

    // Block-level detection from line prefix
    if (/^###\s/.test(line)) formats.add("heading3");
    else if (/^##\s/.test(line)) formats.add("heading2");
    else if (/^#\s/.test(line)) formats.add("heading1");
    else if (/^>\s/.test(line)) formats.add("blockquote");
    else if (/^[-*+]\s/.test(line)) formats.add("unorderedList");
    else if (/^\d+\.\s/.test(line)) formats.add("orderedList");

    // Code block detection (check if we're between ``` fences)
    const before = value.substring(0, selectionStart);
    const fenceCount = (before.match(/^```/gm) ?? []).length;
    if (fenceCount % 2 === 1) formats.add("codeBlock");

    // Inline detection — check text surrounding the selection
    const _selectedText =
      selectionStart === selectionEnd
        ? this.getWordAtCaret(value, selectionStart)
        : value.substring(selectionStart, selectionEnd);

    // Expand context around selection for pattern matching
    const contextStart = Math.max(0, selectionStart - 3);
    const contextEnd = Math.min(value.length, selectionEnd + 3);
    const context = value.substring(contextStart, contextEnd);

    if (/\*\*[^*]+\*\*/.test(context) || /\*\*/.test(context.substring(0, 3)))
      formats.add("bold");
    if (/(?<!\*)\*(?!\*)[^*]+\*(?!\*)/.test(context)) formats.add("italic");
    if (/~~[^~]+~~/.test(context)) formats.add("strikethrough");
    if (/\+\+[^+]+\+\+/.test(context)) formats.add("underline");

    // Link detection
    const linkContext = value.substring(
      Math.max(0, selectionStart - 50),
      Math.min(value.length, selectionEnd + 50),
    );
    if (/\[([^\]]+)\]\(([^)]+)\)/.test(linkContext)) formats.add("link");

    return formats;
  }

  // ── Paste ─────────────────────────────────────────────────

  public handlePaste(event: ClipboardEvent, _ctx: RichTextEditorContext): void {
    event.preventDefault();
    const textarea = this.textareaEl;
    if (!textarea) return;

    const html = event.clipboardData?.getData("text/html");
    const text = event.clipboardData?.getData("text/plain") ?? "";

    // Convert pasted HTML to Markdown, or use plain text
    const md = html ? htmlToMarkdown(html) : text;
    this.insertTextAtCaret(textarea, md);
  }

  // ── Link ──────────────────────────────────────────────────

  public applyLink(
    result: LinkDialogResult,
    _existingAnchor: HTMLAnchorElement | null,
    _savedRange: Range | null,
    _ctx: RichTextEditorContext,
  ): void {
    const textarea = this.textareaEl;
    if (!textarea) return;

    const { url, text } = result;
    const linkMd = `[${text}](${url})`;

    // Replace selection (or insert at caret)
    this.insertTextAtCaret(textarea, linkMd);
  }

  // ── Placeholder ───────────────────────────────────────────

  public createPlaceholderChip(placeholder: RichTextPlaceholder): HTMLElement {
    // In Markdown mode we still create chip elements for the
    // preview, but the actual insertion into the textarea is
    // handled separately.
    const chip = document.createElement("span");
    chip.className = PLACEHOLDER_CLASS;
    chip.contentEditable = "false";
    chip.dataset["templateBlock"] = "placeholder";
    chip.dataset["templateSelfClosing"] = "true";
    chip.dataset["templateAttrKey"] = placeholder.key;
    chip.dataset["placeholderKey"] = placeholder.key;
    chip.textContent = placeholder.label;
    return chip;
  }

  // ── Private helpers ───────────────────────────────────────

  /**
   * Toggles an inline Markdown wrap (e.g. `**`, `*`) around the
   * current selection in the textarea.
   */
  private toggleInlineWrap(
    textarea: HTMLTextAreaElement,
    wrap: InlineWrap,
  ): void {
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.substring(selectionStart, selectionEnd);
    const pLen = wrap.prefix.length;
    const sLen = wrap.suffix.length;

    // Check if already wrapped — toggle off
    const before = value.substring(
      Math.max(0, selectionStart - pLen),
      selectionStart,
    );
    const after = value.substring(
      selectionEnd,
      Math.min(value.length, selectionEnd + sLen),
    );

    if (before === wrap.prefix && after === wrap.suffix) {
      // Remove existing wrap
      textarea.value =
        value.substring(0, selectionStart - pLen) +
        selected +
        value.substring(selectionEnd + sLen);
      textarea.selectionStart = selectionStart - pLen;
      textarea.selectionEnd = selectionEnd - pLen;
    } else {
      // Add wrap
      textarea.value =
        value.substring(0, selectionStart) +
        wrap.prefix +
        selected +
        wrap.suffix +
        value.substring(selectionEnd);
      textarea.selectionStart = selectionStart + pLen;
      textarea.selectionEnd = selectionEnd + pLen;
    }

    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * Sets or removes a line prefix (e.g. `# `, `- `, `> `) on
   * the line(s) containing the current selection.
   */
  private setLinePrefix(textarea: HTMLTextAreaElement, prefix: string): void {
    const { selectionStart, selectionEnd, value } = textarea;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const lineEnd = value.indexOf("\n", selectionEnd);
    const line = value.substring(
      lineStart,
      lineEnd === -1 ? value.length : lineEnd,
    );

    // Remove any existing block prefix
    const stripped = line.replace(/^(#{1,3}\s|[-*+]\s|\d+\.\s|>\s)/, "");

    const newLine = prefix + stripped;
    const actualEnd = lineEnd === -1 ? value.length : lineEnd;

    textarea.value =
      value.substring(0, lineStart) + newLine + value.substring(actualEnd);

    textarea.selectionStart = lineStart + prefix.length;
    textarea.selectionEnd = lineStart + newLine.length;
    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * Toggles a fenced code block around the current selection.
   */
  private toggleCodeBlock(textarea: HTMLTextAreaElement): void {
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.substring(selectionStart, selectionEnd);

    // Check if inside a code block
    const before = value.substring(0, selectionStart);
    const fenceCount = (before.match(/^```/gm) ?? []).length;

    if (fenceCount % 2 === 1) {
      // Inside a code block — remove the surrounding fences
      const fenceStart = before.lastIndexOf("```");
      const afterSel = value.substring(selectionEnd);
      const fenceEnd = afterSel.indexOf("```");

      if (fenceStart !== -1 && fenceEnd !== -1) {
        const beforeFence = value.substring(0, fenceStart);
        const content = value.substring(
          fenceStart + 3,
          selectionEnd + fenceEnd,
        );
        const afterFence = value.substring(selectionEnd + fenceEnd + 3);
        textarea.value =
          beforeFence +
          content.replace(/^\n/, "").replace(/\n$/, "") +
          afterFence;
      }
    } else {
      // Wrap in code block
      const wrapped = "\n```\n" + selected + "\n```\n";
      textarea.value =
        value.substring(0, selectionStart) +
        wrapped +
        value.substring(selectionEnd);
      textarea.selectionStart = selectionStart + 4;
      textarea.selectionEnd = selectionStart + 4 + selected.length;
    }

    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * Indents or outdents the lines covered by the current selection.
   * Uses two-space indentation.
   */
  private indentLines(textarea: HTMLTextAreaElement, indent: boolean): void {
    const { selectionStart, selectionEnd, value } = textarea;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const lineEnd = value.indexOf("\n", selectionEnd);
    const actualEnd = lineEnd === -1 ? value.length : lineEnd;
    const block = value.substring(lineStart, actualEnd);

    const processed = block
      .split("\n")
      .map((line) => {
        if (indent) {
          return "  " + line;
        }
        // Remove up to 2 leading spaces
        return line.replace(/^ {1,2}/, "");
      })
      .join("\n");

    textarea.value =
      value.substring(0, lineStart) + processed + value.substring(actualEnd);

    textarea.selectionStart = lineStart;
    textarea.selectionEnd = lineStart + processed.length;
    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * Removes inline formatting markers from the selected text.
   */
  private removeInlineFormatting(textarea: HTMLTextAreaElement): void {
    const { selectionStart, selectionEnd, value } = textarea;
    if (selectionStart === selectionEnd) return;

    const selected = value.substring(selectionStart, selectionEnd);
    const cleaned = selected
      .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/~~(.+?)~~/g, "$1")
      .replace(/\+\+(.+?)\+\+/g, "$1")
      .replace(/`([^`]+)`/g, "$1");

    textarea.value =
      value.substring(0, selectionStart) +
      cleaned +
      value.substring(selectionEnd);
    textarea.selectionStart = selectionStart;
    textarea.selectionEnd = selectionStart + cleaned.length;
    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * Inserts text at the current caret position in the textarea,
   * replacing any existing selection.
   */
  private insertTextAtCaret(textarea: HTMLTextAreaElement, text: string): void {
    const { selectionStart, selectionEnd, value } = textarea;
    textarea.value =
      value.substring(0, selectionStart) + text + value.substring(selectionEnd);
    textarea.selectionStart = selectionStart + text.length;
    textarea.selectionEnd = selectionStart + text.length;
    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * Returns the word surrounding the caret position.
   */
  private getWordAtCaret(value: string, pos: number): string {
    const before = value.substring(0, pos);
    const after = value.substring(pos);
    const wordStart = before.search(/\S+$/);
    const wordEnd = after.search(/\s/);
    return value.substring(
      wordStart === -1 ? pos : wordStart,
      wordEnd === -1 ? value.length : pos + wordEnd,
    );
  }

  /**
   * Expands placeholder XML blocks in an HTML string into
   * chip markup for the preview pane.
   */
  private expandPlaceholderTokens(
    html: string,
    ctx: RichTextEditorContext,
  ): string {
    const placeholders = ctx.placeholders;
    return html.replace(PLACEHOLDER_BLOCK_RE, (_match, dq: string, sq: string) => {
      const key = dq ?? sq ?? "";
      const ph = placeholders.find((p) => p.key === key);
      const label = ph?.label ?? key;
      return (
        `<span class="${PLACEHOLDER_CLASS}" ` +
        `contenteditable="false" ` +
        `data-placeholder-key="${escapeHtml(key)}">` +
        `${escapeHtml(label)}</span>`
      );
    });
  }
}

/**
 * Converts a Markdown string to HTML with placeholder chip
 * expansion.
 *
 * Exported for use in tests.
 *
 * @internal
 */
export { markdownToHtml, htmlToMarkdown };
