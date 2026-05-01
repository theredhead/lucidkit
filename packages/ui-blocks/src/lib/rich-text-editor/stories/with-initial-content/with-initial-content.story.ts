import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";
import type { RichTextPlaceholder } from "../../rich-text-editor.types";

@Component({
  selector: "ui-with-initial-content-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./with-initial-content.story.html",
  styleUrl: "./with-initial-content.story.scss",
})
export class WithInitialContentStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Type here…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly placeholders = input<readonly RichTextPlaceholder[]>([]);

  public readonly value = model("");
}
