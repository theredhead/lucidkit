import type {
  RichTextFormatAction,
  RichTextPlaceholder,
} from "../rich-text-editor.types";
import {
  getRichTextTemplateBlockUiProvider,
  type RichTextTemplateBlockUiProvider,
} from "../rich-text-editor.types";
import type { LinkDialogResult } from "../link-dialog/link-dialog.component";
import type {
  RichTextEditorContext,
  RichTextEditorStrategy,
} from "../rich-text-editor.strategy";
import { haveRegisteredTextTemplateBlockProvider } from "@theredhead/lucid-foundation";

/**
 * CSS class applied to placeholder chips inside the editable area.
 * @internal
 */
const PLACEHOLDER_CLASS = "rte-placeholder";

/**
 * CSS class applied to any rendered XML template block.
 * @internal
 */
const TEMPLATE_BLOCK_CLASS = "rte-template-block";

/**
 * CSS class applied to editable content inside container template blocks.
 * @internal
 */
const TEMPLATE_BLOCK_CONTENT_CLASS = "content";

/**
 * Rich content tags that should be treated as literal output markup instead of
 * template-editing blocks.
 * @internal
 */
const RICH_CONTENT_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "em",
  "h1",
  "h2",
  "h3",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strike",
  "strong",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

/**
 * HTML void elements that must be serialised as self-closing XML tags.
 * @internal
 */
