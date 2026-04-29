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
