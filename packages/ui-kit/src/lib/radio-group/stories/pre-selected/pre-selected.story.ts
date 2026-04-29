import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-pre-selected-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./pre-selected.story.html",
  styleUrl: "./pre-selected.story.scss",
})
export class PreSelectedStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/radio-group/radio-group.stories.ts.
}
