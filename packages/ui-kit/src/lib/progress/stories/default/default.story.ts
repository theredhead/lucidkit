import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { type ProgressMode, type ProgressVariant } from "../../progress.types";
import { UIProgress } from "../../progress.component";
import { UISlider } from "../../../slider/slider.component";

@Component({
  selector: "ui-progress-demo",
  standalone: true,
  imports: [UIProgress, UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class ProgressDemo {
  public readonly val = signal(65);
}
