import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIIcons } from "../../../icon/lucide-icons.generated";
import {
  UISidebarGroup,
  UISidebarItem,
  UISidebarNav,
} from "../../sidebar-nav.component";

@Component({
  selector: "ui-collapsed-groups-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  templateUrl: "./collapsed-groups.story.html",
  styleUrl: "./collapsed-groups.story.scss",
})
export class CollapsedGroupsStorySource {
  public readonly collapsed = input(false);
  public readonly ariaLabel = input("Sidebar navigation");
  public readonly houseIcon = UIIcons.Lucide.Layout.LayoutDashboard;
}
