import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-large-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./large.story.html",
  styleUrl: "./large.story.scss",
})
export class LargeStorySource {
  public readonly ariaLabel = input("Large analog clock");

  public readonly dayIconColor = input("#f59e0b");

  public readonly nightIconColor = input("#e8e0c0");

  public readonly showNumbers = input(true);

  public readonly showSeconds = input(true);

  public readonly showTickMarks = input(true);

  public readonly size = input(400);
}
