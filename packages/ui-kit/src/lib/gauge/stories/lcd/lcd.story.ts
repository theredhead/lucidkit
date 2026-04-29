import { UIGauge } from "../../gauge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-lcd-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./lcd.story.html",
  styleUrl: "./lcd.story.scss",
})
export class LCDStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/gauge/gauge.stories.ts.
}
