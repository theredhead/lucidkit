import { ChangeDetectionStrategy, Component } from "@angular/core";

import { DateInputAdapter } from "../../../input/adapters/date-input-adapter";
import { UIInput } from "../../../input/input.component";

@Component({
  selector: "ui-european-format-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./european-format.story.html",
  styleUrl: "./european-format.story.scss",
})
export class EuropeanFormatStorySource {
  public readonly dateAdapter = new DateInputAdapter({
    format: "dd/MM/yyyy",
    firstDayOfWeek: 1,
  });

  public dateText = "31/12/2025";
}
