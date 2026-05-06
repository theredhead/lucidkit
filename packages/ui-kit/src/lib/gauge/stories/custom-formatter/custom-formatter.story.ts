import { UIGauge } from "../../gauge.component";
import { AnalogGaugeStrategy } from "../../strategies/analog-gauge.strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-formatter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./custom-formatter.story.html",
  styleUrl: "./custom-formatter.story.scss",
})
export class CustomFormatterStorySource {
  protected readonly analogStrategy = new AnalogGaugeStrategy();
  protected revenue = 3250;

  protected readonly formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
}
