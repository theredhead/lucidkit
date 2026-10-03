import { UIGauge } from "../../gauge.component";
import type { GaugeZone } from "../../gauge.types";
import { AnalogGaugeStrategy } from "../../strategies/analog-gauge.strategy";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-semicircle-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./semicircle.story.html",
  styleUrl: "./semicircle.story.scss",
})
export class SemicircleStorySource {

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly value = input<ReturnType<UIGauge["value"]>>(65);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly min = input<ReturnType<UIGauge["min"]>>(0);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly max = input<ReturnType<UIGauge["max"]>>(100);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly unit = input<ReturnType<UIGauge["unit"]>>("°C");

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly strategy = input<ReturnType<UIGauge["strategy"]>>(new AnalogGaugeStrategy({ sweepDegrees: 180, majorTicks: 5 }));

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly width = input<ReturnType<UIGauge["width"]>>(280);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly height = input<ReturnType<UIGauge["height"]>>(160);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly detailLevel = input<ReturnType<UIGauge["detailLevel"]>>("high");

  protected readonly zones: readonly GaugeZone[] = [
    { from: 0, to: 37, color: "#4285f4", label: "Cold" },
    { from: 37, to: 60, color: "#34a853", label: "Normal" },
    { from: 60, to: 80, color: "#fbbc04", label: "Warm" },
    { from: 80, to: 100, color: "#ea4335", label: "Hot" },
  ];
}
