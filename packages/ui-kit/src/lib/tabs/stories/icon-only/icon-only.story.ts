import { UITabGroup } from "../../tab-group.component";
import { UITab } from "../../tab.component";
import { UITabSeparator } from "../../tab-separator.component";
import { UITabSpacer } from "../../tab-spacer.component";
import { UIIcons } from "../../../icon/lucide-icons.generated";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-icon-only-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: "./icon-only.story.html",
  styleUrl: "./icon-only.story.scss",
})
export class IconOnlyStorySource {
  protected readonly icons = {
    house: UIIcons.Lucide.Home.House,
    activity: UIIcons.Lucide.Account.Activity,
    settings: UIIcons.Lucide.Account.Settings,
  } as const;
}
