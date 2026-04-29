import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-fixed-time-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./fixed-time.story.html",
  styleUrl: "./fixed-time.story.scss",
})
export class FixedTimeStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/analog-clock/analog-clock.stories.ts.
}
