import { UIButton } from "../../button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-outlined-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./outlined.story.html",
  styleUrl: "./outlined.story.scss",
})
export class OutlinedStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/button/button.stories.ts.
}
