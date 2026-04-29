import { UIColorPicker } from "../../color-picker.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-rgba-mode-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIColorPicker],
  templateUrl: "./rgba-mode.story.html",
  styleUrl: "./rgba-mode.story.scss",
})
export class RgbaModeStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/color-picker/color-picker.stories.ts.
}
