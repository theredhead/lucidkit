import { UIInput } from "../../input.component";
import { MoneyTextAdapter } from "../../adapters/money-text-adapter";

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
  protected readonly adapter = new MoneyTextAdapter();
  protected rawAmount = "";
  protected amount: string | null = null;
}
