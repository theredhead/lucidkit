import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIDashboard } from "../../dashboard.component";
import { UIDashboardPanel } from "../../dashboard-panel.component";

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
  public readonly items = [1, 2, 3, 4, 5, 6];
}
