import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { UIRichTextEditor } from "../../rich-text-editor.component";
import { MARKDOWN_PARSER, type MarkdownParser } from "../../markdown-parser";
import type { RichTextTemplateBlockEvent } from "../../rich-text-editor.types";

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
  public readonly ariaLabel = input("Markdown editor with custom parser");

  public readonly disabled = input(false);

  public readonly placeholder = input(
    "Custom parser — headings are uppercased…",
  );

  public readonly presentation = input<"default" | "compact">("default");

  public readonly readonly = input(false);

  public readonly blockInserted = output<RichTextTemplateBlockEvent>();

  public readonly blockEdited = output<RichTextTemplateBlockEvent>();

  public readonly blockRemoved = output<RichTextTemplateBlockEvent>();

  protected readonly value = signal(
    "# Custom parser demo\n\n" +
      "This editor uses a fully custom `MarkdownParser` that\n" +
      "uppercases all headings in the preview.\n\n" +
      "## Try editing this\n\n" +
      "Any heading you type will appear in UPPERCASE in the preview pane, " +
      "while the raw Markdown value stays as-is.",
  );
}
