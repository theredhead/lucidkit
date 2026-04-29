import { UIColorPicker } from "../../color-picker.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-interactive-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIColorPicker],
  templateUrl: "./interactive.story.html",
  styleUrl: "./interactive.story.scss",
})
export class InteractiveStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/color-picker/color-picker.stories.ts.
}
