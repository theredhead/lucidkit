import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-placeholders-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./with-placeholders.story.html",
  styleUrl: "./with-placeholders.story.scss",
})
export class WithPlaceholdersStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
