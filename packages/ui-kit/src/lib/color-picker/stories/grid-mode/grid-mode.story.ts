import { UIColorPicker } from "../../color-picker.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-grid-mode-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIColorPicker],
  templateUrl: "./grid-mode.story.html",
  styleUrl: "./grid-mode.story.scss",
})
export class GridModeStorySource {
  public readonly value = model("#1565c0");
  public readonly initialMode = input("grid");
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Pick a colour (Grid)");
}
