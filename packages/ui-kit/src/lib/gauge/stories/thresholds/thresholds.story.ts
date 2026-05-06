import { UIGauge } from "../../gauge.component";
import type { GaugeZone } from "../../gauge.types";
import { AnalogGaugeStrategy } from "../../strategies/analog-gauge.strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-thresholds-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./thresholds.story.html",
  styleUrl: "./thresholds.story.scss",
})
export class ThresholdsStorySource {
  protected readonly strategy = new AnalogGaugeStrategy();
  protected load = 55;
  protected readonly zones: readonly GaugeZone[] = [
    { from: 0, to: 40, color: "#34a853", label: "Normal" },
    { from: 40, to: 75, color: "#fbbc04", label: "High" },
    { from: 75, to: 100, color: "#ea4335", label: "Critical" },
  ];
}
