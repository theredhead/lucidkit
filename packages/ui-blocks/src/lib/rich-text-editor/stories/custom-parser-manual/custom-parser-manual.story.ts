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

// ── Demo wrapper: fully custom parser ───────────────────────────

/**
 * A deliberately minimal custom parser that demonstrates
 * implementing the `MarkdownParser` interface from scratch.
 * It uppercases headings and wraps paragraphs — nothing more.
 *
 * @internal
 */
const customParser: MarkdownParser = {
  toHtml(markdown: string): string {
    return markdown
      .split(/\n{2,}/)
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        const h1 = /^# (.+)$/.exec(trimmed);
        if (h1) return `<h1>${h1[1].toUpperCase()}</h1>`;
        const h2 = /^## (.+)$/.exec(trimmed);
        if (h2) return `<h2>${h2[1].toUpperCase()}</h2>`;
        return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
      })
      .join("\n");
  },
};

@Component({
  selector: "ui-demo-custom-parser",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  providers: [
    {
      provide: MARKDOWN_PARSER,
      useValue: customParser,
    },
  ],
  templateUrl: "./custom-parser-manual.story.html",
})
export class DemoCustomParser {
  protected readonly value = signal(
    "# Custom parser demo\n\n" +
      "This editor uses a fully custom `MarkdownParser` that\n" +
      "uppercases all headings in the preview.\n\n" +
      "## Try editing this\n\n" +
      "Any heading you type will appear in UPPERCASE in the preview pane, " +
      "while the raw Markdown value stays as-is.",
  );
}
