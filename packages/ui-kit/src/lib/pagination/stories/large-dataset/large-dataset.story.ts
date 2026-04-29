import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-large-dataset-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./large-dataset.story.html",
  styleUrl: "./large-dataset.story.scss",
})
export class LargeDatasetStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/pagination/pagination.stories.ts.
}
