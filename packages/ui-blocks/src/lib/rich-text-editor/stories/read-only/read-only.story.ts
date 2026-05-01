import { UIRichTextEditor } from "../../rich-text-editor.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

@Component({
  selector: "ui-read-only-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./read-only.story.html",
  styleUrl: "./read-only.story.scss",
})
export class ReadOnlyStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(true);
  public readonly placeholder = input("Type here…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");

  public readonly value = model("");
}
