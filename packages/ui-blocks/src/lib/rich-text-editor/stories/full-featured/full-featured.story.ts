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
  selector: "ui-full-featured-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./full-featured.story.html",
  styleUrl: "./full-featured.story.scss",
})
export class FullFeaturedStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Compose your email template…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly maxLength = input<number | undefined>(500);
  public readonly placeholders = input<readonly RichTextPlaceholder[]>([]);

  public readonly value = model("");
}
