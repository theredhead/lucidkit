import { UISlider } from "../../slider.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-ticks-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISlider],
  templateUrl: "./ticks.story.html",
  styleUrl: "./ticks.story.scss",
})
export class TicksStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/slider/slider.stories.ts.
}
