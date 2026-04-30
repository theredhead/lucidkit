import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { UIIcons, UIIcon } from "@theredhead/lucid-kit";
import { UINavigationPage } from "../../navigation-page.component";
import { routesToNavigation, type NavigationNode, type NavigationRouteConfig } from "../../navigation-page.utils";

// ── Router config demo data ──────────────────────────────────────────

const DEMO_ROUTES: NavigationRouteConfig[] = [
  {
    path: "dashboard",
    data: {
      navLabel: "Dashboard",
      navIcon: UIIcons.Lucide.Layout.LayoutDashboard,
    },
  },
  {
    path: "projects",
    data: {
      navLabel: "Projects",
      navIcon: UIIcons.Lucide.Files.Folder,
      navBadge: "5",
    },
  },
  {
    path: "settings",
    data: {
      navLabel: "Settings",
      navIcon: UIIcons.Lucide.Account.Settings,
    },
    children: [
      {
        path: "general",
        data: {
          navLabel: "General",
          navIcon: UIIcons.Lucide.Account.Settings,
        },
      },
      {
        path: "security",
        data: {
          navLabel: "Security",
          navIcon: UIIcons.Lucide.Account.Shield,
        },
      },
    ],
  },
  { path: "login" }, // skipped — no navLabel
  { path: "**" }, // skipped — no navLabel
];

@Component({
  selector: "ui-demo-nav-page-router",
  standalone: true,
  imports: [UINavigationPage, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./router-integration.story.scss",
  templateUrl: "./router-integration.story.html",
})
export class DemoNavPageRouterComponent {
  public readonly items = routesToNavigation(DEMO_ROUTES);
  public readonly activePage = signal("dashboard");

  public onNavigated(node: NavigationNode): void {
    // In a real app: this.router.navigate([node.data.route])
    void node;
  }
}
