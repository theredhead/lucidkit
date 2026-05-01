import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-money-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./money-adapter.story.html",
  styleUrl: "./money-adapter.story.scss",
})
export class MoneyAdapterStorySource {
}
