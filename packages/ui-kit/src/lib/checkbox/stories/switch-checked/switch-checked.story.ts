import { UICheckbox } from "../../checkbox.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-switch-checked-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICheckbox],
  templateUrl: "./switch-checked.story.html",
  styleUrl: "./switch-checked.story.scss",
})
export class SwitchCheckedStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/checkbox/checkbox.stories.ts.
}
