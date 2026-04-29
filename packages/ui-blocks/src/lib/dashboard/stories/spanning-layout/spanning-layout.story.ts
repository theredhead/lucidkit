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
