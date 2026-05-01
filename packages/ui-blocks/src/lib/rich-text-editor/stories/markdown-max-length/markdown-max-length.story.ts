import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

@Component({
  selector: "ui-markdown-max-length-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./markdown-max-length.story.html",
  styleUrl: "./markdown-max-length.story.scss",
})
export class MarkdownMaxLengthStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Type here…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("markdown");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly maxLength = input<number | undefined>(150);

  public readonly value = model("");
}
