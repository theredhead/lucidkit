import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-small-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./small.story.html",
  styleUrl: "./small.story.scss",
})
export class SmallStorySource {
  public readonly ariaLabel = input("Small analog clock");

  public readonly dayIconColor = input("#f59e0b");

  public readonly nightIconColor = input("#e8e0c0");

  public readonly showNumbers = input(true);

  public readonly showSeconds = input(true);

  public readonly showTickMarks = input(true);

  public readonly size = input(80);
}