const XML_VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/**
 * HTML editing strategy for the rich-text editor.
 *
 * Uses the native `contenteditable` API with `document.execCommand`
 * for formatting.  Content is stored as HTML strings with
 * template blocks serialised as XML.
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
      case "alignJustify":
        document.execCommand("justifyFull");
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
    const replacements: string[] = [];
    const blocks = Array.from(
      clone.querySelectorAll<HTMLElement>("[data-template-block]"),
    ).reverse();
    blocks.forEach((block) => {
      const marker = `__RTE_TEMPLATE_BLOCK_${replacements.length}__`;
      replacements.push(this.serialiseTemplateBlock(block));
      block.replaceWith(document.createTextNode(marker));
    });
    const legacyChips = clone.querySelectorAll(`.${PLACEHOLDER_CLASS}`);
    legacyChips.forEach((chip) => {
      const key = chip.getAttribute("data-placeholder-key") ?? "";
      const marker = `__RTE_TEMPLATE_BLOCK_${replacements.length}__`;
      replacements.push(`<placeholder key="${this.escapeAttr(key)}" />`);
      chip.replaceWith(document.createTextNode(marker));
    });
    let html = this.serialiseNodes(clone.childNodes);
    for (let index = replacements.length - 1; index >= 0; index -= 1) {
      const replacement = replacements[index];
      if (replacement === undefined) continue;
      html = html.replace(`__RTE_TEMPLATE_BLOCK_${index}__`, replacement);
    }
    return html;
  }

  public deserialiseContent(value: string, ctx: RichTextEditorContext): string {
    return this.renderTemplateXml(value, ctx);
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

        const isTemplateBlock = child.classList.contains(TEMPLATE_BLOCK_CLASS);
        for (const attr of Array.from(child.attributes)) {
          const name = attr.name.toLowerCase();

          if (name.startsWith("on")) {
            child.removeAttribute(attr.name);
            continue;
          }

          if (name === "style") {
            const sanitisedStyle = this.sanitiseStyleAttr(attr.value);
            if (sanitisedStyle) {
              child.setAttribute("style", sanitisedStyle);
            } else {
              child.removeAttribute("style");
            }
            continue;
          }

          if (
            isTemplateBlock &&
            (name === "contenteditable" ||
              name === "data-placeholder-key" ||
              name === "data-template-block" ||
              name === "data-template-self-closing" ||
              name.startsWith("data-template-attr-"))
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

  /**
   * Filters a `style` attribute value, keeping only safe CSS
   * properties and stripping dangerous values such as
   * `url(...)`, `expression(...)`, and `javascript:`.
   *
   * Returns the cleaned style string, or an empty string if
   * nothing safe remains.
   * @internal
   */
  private sanitiseStyleAttr(style: string): string {
    const dangerous = /url\s*\(|expression\s*\(|javascript\s*:/i;
    const result = style
      .split(";")
      .map((decl) => decl.trim())
      .filter((decl) => decl && !dangerous.test(decl))
      .join("; ");
    return result;
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
      ["alignJustify", "justifyFull"],
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
    chip.className = `${PLACEHOLDER_CLASS} ${TEMPLATE_BLOCK_CLASS}`;
    chip.contentEditable = "false";
    chip.dataset["templateBlock"] = "placeholder";
    chip.dataset["templateSelfClosing"] = "true";
    chip.dataset["templateAttrKey"] = placeholder.key;
    chip.dataset["placeholderKey"] = placeholder.key;
    chip.textContent = placeholder.label;
    return chip;
  }

  // ── Private helpers ───────────────────────────────────────

  /** @internal */
  private renderTemplateXml(value: string, ctx: RichTextEditorContext): string {
    if (!value.includes("<")) return this.escapeHtml(value);
    const parser = new DOMParser();
    const xml = parser.parseFromString(
      `<template-root>${value}</template-root>`,
      "application/xml",
    );
    if (xml.querySelector("parsererror")) return value;
    const root = xml.documentElement;
    return Array.from(root.childNodes)
      .map((node) => this.renderTemplateNode(node, ctx))
      .join("");
  }

  /** @internal */
  private renderTemplateNode(node: Node, ctx: RichTextEditorContext): string {
    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
      return this.escapeHtml(node.textContent ?? "");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const element = node as Element;
    const tag = element.tagName;
    const lowerTag = tag.toLowerCase();
    const uiProvider = getRichTextTemplateBlockUiProvider(tag);
    const isTemplateBlock =
      uiProvider ||
      (!RICH_CONTENT_TAGS.has(lowerTag) &&
        haveRegisteredTextTemplateBlockProvider(tag));

    if (isTemplateBlock) {
      return this.renderTemplateBlockElement(element, ctx, uiProvider);
    }

    const attrs = Array.from(element.attributes)
      .map((attr) => ` ${attr.name}="${this.escapeAttr(attr.value)}"`)
      .join("");
    if (element.childNodes.length === 0) return `<${tag}${attrs} />`;
    const children = Array.from(element.childNodes)
      .map((child) => this.renderTemplateNode(child, ctx))
      .join("");
    return `<${tag}${attrs}>${children}</${tag}>`;
  }

  /** @internal */
  private renderTemplateBlockElement(
    element: Element,
    ctx: RichTextEditorContext,
    provider: RichTextTemplateBlockUiProvider | undefined,
  ): string {
    const attrs = this.readElementAttributes(element);
    const resolvedProvider =
      provider ?? this.createGenericUiProvider(element.tagName, element.childNodes.length === 0);
    if (element.tagName === "placeholder") {
      const key = attrs["key"] ?? "";
      const placeholder = ctx.placeholders.find((p) => p.key === key);
      attrs["label"] = placeholder?.label ?? attrs["label"] ?? key;
    }
    const label = resolvedProvider.formatLabel?.(attrs) ?? resolvedProvider.label;
    const dataAttrs = this.renderTemplateDataAttributes(
      element.tagName,
      attrs,
      resolvedProvider.selfClosing,
    );
    const placeholderAttr =
      element.tagName === "placeholder" && attrs["key"]
        ? ` data-placeholder-key="${this.escapeAttr(attrs["key"])}"`
        : "";

    if (resolvedProvider.selfClosing || element.childNodes.length === 0) {
      const classes =
        element.tagName === "placeholder"
          ? `${PLACEHOLDER_CLASS} ${TEMPLATE_BLOCK_CLASS}`
          : TEMPLATE_BLOCK_CLASS;
      return (
        `<span class="${classes}" contenteditable="false"${dataAttrs}${placeholderAttr}>` +
        `${this.escapeHtml(label)}</span>`
      );
    }

    const body = Array.from(element.childNodes)
      .map((child) => this.renderTemplateNode(child, ctx))
      .join("");
    if (this.isTableRowContainerBlock(element)) {
      return (
        `<tr class="${TEMPLATE_BLOCK_CLASS} table-row-block" ${dataAttrs}>` +
        "<td colspan=\"999\">" +
        '<div class="shell">' +
        `<span class="header" contenteditable="false">${this.escapeHtml(label)}</span>` +
        '<table class="table-content"><tbody class="content">' +
        `${body}</tbody></table>` +
        "</div></td></tr>"
      );
    }
    return (
      `<div class="${TEMPLATE_BLOCK_CLASS} block" ${dataAttrs}>` +
      `<span class="header" contenteditable="false">${this.escapeHtml(label)}</span>` +
      `<div class="${TEMPLATE_BLOCK_CONTENT_CLASS}">${body}</div>` +
      "</div>"
    );
  }

  /** @internal */
  private readElementAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    for (const attr of Array.from(element.attributes)) {
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  /** @internal */
  private renderTemplateDataAttributes(
    name: string,
    attrs: Record<string, string>,
    selfClosing: boolean,
  ): string {
    const parts = [
      ` data-template-block="${this.escapeAttr(name)}"`,
      ` data-template-self-closing="${selfClosing ? "true" : "false"}"`,
    ];
    for (const [key, value] of Object.entries(attrs)) {
      parts.push(` data-template-attr-${key}="${this.escapeAttr(value)}"`);
    }
    return parts.join("");
  }

  /** @internal */
  private createGenericUiProvider(
    name: string,
    selfClosing: boolean,
  ): RichTextTemplateBlockUiProvider {
    return {
      name,
      label: name,
      selfClosing,
      display: selfClosing ? "inline" : "block",
      formatLabel: (attributes) => {
        const detail = Object.entries(attributes)
          .filter(([key]) => key !== "label")
          .map(([key, value]) => `${key}=${value}`)
          .join(", ");
        return detail ? `${name}: ${detail}` : name;
      },
    };
  }

  /** @internal */
  private serialiseTemplateBlock(block: HTMLElement): string {
    const name = block.dataset["templateBlock"] ?? "placeholder";
    const attrs = this.readTemplateDatasetAttributes(block);
    const attrText = Object.entries(attrs)
      .filter(([key]) => key !== "label" || name !== "placeholder")
      .map(([key, value]) => ` ${key}="${this.escapeAttr(value)}"`)
      .join("");
    const selfClosing = block.dataset["templateSelfClosing"] === "true";
    if (selfClosing) return `<${name}${attrText} />`;

    if (block instanceof HTMLTemplateElement) {
      const children = this.serialiseNodes(block.content.childNodes);
      return `<${name}${attrText}>${children}</${name}>`;
    }

    const content = block.querySelector(`.${TEMPLATE_BLOCK_CONTENT_CLASS}`);
    const children = content ? this.serialiseNodes(content.childNodes) : "";
    return `<${name}${attrText}>${children}</${name}>`;
  }

  /** @internal */
  private serialiseNodes(nodes: Iterable<Node>): string {
    return Array.from(nodes)
      .map((node) => this.serialiseNode(node))
      .join("");
  }

  /** @internal */
  private serialiseNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return this.escapeText(node.textContent ?? "");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const element = node as Element;
    if (element.hasAttribute("data-template-visual-block")) return "";
    if (element instanceof HTMLElement && element.dataset["templateBlock"]) {
      return this.serialiseTemplateBlock(element);
    }

    const tag = element.localName.toLowerCase();
    const attrs = Array.from(element.attributes)
      .map((attr) => ` ${attr.name}="${this.escapeAttr(attr.value)}"`)
      .join("");
    if (XML_VOID_TAGS.has(tag)) return `<${tag}${attrs} />`;
    return `<${tag}${attrs}>${this.serialiseNodes(element.childNodes)}</${tag}>`;
  }

  /** @internal */
  private isTableRowContainerBlock(element: Element): boolean {
    const elementChildren = Array.from(element.childNodes).filter(
      (node): node is Element => node.nodeType === Node.ELEMENT_NODE,
    );
    if (!elementChildren.length) return false;
    return elementChildren.every(
      (child) => child.tagName.toLowerCase() === "tr",
    );
  }

  /** @internal */
  private readTemplateDatasetAttributes(
    block: HTMLElement,
  ): Record<string, string> {
    const attrs: Record<string, string> = {};
    for (const [key, value] of Object.entries(block.dataset)) {
      if (!key.startsWith("templateAttr") || value === undefined) continue;
      const attrName = key
        .slice("templateAttr".length)
        .replace(/^[A-Z]/, (first) => first.toLowerCase())
        .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      attrs[attrName] = value;
    }
    if (!attrs["key"] && block.dataset["placeholderKey"]) {
      attrs["key"] = block.dataset["placeholderKey"];
    }
    return attrs;
  }

  /** XML-escape text content. */
  private escapeText(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;");
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
