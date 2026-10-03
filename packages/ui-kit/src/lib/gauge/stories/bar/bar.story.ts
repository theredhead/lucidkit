import { UIGauge } from "../../gauge.component";
import type { GaugeZone } from "../../gauge.types";
import { BarGaugeStrategy } from "../../strategies/bar-gauge.strategy";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-bar-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./bar.story.html",
  styleUrl: "./bar.story.scss",
})
export class BarStorySource {

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
  public readonly unit = input<ReturnType<UIGauge["unit"]>>("%");

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly strategy = input<ReturnType<UIGauge["strategy"]>>(new BarGaugeStrategy({ ticks: 10 }));

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly width = input<ReturnType<UIGauge["width"]>>(300);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly height = input<ReturnType<UIGauge["height"]>>(80);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly detailLevel = input<ReturnType<UIGauge["detailLevel"]>>("high");

  protected readonly zones: readonly GaugeZone[] = [
    { from: 0, to: 60, color: "#34a853", label: "Normal" },
    { from: 60, to: 85, color: "#fbbc04", label: "High" },
    { from: 85, to: 100, color: "#ea4335", label: "Critical" },
  ];
}
