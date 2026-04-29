import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-overflow-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./overflow.story.html",
  styleUrl: "./overflow.story.scss",
})
export class OverflowStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/badge/badge.stories.ts.
}
