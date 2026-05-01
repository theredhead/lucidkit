import { UISlider } from "../../slider.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

import type { SliderMode, SliderTick } from "../../slider.types";

@Component({
  selector: "ui-ticks-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISlider],
  templateUrl: "./ticks.story.html",
  styleUrl: "./ticks.story.scss",
})
export class TicksStorySource {
  public readonly ariaLabel = input("Auto");

  public readonly auto = signal(40);

  public readonly disabled = input(false);

  public readonly labelled = signal(50);

  public readonly max = input(100);

  public readonly min = input(0);

  public readonly mode = input<SliderMode>("single");

  public readonly showMinMax = input(false);

  public readonly showTicks = input(true);

  public readonly showValue = input(true);

  public readonly step = input(20);

  public readonly ticks: readonly SliderTick[] = [
    { value: 0, label: "XS" },
    { value: 25, label: "S" },
    { value: 50, label: "M" },
    { value: 75, label: "L" },
    { value: 100, label: "XL" },
  ];
}
