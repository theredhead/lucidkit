import { UIGauge } from "../../gauge.component";
import { DigitalGaugeStrategy } from "../../strategies/digital-gauge.strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-digital-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./digital.story.html",
  styleUrl: "./digital.story.scss",
})
export class DigitalStorySource {
  protected readonly digitalStrategy = new DigitalGaugeStrategy();
  protected temperature = 37;
}
