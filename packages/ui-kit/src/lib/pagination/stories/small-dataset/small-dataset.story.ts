import { UIPagination } from "../../pagination.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-small-dataset-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIPagination],
  templateUrl: "./small-dataset.story.html",
  styleUrl: "./small-dataset.story.scss",
})
export class SmallDatasetStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/pagination/pagination.stories.ts.
}
