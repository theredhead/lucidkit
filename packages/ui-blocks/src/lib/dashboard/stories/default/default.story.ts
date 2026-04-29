import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";
import { UIDashboard } from "../../dashboard.component";
import { UIDashboardPanel } from "../../dashboard-panel.component";
import type { DashboardPanelConfig } from "../../dashboard.types";
import {
  UIIcon,
  UIIcons,
  UIChart,
  BarGraphStrategy,
  UIButton,
} from "@theredhead/lucid-kit";

// ── Shared fixtures ──────────────────────────────────────────────

const SAMPLE_PANELS: DashboardPanelConfig[] = [
  {
    id: "kpi",
    title: "KPI Overview",
    icon: UIIcons.Lucide.Science.Gauge,
    placement: { colSpan: 5 },
    collapsible: true,
  },
  {
    id: "revenue",
    title: "Revenue",
    icon: UIIcons.Lucide.Charts.ChartColumn,
    placement: { colSpan: 3 },
    collapsible: true,
  },
  {
    id: "users",
    title: "Active Users",
    icon: UIIcons.Lucide.Account.Users,
    placement: { colSpan: 3 },
  },
  {
    id: "feed",
    title: "Activity Feed",
    icon: UIIcons.Lucide.Account.Activity,
    placement: { colSpan: 5 },
    collapsible: true,
    removable: true,
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: UIIcons.Lucide.Text.ListTodo,
    placement: { colSpan: 8 },
    collapsible: true,
    removable: true,
  },
];

// ── Demo: Default (3-column fixed) ───────────────────────────────

@Component({
  selector: "ui-dashboard-default-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel, UIIcon, UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./default.story.scss",
  templateUrl: "./default.story.html",
})
export class DashboardDefaultDemo {
  protected readonly icons = UIIcons.Lucide;
  protected readonly menuIcon = UIIcons.Lucide.Layout.Menu;
  public readonly panels = SAMPLE_PANELS;
  protected readonly barStrategy = new BarGraphStrategy();
  protected readonly revenueData = [
    { month: "Jul", revenue: 24500 },
    { month: "Aug", revenue: 21800 },
    { month: "Sep", revenue: 26300 },
    { month: "Oct", revenue: 28900 },
    { month: "Nov", revenue: 31200 },
    { month: "Dec", revenue: 42500 },
  ];
}
