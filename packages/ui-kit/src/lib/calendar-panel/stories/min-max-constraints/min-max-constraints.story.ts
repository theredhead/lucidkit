import { ChangeDetectionStrategy, Component } from "@angular/core";

import { DateInputAdapter } from "../../../input/adapters/date-input-adapter";
import { UIInput } from "../../../input/input.component";

@Component({
  selector: "ui-min-max-constraints-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./min-max-constraints.story.html",
  styleUrl: "./min-max-constraints.story.scss",
})
export class MinMaxConstraintsStorySource {
  public readonly dateAdapter = new DateInputAdapter({
    format: "yyyy-MM-dd",
    min: new Date("2025-01-01T00:00:00"),
    max: new Date("2025-12-31T00:00:00"),
  });

  public dateText = "2025-06-15";
}
