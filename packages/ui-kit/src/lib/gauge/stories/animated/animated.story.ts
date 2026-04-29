import { UIGauge } from "../../gauge.component";

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
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/gauge/gauge.stories.ts.
}
