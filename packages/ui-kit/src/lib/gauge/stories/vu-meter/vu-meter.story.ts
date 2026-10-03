import { UIGauge } from "../../gauge.component";
import { VuMeterStrategy } from "../../strategies/vu-meter.strategy";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-vu-meter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./vu-meter.story.html",
  styleUrl: "./vu-meter.story.scss",
})
export class VuMeterStorySource {

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
  public readonly unit = input<ReturnType<UIGauge["unit"]>>("dB");

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly strategy = input<ReturnType<UIGauge["strategy"]>>(new VuMeterStrategy());

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly width = input<ReturnType<UIGauge["width"]>>(120);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly height = input<ReturnType<UIGauge["height"]>>(260);

  /**
   * Storybook control forwarded to the gauge example.
   */
  public readonly detailLevel = input<ReturnType<UIGauge["detailLevel"]>>("high");
}
