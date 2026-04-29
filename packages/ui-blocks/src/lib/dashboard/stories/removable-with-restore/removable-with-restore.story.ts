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

// ── Demo: With restore ───────────────────────────────────────────

@Component({
  selector: "ui-dashboard-restore-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./removable-with-restore.story.scss",
  templateUrl: "./removable-with-restore.story.html",
})
export class DashboardRestoreDemo {
  public readonly dashboard = viewChild.required(UIDashboard);
  public readonly lastRemoved = signal<string | null>(null);

  public readonly configs: DashboardPanelConfig[] = [
    { id: "a", title: "Panel A", removable: true, collapsible: true },
    { id: "b", title: "Panel B", removable: true, collapsible: true },
    { id: "c", title: "Panel C", removable: true, collapsible: true },
    { id: "d", title: "Panel D", removable: true, collapsible: true },
    { id: "e", title: "Panel E", removable: true, collapsible: true },
    { id: "f", title: "Panel F", removable: true, collapsible: true },
  ];

  public onRemoved(id: string): void {
    this.lastRemoved.set(id);
  }
}
