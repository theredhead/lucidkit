import { UIPagination } from "../../pagination.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-large-dataset-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIPagination],
  templateUrl: "./large-dataset.story.html",
  styleUrl: "./large-dataset.story.scss",
})
export class LargeDatasetStorySource {
  public readonly ariaLabel = input("Pagination");

  public readonly disabled = input(false);

  public readonly pageSize = input(25);

  public readonly totalItems = input(1000);
}
