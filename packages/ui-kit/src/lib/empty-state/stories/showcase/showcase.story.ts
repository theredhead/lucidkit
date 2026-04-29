import { Component, ChangeDetectionStrategy } from "@angular/core";

import { UIEmptyState } from "../../empty-state.component";
import { UIIcons } from "../../../icon";
import { UIButton } from "../../../button/button.component";

@Component({
  selector: "ui-empty-state-demo",
  standalone: true,
  imports: [UIEmptyState, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./showcase.story.html",
})
export class EmptyStateDemo {
  protected readonly icon = UIIcons.Lucide.Mail.Inbox;
}
