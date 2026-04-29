import { UITimeline } from "../../timeline.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-vertical-start-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimeline],
  templateUrl: "./vertical-start.story.html",
  styleUrl: "./vertical-start.story.scss",
})
export class VerticalStartStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/timeline/timeline.stories.ts.
}
