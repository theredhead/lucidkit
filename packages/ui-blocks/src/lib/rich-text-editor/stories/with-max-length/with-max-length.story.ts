import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-max-length-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./with-max-length.story.html",
  styleUrl: "./with-max-length.story.scss",
})
export class WithMaxLengthStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
