import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

@Component({
  selector: "ui-max-length-exceeded-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./max-length-exceeded.story.html",
  styleUrl: "./max-length-exceeded.story.scss",
})
export class MaxLengthExceededStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Type here…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly maxLength = input<number | undefined>(40);

  public readonly value = model("");
}
