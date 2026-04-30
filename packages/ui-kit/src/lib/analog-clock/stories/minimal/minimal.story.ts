import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-minimal-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./minimal.story.html",
  styleUrl: "./minimal.story.scss",
})
export class MinimalStorySource {
  public readonly ariaLabel = input("Minimal analog clock");

  public readonly dayIconColor = input("#f59e0b");

  public readonly nightIconColor = input("#e8e0c0");

  public readonly showNumbers = input(false);

  public readonly showSeconds = input(true);

  public readonly showTickMarks = input(false);

  public readonly size = input(200);
}
