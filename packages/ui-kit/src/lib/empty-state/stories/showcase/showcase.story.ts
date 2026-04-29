import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIButton } from "../../../button/button.component";
import { UIIcons } from "../../../icon";
import { UIEmptyState } from "../../empty-state.component";

@Component({
  selector: "ui-empty-state-story-showcase",
  standalone: true,
  imports: [UIEmptyState, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./showcase.story.html",
  styleUrl: "./showcase.story.scss",
})
export class UIEmptyStateStoryShowcase {
  protected readonly icon = UIIcons.Lucide.Mail.Inbox;
}