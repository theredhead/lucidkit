import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIDashboard } from "../../dashboard.component";
import { UIDashboardPanel } from "../../dashboard-panel.component";

// ── Demo: Spanning layout ────────────────────────────────────────

@Component({
  selector: "ui-dashboard-spanning-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./spanning-layout.story.scss",
  templateUrl: "./spanning-layout.story.html",
})
export class DashboardSpanningDemo {}
