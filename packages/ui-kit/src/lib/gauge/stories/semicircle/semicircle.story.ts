import { UIGauge } from "../../gauge.component";
import type { GaugeZone } from "../../gauge.types";
import { AnalogGaugeStrategy } from "../../strategies/analog-gauge.strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-semicircle-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./semicircle.story.html",
  styleUrl: "./semicircle.story.scss",
})
export class SemicircleStorySource {
  protected readonly semicircleStrategy = new AnalogGaugeStrategy({
    sweepDegrees: 180,
    majorTicks: 5,
  });
  protected temperature = 37;
  protected readonly zones: readonly GaugeZone[] = [
    { from: 0, to: 37, color: "#4285f4", label: "Cold" },
    { from: 37, to: 60, color: "#34a853", label: "Normal" },
    { from: 60, to: 80, color: "#fbbc04", label: "Warm" },
    { from: 80, to: 100, color: "#ea4335", label: "Hot" },
  ];
}
