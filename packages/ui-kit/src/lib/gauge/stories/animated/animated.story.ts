import { UIGauge } from "../../gauge.component";
import type { GaugeZone } from "../../gauge.types";
import { AnalogGaugeStrategy } from "../../strategies/analog-gauge.strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-animated-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./animated.story.html",
  styleUrl: "./animated.story.scss",
})
export class AnimatedStorySource {
  protected readonly analogStrategy = new AnalogGaugeStrategy();
  protected speed = 72;
  protected readonly speedZones: readonly GaugeZone[] = [
    { from: 0, to: 80, color: "#34a853", label: "Safe" },
    { from: 80, to: 140, color: "#fbbc04", label: "Caution" },
    { from: 140, to: 220, color: "#ea4335", label: "Danger" },
  ];
}
