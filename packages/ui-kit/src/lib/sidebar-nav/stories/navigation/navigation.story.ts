import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  selector: "ui-navigation-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  templateUrl: "./navigation.story.html",
  styleUrl: "./navigation.story.scss",
})
export class NavigationStorySource {
  public readonly collapsed = input(false);
  public readonly ariaLabel = input("App navigation");
  public readonly active = signal("dashboard");
  public readonly dashboardIcon = UIIcons.Lucide.Layout.LayoutDashboard;
  public readonly folderIcon = UIIcons.Lucide.Files.Folder;
  public readonly settingsIcon = UIIcons.Lucide.Account.Settings;
  public readonly shieldIcon = UIIcons.Lucide.Account.Shield;

  public readonly activeLabel = computed(() => {
    switch (this.active()) {
      case "projects":
        return "Projects";
      case "general":
        return "General";
      case "security":
        return "Security";
      default:
        return "Dashboard";
    }
  });

  public navigate(page: string): void {
    this.active.set(page);
  }
}
