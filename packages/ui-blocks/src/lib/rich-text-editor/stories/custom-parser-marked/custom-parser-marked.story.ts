import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { UIRichTextEditor } from "../../rich-text-editor.component";
import {
  UIButton,
  UIRichTextView,
  UISplitContainer,
  UISplitPanel,
} from "@theredhead/lucid-kit";
import type {
  RichTextPlaceholder,
  RichTextImageHandler,
} from "../../rich-text-editor.types";
import type { RichTextEditorMode } from "../../rich-text-editor.strategy";
import {
  MARKDOWN_PARSER,
  createMarkedParser,
  createMarkdownItParser,
  type MarkdownParser,
} from "../../markdown-parser";
import { TextTemplateProcessor } from "@theredhead/lucid-foundation";

// ═══════════════════════════════════════════════════════════════
//  Pluggable Markdown Parser stories
// ═══════════════════════════════════════════════════════════════

/**
 * Mock parser that simulates a `marked`-powered conversion.
 *
 * In a real application this would call `marked.parse(md)`. Here we
 * use a simple hand-rolled conversion so the story works without
 * installing `marked` as a dependency.
 *
 * @internal
 */
function mockMarkedParse(md: string): string {
  let html = md;
  // headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  // bold / italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<b><i>$1</i></b>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  html = html.replace(/\*(.+?)\*/g, "<i>$1</i>");
  // strikethrough
  html = html.replace(/~~(.+?)~~/g, "<s>$1</s>");
  // inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  // links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // paragraphs (simple: split on double newline)
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (
        !trimmed ||
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<blockquote")
      )
        return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join("\n");
  // single newlines → <br>
  html = html.replace(
    /(<p>(?:(?!<\/p>).)*)<br\/?>(?:(?!<\/p>).)*<\/p>/gs,
    (m) => m,
  );
  return html;
}

// ── Demo wrapper: marked ────────────────────────────────────────

@Component({
  selector: "ui-demo-marked-parser",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  providers: [
    {
      provide: MARKDOWN_PARSER,
      useValue: createMarkedParser((md) => mockMarkedParse(md)),
    },
  ],
  templateUrl: "./custom-parser-marked.story.html",
})
export class DemoMarkedParser {
  protected readonly value = signal(
    "# Hello from marked\n\n" +
      "This editor uses a **custom `MarkdownParser`** provided via the " +
      "`MARKDOWN_PARSER` injection token.\n\n" +
      "In a real app the `createMarkedParser` factory wraps `marked.parse()` — " +
      "here we use a lightweight mock so the story works without installing `marked`.\n\n" +
      "## Features\n\n" +
      "- Full CommonMark support\n" +
      "- GFM tables, task lists, autolinks\n" +
      "- Zero config — just provide the token\n\n" +
      "> The built-in converter is still used as a fallback " +
      "when no `MARKDOWN_PARSER` is provided.",
  );
}
