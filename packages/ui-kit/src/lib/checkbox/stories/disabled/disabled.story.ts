import { UICheckbox } from "../../checkbox.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-disabled-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICheckbox],
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/checkbox/checkbox.stories.ts.
}
