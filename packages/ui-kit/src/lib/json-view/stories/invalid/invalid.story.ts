import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIJsonView } from "../../json-view.component";

@Component({
  selector: "ui-json-view-invalid-story",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIJsonView],
  templateUrl: "./invalid.story.html",
  styleUrl: "./invalid.story.scss",
})
export class JsonViewInvalidStory {
  protected readonly malformedJson = `{ "name": "broken", "value": `;
  protected readonly emptyString = "";
  protected readonly notAString = 42 as unknown as string;
}
