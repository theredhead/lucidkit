import { createMarkedParser, createMarkdownItParser } from "../markdown-parser";
import {
  MarkdownEditingStrategy,
  markdownToHtml,
  htmlToMarkdown,
} from "./markdown-editing.strategy";

describe("markdownToHtml", () => {
  it("should convert headings", () => {
    expect(markdownToHtml("# Hello")).toBe("<h1>Hello</h1>");
    expect(markdownToHtml("## World")).toBe("<h2>World</h2>");
    expect(markdownToHtml("### Sub")).toBe("<h3>Sub</h3>");
  });

  it("should convert bold text", () => {
    expect(markdownToHtml("**bold**")).toBe("<p><b>bold</b></p>");
  });

  it("should convert italic text", () => {
    expect(markdownToHtml("*italic*")).toBe("<p><i>italic</i></p>");
  });

  it("should convert bold+italic text", () => {
    expect(markdownToHtml("***both***")).toBe("<p><b><i>both</i></b></p>");
  });

  it("should convert strikethrough text", () => {
    expect(markdownToHtml("~~struck~~")).toBe("<p><s>struck</s></p>");
  });

  it("should convert inline code", () => {
    expect(markdownToHtml("`code`")).toBe("<p><code>code</code></p>");
  });

  it("should convert underline (++text++)", () => {
    expect(markdownToHtml("++underlined++")).toBe("<p><u>underlined</u></p>");
  });

  it("should convert links", () => {
    expect(markdownToHtml("[Google](https://google.com)")).toBe(
      '<p><a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a></p>',
    );
  });

  it("should convert images", () => {
    expect(markdownToHtml("![alt](img.png)")).toBe(
      '<p><img alt="alt" src="img.png" /></p>',
    );
  });

  it("should convert unordered lists", () => {
    const md = "- item1\n- item2";
    expect(markdownToHtml(md)).toBe("<ul><li>item1</li><li>item2</li></ul>");
  });

  it("should convert ordered lists", () => {
    const md = "1. first\n2. second";
    expect(markdownToHtml(md)).toBe("<ol><li>first</li><li>second</li></ol>");
  });

  it("should convert blockquotes", () => {
    expect(markdownToHtml("> quoted")).toBe(
      "<blockquote><p>quoted</p></blockquote>",
    );
  });

  it("should convert fenced code blocks", () => {
    const md = "```\nconst x = 1;\n```";
    expect(markdownToHtml(md)).toBe("<pre>const x = 1;</pre>");
  });

  it("should convert horizontal rules", () => {
    expect(markdownToHtml("---")).toBe("<hr>");
    expect(markdownToHtml("***")).toBe("<hr>");
    expect(markdownToHtml("___")).toBe("<hr>");
  });

  it("should handle empty input", () => {
    expect(markdownToHtml("")).toBe("");
  });

  it("should wrap plain text in p tags", () => {
    expect(markdownToHtml("hello")).toBe("<p>hello</p>");
  });

  it("should handle multiple paragraphs separated by blank lines", () => {
    const md = "first\n\nsecond";
    expect(markdownToHtml(md)).toBe("<p>first</p><p>second</p>");
  });

  it("should close unclosed code block", () => {
    const md = "```\ncode without close";
    expect(markdownToHtml(md)).toBe("<pre>code without close</pre>");
  });

  it("should escape HTML inside code blocks", () => {
    const md = "```\n<script>alert('xss')</script>\n```";
    expect(markdownToHtml(md)).toContain("&lt;script&gt;");
  });

  it("should handle list items with * and + markers", () => {
    expect(markdownToHtml("* item")).toContain("<li>item</li>");
    expect(markdownToHtml("+ item")).toContain("<li>item</li>");
  });
});

