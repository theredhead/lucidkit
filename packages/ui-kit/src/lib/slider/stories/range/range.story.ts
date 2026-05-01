import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

import { UISlider } from "../../slider.component";
import type { SliderMode } from "../../slider.types";

@Component({
  selector: "ui-slider-range-demo",
  standalone: true,
  imports: [UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./range.story.html",
})
export class SliderRangeDemo {
  public readonly ariaLabel = input("Price");

  public readonly disabled = input(false);

  public readonly max = input(1000);

  public readonly min = input(0);

  public readonly mode = input<SliderMode>("range");

  public readonly showMinMax = input(false);

  public readonly showTicks = input(false);

  public readonly showValue = input(true);

  public readonly step = input(10);

  public readonly priceRange = signal<readonly [number, number]>([200, 800]);
  public readonly ageRange = signal<readonly [number, number]>([25, 45]);
}
