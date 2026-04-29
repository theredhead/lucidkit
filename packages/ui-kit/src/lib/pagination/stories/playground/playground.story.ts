import { UIPagination } from "../../pagination.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIPagination],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/pagination/pagination.stories.ts.

  public ariaLabel = ("Pagination") as const;
  public disabled = (false) as const;
  public pageSize = (10) as const;
  public totalItems = (250) as const;
}
