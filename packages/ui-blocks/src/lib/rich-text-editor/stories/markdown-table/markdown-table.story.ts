import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

@Component({
  selector: "ui-markdown-table-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./markdown-table.story.html",
  styleUrl: "./markdown-table.story.scss",
})
export class MarkdownTableStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Write Markdown…");
  public readonly ariaLabel = input("Markdown table demo");
  public readonly mode = input<RichTextEditorMode>("markdown");
  public readonly presentation = input<"default" | "compact">("default");

  public readonly value = model("");
}
