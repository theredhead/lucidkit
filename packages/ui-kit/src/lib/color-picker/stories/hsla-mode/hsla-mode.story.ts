import { UIColorPicker } from "../../color-picker.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-hsla-mode-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIColorPicker],
  templateUrl: "./hsla-mode.story.html",
  styleUrl: "./hsla-mode.story.scss",
})
export class HslaModeStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/color-picker/color-picker.stories.ts.
}
