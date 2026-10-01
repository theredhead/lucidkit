import { UIColorPicker } from "../../color-picker.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-hsla-mode-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIColorPicker],
  templateUrl: "./hsla-mode.story.html",
  styleUrl: "./hsla-mode.story.scss",
})
export class HslaModeStorySource {
  public readonly value = model("#43a047");
  public readonly initialMode = input("hsla");
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Pick a colour (HSLA)");
}
