import { UITabGroup } from "../../tab-group.component";
import { UITab } from "../../tab.component";
import { UITabSeparator } from "../../tab-separator.component";
import { UITabSpacer } from "../../tab-spacer.component";
import { UIIcons } from "../../../icon/lucide-icons.generated";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-kitchen-sink-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: "./kitchen-sink.story.html",
  styleUrl: "./kitchen-sink.story.scss",
})
export class KitchenSinkStorySource {
  protected readonly icons = {
    inbox: UIIcons.Lucide.Account.Inbox,
    send: UIIcons.Lucide.Mail.Send,
    archive: UIIcons.Lucide.Mail.Archive,
    settings: UIIcons.Lucide.Account.Settings,
    help: UIIcons.Lucide.Accessibility.CircleQuestionMark,
    home: UIIcons.Lucide.Home.House,
    search: UIIcons.Lucide.Social.Search,
    bell: UIIcons.Lucide.Account.Bell,
    user: UIIcons.Lucide.Account.User,
  } as const;
}
