import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import {
  type DrawerPosition,
  type DrawerWidth,
  UIIcons,
  UIIcon,
} from "@theredhead/lucid-kit";
import { UINavigationPage } from "../../navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "../../navigation-page.utils";

// ── Demo data ────────────────────────────────────────────────────────

const NAV_ITEMS: NavigationNode[] = [
  navItem("dashboard", "Dashboard", {
    icon: UIIcons.Lucide.Layout.LayoutDashboard,
  }),
  navItem("projects", "Projects", {
    icon: UIIcons.Lucide.Files.Folder,
    badge: "12",
  }),
  navItem("calendar", "Calendar", {
    icon: UIIcons.Lucide.Time.Calendar,
  }),
  navItem("analytics", "Analytics", {
    icon: UIIcons.Lucide.Charts.ChartLine,
  }),
  navGroup(
    "settings",
    "Settings",
    [
      navItem("general", "General", {
        icon: UIIcons.Lucide.Account.Settings,
      }),
      navItem("security", "Security", {
        icon: UIIcons.Lucide.Account.Shield,
      }),
      navItem("team", "Team Members", {
        icon: UIIcons.Lucide.Account.Users,
        badge: "3",
      }),
    ],
    { icon: UIIcons.Lucide.Account.Settings },
  ),
];

const PAGE_CONTENT: Record<string, string> = {
  dashboard:
    "Your personal dashboard with an overview of recent activity, " +
    "key metrics, and quick-access shortcuts to the most used features.",
  projects:
    "Browse and manage all your projects. Create new ones, archive " +
    "completed work, and track progress across your team.",
  calendar:
    "View upcoming meetings, deadlines, and events. Drag-and-drop " +
    "to reschedule and sync with external calendars.",
  analytics:
    "Dive into detailed analytics and reports. Visualise trends, " +
    "compare periods, and export data for presentations.",
  general:
    "General application settings — language, timezone, default views, " +
    "and notification preferences.",
  security:
    "Manage your security settings. Enable two-factor authentication, " +
    "review active sessions, and update your password.",
  team:
    "Invite team members, assign roles, and manage permissions. " +
    "View who has access to each project.",
};

// ── Demo components ──────────────────────────────────────────────────

@Component({
  selector: "ui-demo-nav-page-default",
  standalone: true,
  imports: [UINavigationPage, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./default.story.scss",
  templateUrl: "./default.story.html",
})
export class DemoNavPageDefaultComponent {
  /** Side from which the drawer enters the viewport. */
  public readonly drawerPosition = input<DrawerPosition>("left");

  /** Width preset applied to the drawer. */
  public readonly drawerWidth = input<DrawerWidth>("medium");

  /** Accessible label forwarded to the navigation layout. */
  public readonly ariaLabel = input<string>("Page navigation");

  public readonly items = NAV_ITEMS;
  public readonly activePage = signal("dashboard");

  public onNavigated(_node: NavigationNode): void {
    // no-op for demo
  }

  public contentFor(id: string): string {
    return PAGE_CONTENT[id] ?? "";
  }
}
