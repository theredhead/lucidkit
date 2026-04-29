import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-count-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./count.story.html",
  styleUrl: "./count.story.scss",
})
export class CountStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/badge/badge.stories.ts.
}
