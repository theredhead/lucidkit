import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";
import type {
  RichTextPlaceholder,
  RichTextTemplateBlockEvent,
} from "../../rich-text-editor.types";

@Component({
  selector: "ui-with-placeholders-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./with-placeholders.story.html",
  styleUrl: "./with-placeholders.story.scss",
})
export class WithPlaceholdersStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Compose your email template…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly blockInserted = output<RichTextTemplateBlockEvent>();
  public readonly blockEdited = output<RichTextTemplateBlockEvent>();
  public readonly blockRemoved = output<RichTextTemplateBlockEvent>();
  public readonly placeholders = input<readonly RichTextPlaceholder[]>([]);
}
