import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";
import type { RichTextFormatAction } from "../../rich-text-editor.types";

@Component({
  selector: "ui-minimal-toolbar-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./minimal-toolbar.story.html",
  styleUrl: "./minimal-toolbar.story.scss",
})
export class MinimalToolbarStorySource {
  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly placeholder = input("Basic formatting only…");
  public readonly ariaLabel = input("Rich text editor");
  public readonly mode = input<RichTextEditorMode>("html");
  public readonly presentation = input<"default" | "compact">("default");
  public readonly toolbarActions = input<readonly RichTextFormatAction[]>([
    "bold",
    "italic",
    "underline",
  ]);
}
