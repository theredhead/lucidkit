import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-max-length-exceeded-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./max-length-exceeded.story.html",
  styleUrl: "./max-length-exceeded.story.scss",
})
export class MaxLengthExceededStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
