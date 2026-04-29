import { UITimeline } from "../../timeline.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-horizontal-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimeline],
  templateUrl: "./horizontal.story.html",
  styleUrl: "./horizontal.story.scss",
})
export class HorizontalStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/timeline/timeline.stories.ts.
}
