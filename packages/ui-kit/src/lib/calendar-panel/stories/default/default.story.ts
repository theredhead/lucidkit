import { ChangeDetectionStrategy, Component } from "@angular/core";

import { DateInputAdapter } from "../../../input/adapters/date-input-adapter";
import { UIInput } from "../../../input/input.component";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly dateAdapter = new DateInputAdapter({ format: "yyyy-MM-dd" });

  public dateText = "";
}
