import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

@Component({
  selector: "ui-world-clocks-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./world-clocks.story.html",
  styleUrl: "./world-clocks.story.scss",
})
export class WorldClocksStorySource {
  protected readonly zones = [
    {
      label: "New York",
      time: signal(new Date(2026, 0, 1, 8, 30, 0)),
    },
    {
      label: "London",
      time: signal(new Date(2026, 0, 1, 13, 30, 0)),
    },
    {
      label: "Tokyo",
      time: signal(new Date(2026, 0, 1, 21, 30, 0)),
    },
  ] as const;
}
