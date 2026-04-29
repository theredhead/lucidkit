import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-variants-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./all-variants.story.html",
  styleUrl: "./all-variants.story.scss",
})
export class AllVariantsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/badge/badge.stories.ts.
}
