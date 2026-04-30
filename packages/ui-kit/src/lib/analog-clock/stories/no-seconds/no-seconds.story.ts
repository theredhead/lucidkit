import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-no-seconds-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./no-seconds.story.html",
  styleUrl: "./no-seconds.story.scss",
})
export class NoSecondsStorySource {
  public readonly ariaLabel = input("Analog clock without second hand");

  public readonly dayIconColor = input("#f59e0b");

  public readonly nightIconColor = input("#e8e0c0");

  public readonly showNumbers = input(true);

  public readonly showSeconds = input(false);

  public readonly showTickMarks = input(true);

  public readonly size = input(200);
}
