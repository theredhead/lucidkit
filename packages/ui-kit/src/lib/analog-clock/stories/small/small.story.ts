import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-small-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./small.story.html",
  styleUrl: "./small.story.scss",
})
export class SmallStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/analog-clock/analog-clock.stories.ts.
}
