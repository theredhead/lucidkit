import { UIGauge } from "../../gauge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-analog-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./analog.story.html",
  styleUrl: "./analog.story.scss",
})
export class AnalogStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/gauge/gauge.stories.ts.
}
