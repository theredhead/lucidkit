import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-label-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./label.story.html",
  styleUrl: "./label.story.scss",
})
export class LabelStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/badge/badge.stories.ts.
}
