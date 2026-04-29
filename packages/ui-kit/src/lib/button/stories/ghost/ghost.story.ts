import { UIButton } from "../../button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-ghost-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./ghost.story.html",
  styleUrl: "./ghost.story.scss",
})
export class GhostStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/button/button.stories.ts.
}
