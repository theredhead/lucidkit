import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";
import type { RichTextTemplateBlockEvent } from "../../rich-text-editor.types";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Type here…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly blockInserted = output<RichTextTemplateBlockEvent>();
  public readonly blockEdited = output<RichTextTemplateBlockEvent>();
  public readonly blockRemoved = output<RichTextTemplateBlockEvent>();
}
