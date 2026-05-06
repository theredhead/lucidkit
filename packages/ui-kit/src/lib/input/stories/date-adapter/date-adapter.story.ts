import { UIInput } from "../../input.component";
import { DateTextAdapter } from "../../adapters/date-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-date-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./date-adapter.story.html",
  styleUrl: "./date-adapter.story.scss",
})
export class DateAdapterStorySource {
  protected readonly adapter = new DateTextAdapter();
  protected rawDate = "";
  protected dateValue: string | null = null;
}
