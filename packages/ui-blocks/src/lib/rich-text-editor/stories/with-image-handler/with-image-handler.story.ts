import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";
import type { RichTextImageHandler } from "../../rich-text-editor.types";

@Component({
  selector: "ui-with-image-handler-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./with-image-handler.story.html",
  styleUrl: "./with-image-handler.story.scss",
})
export class WithImageHandlerStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Paste an image here…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");

  public readonly imageHandler = input.required<RichTextImageHandler>();
}
