import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-credit-card-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./credit-card-adapter.story.html",
  styleUrl: "./credit-card-adapter.story.scss",
})
export class CreditCardAdapterStorySource {
}
