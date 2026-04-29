import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-no-seconds-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./no-seconds.story.html",
  styleUrl: "./no-seconds.story.scss",
})
export class NoSecondsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/analog-clock/analog-clock.stories.ts.
}
