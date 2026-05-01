import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

import { UISlider } from "../../slider.component";
import type { SliderMode } from "../../slider.types";

@Component({
  selector: "ui-slider-demo",
  standalone: true,
  imports: [UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./single.story.html",
})
export class SliderSingleDemo {
  public readonly ariaLabel = input("Volume");

  public readonly disabled = input(false);

  public readonly max = input(100);

  public readonly min = input(0);

  public readonly mode = input<SliderMode>("single");

  public readonly showMinMax = input(false);

  public readonly showTicks = input(false);

  public readonly showValue = input(true);

  public readonly step = input(1);

  public readonly volume = signal(50);
  public readonly stepped = signal(30);
}
