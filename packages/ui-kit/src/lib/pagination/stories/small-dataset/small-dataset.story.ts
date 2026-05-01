import { UIPagination } from "../../pagination.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-small-dataset-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIPagination],
  templateUrl: "./small-dataset.story.html",
  styleUrl: "./small-dataset.story.scss",
})
export class SmallDatasetStorySource {
  public readonly ariaLabel = input("Pagination");

  public readonly disabled = input(false);

  public readonly pageSize = input(10);

  public readonly totalItems = input(30);
}
