import { ChangeDetectionStrategy, Component, viewChild } from "@angular/core";
import { UIDashboard } from "../../dashboard.component";
import { UIDashboardPanel } from "../../dashboard-panel.component";
import { UIIcons, UIButton } from "@theredhead/lucid-kit";

// ── Demo: Notifications ──────────────────────────────────────────

@Component({
  selector: "ui-dashboard-notification-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./notifications.story.scss",
  templateUrl: "./notifications.story.html",
})
export class DashboardNotificationDemo {
  protected readonly icons = UIIcons.Lucide;

  private readonly feedPanel =
    viewChild.required<UIDashboardPanel>("feedPanel");
  private readonly tasksPanel =
    viewChild.required<UIDashboardPanel>("tasksPanel");

  protected notifyFeed(): void {
    this.feedPanel().notify();
  }

  protected notifyTasks(): void {
    this.tasksPanel().notify(5000);
  }

  protected clearAll(): void {
    this.feedPanel().clearNotification();
    this.tasksPanel().clearNotification();
  }
}
