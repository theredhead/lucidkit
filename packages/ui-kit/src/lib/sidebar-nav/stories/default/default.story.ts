import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

import { UIIcons } from "../../../icon/lucide-icons.generated";
import {
  UISidebarGroup,
  UISidebarItem,
  UISidebarNav,
} from "../../sidebar-nav.component";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly collapsed = input(false);
  public readonly ariaLabel = input("Sidebar navigation");
  public readonly active = signal("dashboard");
  public readonly dashboardIcon = UIIcons.Lucide.Layout.LayoutDashboard;
  public readonly folderIcon = UIIcons.Lucide.Files.Folder;
  public readonly settingsIcon = UIIcons.Lucide.Account.Settings;
  public readonly usersIcon = UIIcons.Lucide.Account.Users;
  public readonly keyIcon = UIIcons.Lucide.Account.Shield;
}
