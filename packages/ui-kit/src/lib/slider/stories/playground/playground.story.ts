import { UISlider } from "../../slider.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { SliderMode } from "../../slider.types";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISlider],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public readonly ariaLabel = input("Slider");

  public readonly disabled = input(false);

  public readonly max = input(100);

  public readonly min = input(0);

  public readonly mode = input<SliderMode>("single");

  public readonly showMinMax = input(false);

  public readonly showTicks = input(false);

  public readonly showValue = input(true);

  public readonly step = input(1);

  public getAriaLabel(): string {
    return this.ariaLabel();
  }

  public getDisabled(): boolean {
    return this.disabled();
  }

  public getMax(): number {
    return this.max();
  }

  public getMin(): number {
    return this.min();
  }

  public getMode(): SliderMode {
    return this.mode();
  }

  public getShowMinMax(): boolean {
    return this.showMinMax();
  }

  public getShowTicks(): boolean {
    return this.showTicks();
  }

  public getShowValue(): boolean {
    return this.showValue();
  }

  public getStep(): number {
    return this.step();
  }
}
