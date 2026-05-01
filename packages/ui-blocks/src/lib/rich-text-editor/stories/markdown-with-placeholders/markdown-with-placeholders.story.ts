import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";
import type {
  RichTextPlaceholder,
  RichTextTemplateBlockEvent,
} from "../../rich-text-editor.types";

@Component({
  selector: "ui-markdown-with-placeholders-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./markdown-with-placeholders.story.html",
  styleUrl: "./markdown-with-placeholders.story.scss",
})
export class MarkdownWithPlaceholdersStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Type here…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("markdown");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly placeholders = input<readonly RichTextPlaceholder[]>([]);
  public readonly blockInserted = output<RichTextTemplateBlockEvent>();
  public readonly blockEdited = output<RichTextTemplateBlockEvent>();
  public readonly blockRemoved = output<RichTextTemplateBlockEvent>();

  public readonly value = model("");
}
