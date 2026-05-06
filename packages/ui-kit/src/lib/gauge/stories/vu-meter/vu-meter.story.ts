import { UIGauge } from "../../gauge.component";
import { VuMeterStrategy } from "../../strategies/vu-meter.strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-vu-meter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./vu-meter.story.html",
  styleUrl: "./vu-meter.story.scss",
})
export class VuMeterStorySource {
  protected readonly vuStrategy = new VuMeterStrategy();
  protected level = 68;
}
