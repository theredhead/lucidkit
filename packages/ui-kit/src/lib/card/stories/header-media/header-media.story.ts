import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UICard, UICardBody, UICardHeader } from "../../card.component";
import { UIIcons } from "../../../icon";

@Component({
  selector: "ui-card-story-header-media",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header-media.story.html",
  styleUrl: "./header-media.story.scss",
})
export class UICardStoryHeaderMedia {
  protected readonly badgeIcon = UIIcons.Lucide.Notifications.Bell;
}