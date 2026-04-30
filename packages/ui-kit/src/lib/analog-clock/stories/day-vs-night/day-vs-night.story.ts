import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-day-vs-night-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./day-vs-night.story.html",
  styleUrl: "./day-vs-night.story.scss",
})
export class DayVsNightStorySource {
  protected readonly morningTime = new Date(2026, 0, 1, 9, 15, 0);

  protected readonly nightTime = new Date(2026, 0, 1, 21, 45, 0);
}
