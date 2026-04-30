import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { UISlider } from "../../slider.component";

@Component({
  selector: "ui-slider-range-demo",
  standalone: true,
  imports: [UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./range.story.html",
})
export class SliderRangeDemo {
  public readonly priceRange = signal<readonly [number, number]>([200, 800]);
  public readonly ageRange = signal<readonly [number, number]>([25, 45]);
}
