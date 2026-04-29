import { UIGauge } from "../../gauge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-thresholds-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./thresholds.story.html",
  styleUrl: "./thresholds.story.scss",
})
export class ThresholdsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/gauge/gauge.stories.ts.
}
