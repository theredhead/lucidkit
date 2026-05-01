import { ChangeDetectionStrategy, Component } from "@angular/core";

import { DateInputAdapter } from "../../../input/adapters/date-input-adapter";
import { TimeTextAdapter } from "../../../input/adapters/time-text-adapter";
import { UIInput } from "../../../input/input.component";

@Component({
  selector: "ui-date-and-time-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./date-and-time.story.html",
  styleUrl: "./date-and-time.story.scss",
})
export class DateAndTimeStorySource {
  public readonly dateAdapter = new DateInputAdapter({ format: "yyyy-MM-dd" });
  public readonly timeAdapter = new TimeTextAdapter();

  public dateText = "";
  public timeText = "";
}
