import { UIPagination } from "../../pagination.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-disabled-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIPagination],
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledStorySource {
  public readonly ariaLabel = input("Pagination");

  public readonly disabled = input(true);

  public readonly pageSize = input(10);

  public readonly totalItems = input(100);
}
