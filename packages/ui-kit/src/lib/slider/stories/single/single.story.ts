import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UISlider } from "../../slider.component";
import type { SliderMode, SliderTick } from "../../slider.types";

@Component({
  selector: "ui-slider-demo",
  standalone: true,
  imports: [UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./single.story.html",
})
export class SliderSingleDemo {
  public readonly volume = signal(50);
  public readonly stepped = signal(30);
}