describe("htmlToMarkdown", () => {
  it("should convert bold", () => {
    expect(htmlToMarkdown("<b>bold</b>")).toBe("**bold**");
  });

  it("should convert strong", () => {
    expect(htmlToMarkdown("<strong>bold</strong>")).toBe("**bold**");
  });

  it("should convert italic", () => {
    expect(htmlToMarkdown("<i>italic</i>")).toBe("*italic*");
    expect(htmlToMarkdown("<em>italic</em>")).toBe("*italic*");
  });

  it("should convert underline", () => {
    expect(htmlToMarkdown("<u>ul</u>")).toBe("++ul++");
  });

  it("should convert strikethrough", () => {
    expect(htmlToMarkdown("<s>struck</s>")).toBe("~~struck~~");
    expect(htmlToMarkdown("<del>struck</del>")).toBe("~~struck~~");
  });

  it("should convert inline code", () => {
    expect(htmlToMarkdown("<code>x</code>")).toBe("`x`");
  });

  it("should convert links", () => {
    expect(htmlToMarkdown('<a href="https://a.com">text</a>')).toBe(
      "[text](https://a.com)",
    );
  });

  it("should convert images", () => {
    expect(htmlToMarkdown('<img alt="pic" src="img.png" />')).toBe(
      "![pic](img.png)",
    );
  });

  it("should convert headings", () => {
    expect(htmlToMarkdown("<h1>H1</h1>").trim()).toBe("# H1");
    expect(htmlToMarkdown("<h2>H2</h2>").trim()).toBe("## H2");
    expect(htmlToMarkdown("<h3>H3</h3>").trim()).toBe("### H3");
  });

  it("should convert paragraphs", () => {
    expect(htmlToMarkdown("<p>text</p>").trim()).toBe("text");
  });

  it("should convert unordered list", () => {
    const html = "<ul><li>a</li><li>b</li></ul>";
    const md = htmlToMarkdown(html).trim();
    expect(md).toContain("- a");
    expect(md).toContain("- b");
  });

  it("should convert ordered list", () => {
    const html = "<ol><li>a</li><li>b</li></ol>";
    const md = htmlToMarkdown(html).trim();
    expect(md).toContain("1. a");
    expect(md).toContain("2. b");
  });

  it("should convert blockquote", () => {
    const html = "<blockquote><p>quoted</p></blockquote>";
    expect(htmlToMarkdown(html).trim()).toContain("> quoted");
  });

  it("should convert pre blocks", () => {
    const html = "<pre>code</pre>";
    expect(htmlToMarkdown(html)).toContain("```");
  });

  it("should convert hr", () => {
    expect(htmlToMarkdown("<hr>")).toContain("---");
  });

  it("should convert br to newline", () => {
    expect(htmlToMarkdown("a<br>b")).toBe("a\nb");
  });

  it("should handle plain text nodes", () => {
    expect(htmlToMarkdown("just text")).toBe("just text");
  });
});

