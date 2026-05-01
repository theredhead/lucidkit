import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from "@angular/core";

import { UIProgress } from "../../progress.component";
import type { ProgressMode, ProgressVariant } from "../../progress.types";
import { UISlider } from "../../../slider/slider.component";

@Component({
  selector: "ui-progress-demo",
  standalone: true,
  imports: [UIProgress, UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class ProgressDemo {
  public readonly ariaLabel = input("Progress");

  public readonly mode = input<ProgressMode>("determinate");

  public readonly val = signal(65);

  public readonly value = input(65);

  public readonly variant = input<ProgressVariant>("linear");

  public constructor() {
    effect(() => {
      this.val.set(this.value());
    });
  }
}
