import { UIColorPicker } from "../../color-picker.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-grid-mode-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIColorPicker],
  templateUrl: "./grid-mode.story.html",
  styleUrl: "./grid-mode.story.scss",
})
export class GridModeStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/color-picker/color-picker.stories.ts.
}
