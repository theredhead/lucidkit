import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIDashboard } from "../../dashboard.component";
import { UIDashboardPanel } from "../../dashboard-panel.component";
import type {
  DashboardColumns,
  DashboardDockPosition,
} from "../../dashboard.types";

// ── Demo: Auto-fill responsive ───────────────────────────────────

@Component({
  selector: "ui-dashboard-auto-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./auto-fill.story.scss",
  templateUrl: "./auto-fill.story.html",
})
export class DashboardAutoDemo {
  /** Number of dashboard columns to render. */
  public readonly columns = input<DashboardColumns>("auto");

  /** Gap between dashboard panels in pixels. */
  public readonly gap = input<number>(20);

  /** Position of the overflow dock. */
  public readonly dockPosition = input<DashboardDockPosition>("bottom");

  public readonly items = [1, 2, 3, 4, 5, 6];
}
