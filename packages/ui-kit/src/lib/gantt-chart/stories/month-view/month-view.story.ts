import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIGanttChart } from "../../gantt-chart.component";
import { GanttArrayDatasource } from "../../gantt-array-datasource";

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
