import { UIGauge } from "../../gauge.component";
import type { GaugeZone } from "../../gauge.types";
import { AnalogGaugeStrategy } from "../../strategies/analog-gauge.strategy";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-responsive-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./responsive.story.html",
  styleUrl: "./responsive.story.scss",
})
export class ResponsiveStorySource {

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly value = input<ReturnType<UIGauge["value"]>>(72);

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
  public readonly unit = input<ReturnType<UIGauge["unit"]>>("km/h");

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly detailLevel = input<ReturnType<UIGauge["detailLevel"]>>("high");

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly strategy = input<ReturnType<UIGauge["strategy"]>>(new AnalogGaugeStrategy());

  protected readonly zones: readonly GaugeZone[] = [
    { from: 0, to: 80, color: "#34a853", label: "Safe" },
    { from: 80, to: 140, color: "#fbbc04", label: "Caution" },
    { from: 140, to: 220, color: "#ea4335", label: "Danger" },
  ];
}
