import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-image-base64-fallback-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./image-base64-fallback.story.html",
  styleUrl: "./image-base64-fallback.story.scss",
})
export class ImageBase64FallbackStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public mode = undefined as never;
  public placeholder = ("Paste an image — it will embed as base64…") as const;
}