describe("MarkdownEditingStrategy", () => {
  let strategy: MarkdownEditingStrategy;
  let textarea: HTMLTextAreaElement;

  beforeEach(() => {
    strategy = new MarkdownEditingStrategy();
    textarea = document.createElement("textarea");
    strategy.textareaEl = textarea;
  });

  describe("constructor", () => {
    it("should create without parser", () => {
      expect(new MarkdownEditingStrategy()).toBeTruthy();
    });

    it("should accept a custom parser", () => {
      const parser = { toHtml: (md: string) => `<p>${md}</p>` };
      expect(new MarkdownEditingStrategy(parser)).toBeTruthy();
    });
  });

  describe("labels", () => {
    it("should have sourceToggleLabel", () => {
      expect(strategy.sourceToggleLabel).toBeTruthy();
    });

    it("should have previewLabel", () => {
      expect(strategy.previewLabel).toBeTruthy();
    });
  });

  describe("serialiseContent", () => {
    it("should return textarea value", () => {
      textarea.value = "# Hello";
      const divEl = document.createElement("div");
      const ctx = { placeholders: [] } as any;
      expect(strategy.serialiseContent(divEl, ctx)).toBe("# Hello");
    });

    it("should return empty string when no textarea", () => {
      strategy.textareaEl = null;
      const divEl = document.createElement("div");
      const ctx = { placeholders: [] } as any;
      expect(strategy.serialiseContent(divEl, ctx)).toBe("");
    });
  });

  describe("deserialiseContent", () => {
    it("should convert markdown to HTML using built-in parser", () => {
      const ctx = { placeholders: [] } as any;
      const result = strategy.deserialiseContent("**bold**", ctx);
      expect(result).toContain("<b>bold</b>");
    });

    it("should use custom parser when provided", () => {
      const parser = { toHtml: () => "<custom>output</custom>" };
      const s = new MarkdownEditingStrategy(parser);
      const ctx = { placeholders: [] } as any;
      expect(s.deserialiseContent("any", ctx)).toContain(
        "<custom>output</custom>",
      );
    });

    it("should expand placeholder tokens", () => {
      const ctx = {
        placeholders: [{ key: "name", label: "Full Name" }],
      } as any;
      const result = strategy.deserialiseContent("Hello {{name}}", ctx);
      expect(result).toContain("Full Name");
      expect(result).toContain("data-placeholder-key");
    });
  });

  describe("sanitiseHtml", () => {
    it("is a passthrough — returns input unchanged", () => {
      // In Markdown mode all content is either produced by the trusted
      // markdownToHtml() converter or converted from HTML→Markdown via
      // handlePaste().  Neither path needs post-processing sanitisation.
      const input = "<p>hello</p><script>alert(1)</script>";
      expect(strategy.sanitiseHtml(input)).toBe(input);
    });
  });

  describe("markdownToHtml — tables", () => {
    it("renders a basic GFM table", () => {
      const md = `| Name | Age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |`;
      const html = markdownToHtml(md);
      expect(html).toContain("<table>");
      expect(html).toContain("<thead>");
      expect(html).toContain("<tbody>");
      expect(html).toContain("<th>Name</th>");
      expect(html).toContain("<th>Age</th>");
      expect(html).toContain("<td>Alice</td>");
      expect(html).toContain("<td>30</td>");
    });

    it("applies alignment from separator row", () => {
      const md = `| Left | Center | Right |\n| :--- | :---: | ---: |\n| a | b | c |`;
      const html = markdownToHtml(md);
      expect(html).toContain("<th>Left</th>");
      expect(html).toContain('<th style="text-align:center">Center</th>');
      expect(html).toContain('<th style="text-align:right">Right</th>');
    });

    it("renders a table followed by a paragraph", () => {
      const md = `| Col |\n| --- |\n| val |\n\nsome text`;
      const html = markdownToHtml(md);
      expect(html).toContain("<table>");
      expect(html).toContain("<p>some text</p>");
    });

    it("does not treat non-table pipe lines as a table", () => {
      const html = markdownToHtml("just | a | pipe line");
      expect(html).not.toContain("<table>");
    });
  });

  describe("execAction", () => {
    it("should return true when no textarea", () => {
      strategy.textareaEl = null;
      const ctx = { placeholders: [] } as any;
      expect(strategy.execAction("bold", ctx)).toBe(true);
    });

    it("should return false for link action (deferred to dialog)", () => {
      const ctx = { placeholders: [] } as any;
      expect(strategy.execAction("link", ctx)).toBe(false);
    });

    it("should toggle bold wrap", () => {
      textarea.value = "hello world";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;
      strategy.execAction("bold", { placeholders: [] } as any);
      expect(textarea.value).toBe("**hello** world");
    });

    it("should toggle italic wrap", () => {
      textarea.value = "hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;
      strategy.execAction("italic", { placeholders: [] } as any);
      expect(textarea.value).toBe("*hello*");
    });

    it("should toggle strikethrough wrap", () => {
      textarea.value = "hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;
      strategy.execAction("strikethrough", { placeholders: [] } as any);
      expect(textarea.value).toBe("~~hello~~");
    });

    it("should toggle underline wrap", () => {
      textarea.value = "hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;
      strategy.execAction("underline", { placeholders: [] } as any);
      expect(textarea.value).toBe("++hello++");
    });

    it("should handle inlineCode action without error", () => {
      textarea.value = "hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 5;
      // inlineCode is not in INLINE_WRAPS; execAction returns true
      expect(
        strategy.execAction("inlineCode" as any, { placeholders: [] } as any),
      ).toBe(true);
    });

    it("should set heading1 prefix", () => {
      textarea.value = "hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("heading1", { placeholders: [] } as any);
      expect(textarea.value).toBe("# hello");
    });

    it("should set heading2 prefix", () => {
      textarea.value = "hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("heading2", { placeholders: [] } as any);
      expect(textarea.value).toBe("## hello");
    });

    it("should set heading3 prefix", () => {
      textarea.value = "hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("heading3", { placeholders: [] } as any);
      expect(textarea.value).toBe("### hello");
    });

    it("should set unordered list prefix", () => {
      textarea.value = "item";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("unorderedList", { placeholders: [] } as any);
      expect(textarea.value).toBe("- item");
    });

    it("should set ordered list prefix", () => {
      textarea.value = "item";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("orderedList", { placeholders: [] } as any);
      expect(textarea.value).toBe("1. item");
    });

    it("should set blockquote prefix", () => {
      textarea.value = "text";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("blockquote", { placeholders: [] } as any);
      expect(textarea.value).toBe("> text");
    });

    it("should insert horizontal rule", () => {
      textarea.value = "";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("horizontalRule", { placeholders: [] } as any);
      expect(textarea.value).toContain("---");
    });

    it("should toggle code block", () => {
      textarea.value = "code";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 4;
      strategy.execAction("codeBlock", { placeholders: [] } as any);
      expect(textarea.value).toContain("```");
    });

    it("should handle removeFormat", () => {
      textarea.value = "**bold**";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 8;
      strategy.execAction("removeFormat", { placeholders: [] } as any);
      expect(textarea.value).toBe("bold");
    });

    it("should indent lines", () => {
      textarea.value = "hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("indent", { placeholders: [] } as any);
      expect(textarea.value).toBe("  hello");
    });

    it("should outdent lines", () => {
      textarea.value = "  hello";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.execAction("outdent", { placeholders: [] } as any);
      expect(textarea.value).toBe("hello");
    });

    it("should silently handle alignment actions", () => {
      const ctx = { placeholders: [] } as any;
      expect(strategy.execAction("alignLeft", ctx)).toBe(true);
      expect(strategy.execAction("alignCenter", ctx)).toBe(true);
      expect(strategy.execAction("alignRight", ctx)).toBe(true);
      expect(strategy.execAction("alignJustify", ctx)).toBe(true);
    });
  });

  describe("refreshActiveFormats", () => {
    it("should detect heading1", () => {
      textarea.value = "# Heading";
      textarea.selectionStart = 2;
      textarea.selectionEnd = 2;
      const formats = strategy.refreshActiveFormats({
        placeholders: [],
      } as any);
      expect(formats.has("heading1")).toBe(true);
    });

    it("should detect heading2", () => {
      textarea.value = "## Heading";
      textarea.selectionStart = 3;
      textarea.selectionEnd = 3;
      const formats = strategy.refreshActiveFormats({
        placeholders: [],
      } as any);
      expect(formats.has("heading2")).toBe(true);
    });

    it("should detect unordered list", () => {
      textarea.value = "- item";
      textarea.selectionStart = 2;
      textarea.selectionEnd = 2;
      const formats = strategy.refreshActiveFormats({
        placeholders: [],
      } as any);
      expect(formats.has("unorderedList")).toBe(true);
    });

    it("should detect ordered list", () => {
      textarea.value = "1. item";
      textarea.selectionStart = 3;
      textarea.selectionEnd = 3;
      const formats = strategy.refreshActiveFormats({
        placeholders: [],
      } as any);
      expect(formats.has("orderedList")).toBe(true);
    });

    it("should detect blockquote", () => {
      textarea.value = "> quote";
      textarea.selectionStart = 2;
      textarea.selectionEnd = 2;
      const formats = strategy.refreshActiveFormats({
        placeholders: [],
      } as any);
      expect(formats.has("blockquote")).toBe(true);
    });

    it("should detect code block (between fences)", () => {
      textarea.value = "```\ncode\n```";
      textarea.selectionStart = 5;
      textarea.selectionEnd = 5;
      const formats = strategy.refreshActiveFormats({
        placeholders: [],
      } as any);
      expect(formats.has("codeBlock")).toBe(true);
    });

    it("should detect bold in context", () => {
      textarea.value = "**bold**";
      textarea.selectionStart = 3;
      textarea.selectionEnd = 7;
      const formats = strategy.refreshActiveFormats({
        placeholders: [],
      } as any);
      expect(formats.has("bold")).toBe(true);
    });

    it("should return empty set when no textarea", () => {
      strategy.textareaEl = null;
      const formats = strategy.refreshActiveFormats({
        placeholders: [],
      } as any);
      expect(formats.size).toBe(0);
    });
  });

  describe("applyLink", () => {
    it("should insert markdown link at caret", () => {
      textarea.value = "";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      strategy.applyLink({ url: "https://x.com", text: "X" }, null, null, {
        placeholders: [],
      } as any);
      expect(textarea.value).toBe("[X](https://x.com)");
    });
  });

  describe("createPlaceholderChip", () => {
    it("should create a span element", () => {
      const chip = strategy.createPlaceholderChip({
        key: "name",
        label: "Full Name",
      });
      expect(chip.tagName).toBe("SPAN");
      expect(chip.textContent).toBe("Full Name");
      expect(chip.dataset["placeholderKey"]).toBe("name");
      expect(chip.contentEditable).toBe("false");
    });
  });

  describe("handlePaste", () => {
    function fakeClipboardEvent(data: Record<string, string>): ClipboardEvent {
      const dt = {
        getData: (type: string) => data[type] ?? "",
      } as unknown as DataTransfer;
      return {
        clipboardData: dt,
        preventDefault: vi.fn(),
      } as unknown as ClipboardEvent;
    }

    it("should insert plain text when no HTML in clipboard", () => {
      textarea.value = "";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      const event = fakeClipboardEvent({ "text/plain": "pasted text" });
      strategy.handlePaste(event, { placeholders: [] } as any);
      expect(textarea.value).toBe("pasted text");
    });

    it("should convert HTML to markdown when HTML is in clipboard", () => {
      textarea.value = "";
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      const event = fakeClipboardEvent({
        "text/html": "<b>bold</b>",
        "text/plain": "bold",
      });
      strategy.handlePaste(event, { placeholders: [] } as any);
      expect(textarea.value).toBe("**bold**");
    });
  });
});

describe("createMarkedParser", () => {
  it("should delegate to the provided parse function", () => {
    const parser = createMarkedParser((md) => `<marked>${md}</marked>`);
    expect(parser.toHtml("hello")).toBe("<marked>hello</marked>");
  });
});

describe("createMarkdownItParser", () => {
  it("should delegate to the provided render function", () => {
    const parser = createMarkdownItParser((md) => `<mdit>${md}</mdit>`);
    expect(parser.toHtml("hello")).toBe("<mdit>hello</mdit>");
  });
});
