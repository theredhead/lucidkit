import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UICard, UICardBody, UICardHeader } from "../../card.component";
import { UIIcons } from "../../../icon";

@Component({
  selector: "ui-card-story-header-subtitle",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header-subtitle.story.html",
  styleUrl: "./header-subtitle.story.scss",
})
export class UICardStoryHeaderSubtitle {
  protected readonly personIcon = UIIcons.Lucide.Account.User;
}