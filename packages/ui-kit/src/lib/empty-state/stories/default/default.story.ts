import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIEmptyState } from "../../empty-state.component";

@Component({
  selector: "ui-empty-state-story-default",
  standalone: true,
  imports: [UIEmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class UIEmptyStateStoryDefault {

  /** Primary heading text forwarded to the empty-state component. */
  public readonly heading = input.required<string>();

  /** Optional explanatory message forwarded to the empty-state component. */
  public readonly message = input<string>("");
}