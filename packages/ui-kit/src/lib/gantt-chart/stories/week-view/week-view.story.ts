import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIGanttChart } from "../../gantt-chart.component";
import { GanttArrayDatasource } from "../../gantt-array-datasource";
import type { GanttTask } from "../../gantt-chart.types";

// ── Shared fixtures ──────────────────────────────────────────────────

function makeDate(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

const PROJECT_TASKS: GanttTask[] = [
  {
    id: "planning",
    title: "Planning & Discovery",
    start: makeDate(-14),
    end: makeDate(-8),
    progress: 100,
    style: { color: "#4285f4" },
  },
  {
    id: "design",
    title: "UI/UX Design",
    start: makeDate(-7),
    end: makeDate(-1),
    progress: 100,
    dependencies: ["planning"],
    style: { color: "#7b1fa2" },
  },
  {
    id: "frontend",
    title: "Frontend Development",
    start: makeDate(0),
    end: makeDate(14),
    progress: 35,
    dependencies: ["design"],
    style: { color: "#34a853" },
  },
  {
    id: "api",
    title: "API Development",
    start: makeDate(0),
    end: makeDate(12),
    progress: 50,
    dependencies: ["design"],
    style: { color: "#ea4335" },
  },
  {
    id: "auth",
    title: "Auth Module",
    start: makeDate(1),
    end: makeDate(6),
    progress: 80,
    parentId: "api",
    style: { color: "#ff6d01" },
  },
  {
    id: "data",
    title: "Data Layer",
    start: makeDate(5),
    end: makeDate(12),
    progress: 20,
    parentId: "api",
    dependencies: ["auth"],
    style: { color: "#46bdc6" },
  },
  {
    id: "integration",
    title: "Integration Testing",
    start: makeDate(13),
    end: makeDate(18),
    progress: 0,
    dependencies: ["frontend", "api"],
    style: { color: "#fbbc04" },
  },
  {
    id: "beta",
    title: "Beta Release",
    start: makeDate(19),
    end: makeDate(19),
    milestone: true,
    dependencies: ["integration"],
  },
  {
    id: "qa",
    title: "QA & Bug Fixes",
    start: makeDate(20),
    end: makeDate(28),
    progress: 0,
    dependencies: ["beta"],
    style: { color: "#c2185b" },
  },
  {
    id: "launch",
    title: "Launch",
    start: makeDate(29),
    end: makeDate(29),
    milestone: true,
    dependencies: ["qa"],
  },
];

// ── Demo: Week view ──────────────────────────────────────────────────

@Component({
  selector: "ui-gantt-week-demo",
  standalone: true,
  imports: [UIGanttChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./week-view.story.scss",
  templateUrl: "./week-view.story.html",
})
export class GanttWeekDemo {
  public readonly datasource = new GanttArrayDatasource(PROJECT_TASKS);
}
