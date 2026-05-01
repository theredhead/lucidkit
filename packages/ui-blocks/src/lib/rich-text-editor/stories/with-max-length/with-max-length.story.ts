import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

@Component({
  selector: "ui-with-max-length-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./with-max-length.story.html",
  styleUrl: "./with-max-length.story.scss",
})
export class WithMaxLengthStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Limited to 200 characters…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly maxLength = input<number | undefined>(200);
}
