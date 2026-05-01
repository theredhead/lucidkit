import { UIPagination } from "../../pagination.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-no-page-size-selector-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIPagination],
  templateUrl: "./no-page-size-selector.story.html",
  styleUrl: "./no-page-size-selector.story.scss",
})
export class NoPageSizeSelectorStorySource {
  public readonly ariaLabel = input("Pagination");

  public readonly disabled = input(false);

  public readonly pageSize = input(10);

  public readonly totalItems = input(100);
}
