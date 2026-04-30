import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIIcons } from "../../../icon";

@Component({
  selector: "ui-custom-icons-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./custom-icons.story.html",
  styleUrl: "./custom-icons.story.scss",
})
export class CustomIconsStorySource {
  public readonly ariaLabel = input("Analog clock with custom icons");

  public readonly dayIconColor = input("#ec4899");

  public readonly nightIconColor = input("#fbbf24");

  public readonly showNumbers = input(true);

  public readonly showSeconds = input(true);

  public readonly showTickMarks = input(true);

  public readonly size = input(200);

  protected readonly sparkles = UIIcons.Lucide.Cursors.Sparkles;

  protected readonly star = UIIcons.Lucide.Shapes.Star;
}
