import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-dot-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./dot.story.html",
  styleUrl: "./dot.story.scss",
})
export class DotStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/badge/badge.stories.ts.
}
