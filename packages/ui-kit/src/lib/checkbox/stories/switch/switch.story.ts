import { UICheckbox } from "../../checkbox.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-switch-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICheckbox],
  templateUrl: "./switch.story.html",
  styleUrl: "./switch.story.scss",
})
export class SwitchStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/checkbox/checkbox.stories.ts.
}
