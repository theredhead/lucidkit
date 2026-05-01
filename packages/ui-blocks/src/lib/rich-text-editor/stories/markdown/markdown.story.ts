import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

@Component({
  selector: "ui-markdown-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./markdown.story.html",
  styleUrl: "./markdown.story.scss",
})
export class MarkdownStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Write Markdown here…");
  public readonly ariaLabel = input("Markdown editor");
  public readonly mode = input<RichTextEditorMode>("markdown");
  public readonly presentation = input<"default" | "compact">("default");
}
