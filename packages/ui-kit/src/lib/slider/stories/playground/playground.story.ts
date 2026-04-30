import { UISlider } from "../../slider.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISlider],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/slider/slider.stories.ts.

  public ariaLabel = ("Slider") as const;
  public disabled = (false) as const;
  public max = (100) as const;
  public min = (0) as const;
  public mode = ("single") as const;
  public showMinMax = (false) as const;
  public showTicks = (false) as const;
  public showValue = (true) as const;
  public step = (1) as const;
}
