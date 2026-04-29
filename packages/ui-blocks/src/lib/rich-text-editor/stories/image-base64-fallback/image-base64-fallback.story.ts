import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-image-base64-fallback-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./image-base64-fallback.story.html",
  styleUrl: "./image-base64-fallback.story.scss",
})
export class ImageBase64FallbackStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
