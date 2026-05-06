import { UIGauge } from "../../gauge.component";
import type { GaugeZone } from "../../gauge.types";
import { BarGaugeStrategy } from "../../strategies/bar-gauge.strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-bar-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./bar.story.html",
  styleUrl: "./bar.story.scss",
})
export class BarStorySource {
  protected readonly barStrategy = new BarGaugeStrategy();
  protected cpuLoad = 65;
  protected readonly zones: readonly GaugeZone[] = [
    { from: 0, to: 60, color: "#34a853", label: "Normal" },
    { from: 60, to: 85, color: "#fbbc04", label: "High" },
    { from: 85, to: 100, color: "#ea4335", label: "Critical" },
  ];
}
