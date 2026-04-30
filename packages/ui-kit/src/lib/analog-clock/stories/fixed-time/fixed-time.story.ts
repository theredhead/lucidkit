import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-fixed-time-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./fixed-time.story.html",
  styleUrl: "./fixed-time.story.scss",
})
export class FixedTimeStorySource {
  public readonly ariaLabel = input("Analog clock at 10:08 AM");

  public readonly dayIconColor = input("#f59e0b");

  public readonly nightIconColor = input("#e8e0c0");

  public readonly showNumbers = input(true);

  public readonly showSeconds = input(true);

  public readonly showTickMarks = input(true);

  public readonly size = input(200);

  protected readonly fixedTime = new Date(2026, 0, 1, 10, 8, 30);
}
