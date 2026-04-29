import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-read-only-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./read-only.story.html",
  styleUrl: "./read-only.story.scss",
})
export class ReadOnlyStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
