import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-world-clocks-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./world-clocks.story.html",
  styleUrl: "./world-clocks.story.scss",
})
export class WorldClocksStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/analog-clock/analog-clock.stories.ts.
}
