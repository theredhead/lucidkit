import { UIGauge } from "../../gauge.component";
import { DigitalGaugeStrategy } from "../../strategies/digital-gauge.strategy";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-digital-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./digital.story.html",
  styleUrl: "./digital.story.scss",
})
export class DigitalStorySource {

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly value = input<ReturnType<UIGauge["value"]>>(88.5);

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
  public readonly strategy = input<ReturnType<UIGauge["strategy"]>>(new DigitalGaugeStrategy({ decimals: 1 }));

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly width = input<ReturnType<UIGauge["width"]>>(220);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly height = input<ReturnType<UIGauge["height"]>>(140);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly detailLevel = input<ReturnType<UIGauge["detailLevel"]>>("high");
}
