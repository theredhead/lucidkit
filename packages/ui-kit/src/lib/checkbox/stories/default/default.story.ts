import { UICheckbox } from "../../checkbox.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICheckbox],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/checkbox/checkbox.stories.ts.
}
