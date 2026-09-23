import { UIColorPicker } from "../../color-picker.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-rgba-mode-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIColorPicker],
  templateUrl: "./rgba-mode.story.html",
  styleUrl: "./rgba-mode.story.scss",
})
export class RgbaModeStorySource {
  public readonly value = model("#e53935");
  public readonly initialMode = input("rgba");
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Pick a colour (RGBA)");
}
