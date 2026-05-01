import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIGanttChart } from "../../gantt-chart.component";
import { GanttArrayDatasource } from "../../gantt-array-datasource";
import type { GanttViewMode } from "../../gantt-chart.types";

// ── Demo: Month view (long project) ──────────────────────────────────

@Component({
  selector: "ui-gantt-month-demo",
  standalone: true,
  imports: [UIGanttChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./month-view.story.scss",
  templateUrl: "./month-view.story.html",
})
export class GanttMonthDemo {
  /** Timeline granularity for the demo chart. */
  public readonly viewMode = input<GanttViewMode>("month");

  /** Height of each task row in pixels. */
  public readonly rowHeight = input<number>(36);

  /** Whether to show the current-date marker. */
  public readonly showToday = input<boolean>(true);

  /** Whether to render the task-list sidebar. */
  public readonly showTaskList = input<boolean>(true);

  /** Width of the task-list sidebar in pixels. */
  public readonly taskListWidth = input<number>(200);

  /** Extra days of padding added before and after the task range. */
  public readonly paddingDays = input<number>(7);

  /** Accessible label forwarded to the chart region. */
  public readonly ariaLabel = input<string>("Gantt chart");

  public readonly datasource = new GanttArrayDatasource([
    {
      id: "q1",
      title: "Q1 — Research",
      start: new Date("2026-01-05"),
      end: new Date("2026-03-15"),
      progress: 100,
      style: { color: "#4285f4" },
    },
    {
      id: "q2",
      title: "Q2 — Development",
      start: new Date("2026-03-16"),
      end: new Date("2026-06-15"),
      progress: 40,
      dependencies: ["q1"],
      style: { color: "#34a853" },
    },
    {
      id: "q3",
      title: "Q3 — Testing & Launch",
      start: new Date("2026-06-16"),
      end: new Date("2026-08-31"),
      progress: 0,
      dependencies: ["q2"],
      style: { color: "#ea4335" },
    },
    {
      id: "mvp",
      title: "MVP",
      start: new Date("2026-06-15"),
      end: new Date("2026-06-15"),
      milestone: true,
      dependencies: ["q2"],
    },
    {
      id: "ga",
      title: "GA Release",
      start: new Date("2026-08-31"),
      end: new Date("2026-08-31"),
      milestone: true,
      dependencies: ["q3"],
    },
  ]);
}
