import { UIGauge } from "../../gauge.component";
import { LcdGaugeStrategy } from "../../strategies/lcd-gauge.strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-lcd-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./lcd.story.html",
  styleUrl: "./lcd.story.scss",
})
export class LCDStorySource {
  protected readonly lcdStrategy = new LcdGaugeStrategy();
  protected temperature = 37;
}
