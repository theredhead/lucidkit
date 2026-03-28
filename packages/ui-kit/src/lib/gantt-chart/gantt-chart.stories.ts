import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { DatePipe, TitleCasePipe } from "@angular/common";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UIGanttChart } from "./gantt-chart.component";
import { GanttArrayDatasource } from "./gantt-array-datasource";
import type { GanttTask, GanttViewMode } from "./gantt-chart.types";
import { PopoverService } from "../popover/popover.service";
import { PopoverRef, type UIPopoverContent } from "../popover/popover.types";
import { UIIcon } from "../icon/icon.component";
import { UIButton } from "../button/button.component";
import { UIIcons } from "../icon/lucide-icons.generated";

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

// ── Demo: Default (day view) ─────────────────────────────────────────

@Component({
  selector: "ui-gantt-default-demo",
  standalone: true,
  imports: [UIGanttChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .demo-info {
        margin-bottom: 1rem;
        font-size: 0.8rem;
        opacity: 0.6;
      }
    `,
  ],
  template: `
    <p class="demo-info">
      A software project timeline with tasks, sub-tasks, milestones, and
      dependency chains.
    </p>
    <ui-gantt-chart
      [datasource]="datasource"
      viewMode="day"
      [showToday]="true"
      [rowHeight]="36"
      (taskClicked)="onTask($event)"
    />
    @if (clickedTask()) {
      <p class="demo-info" style="margin-top: 0.75rem">
        Clicked: <strong>{{ clickedTask() }}</strong>
      </p>
    }
  `,
})
class GanttDefaultDemo {
  public readonly datasource = new GanttArrayDatasource(PROJECT_TASKS);
  public readonly clickedTask = signal<string | null>(null);

  public onTask(task: GanttTask): void {
    this.clickedTask.set(task.title);
  }
}

// ── Demo: Week view ──────────────────────────────────────────────────

@Component({
  selector: "ui-gantt-week-demo",
  standalone: true,
  imports: [UIGanttChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .demo-info {
        margin-bottom: 1rem;
        font-size: 0.8rem;
        opacity: 0.6;
      }
    `,
  ],
  template: `
    <p class="demo-info">
      Same project data rendered with week-level granularity.
    </p>
    <ui-gantt-chart
      [datasource]="datasource"
      viewMode="week"
      [showToday]="true"
    />
  `,
})
class GanttWeekDemo {
  public readonly datasource = new GanttArrayDatasource(PROJECT_TASKS);
}

// ── Demo: Month view (long project) ──────────────────────────────────

@Component({
  selector: "ui-gantt-month-demo",
  standalone: true,
  imports: [UIGanttChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .demo-info {
        margin-bottom: 1rem;
        font-size: 0.8rem;
        opacity: 0.6;
      }
    `,
  ],
  template: `
    <p class="demo-info">
      A 6-month project timeline viewed at month granularity.
    </p>
    <ui-gantt-chart
      [datasource]="datasource"
      viewMode="month"
      [showToday]="true"
      [paddingDays]="7"
    />
  `,
})
class GanttMonthDemo {
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

// ── Demo: View mode switcher ─────────────────────────────────────────

@Component({
  selector: "ui-gantt-switcher-demo",
  standalone: true,
  imports: [UIGanttChart, UIButton, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
    `,
  ],
  template: `
    <div class="controls">
      @for (mode of modes; track mode) {
        <ui-button
          [variant]="viewMode() === mode ? 'filled' : 'outlined'"
          (click)="viewMode.set(mode)"
        >
          {{ mode | titlecase }}
        </ui-button>
      }
    </div>
    <ui-gantt-chart
      [datasource]="datasource"
      [viewMode]="viewMode()"
      [showToday]="true"
    />
  `,
})
class GanttSwitcherDemo {
  public readonly modes: GanttViewMode[] = ["day", "week", "month"];
  public readonly viewMode = signal<GanttViewMode>("day");
  public readonly datasource = new GanttArrayDatasource(PROJECT_TASKS);
}

// ── Popover: Task detail content ─────────────────────────────────────

/** Metadata attached to each task for the popover demo. */
interface TaskDocsMeta {
  readonly owner: string;
  readonly docsUrl: string;
  readonly jiraUrl: string;
}

/**
 * Popover content component that displays task metadata and
 * links to documentation / issue tracker.
 */
@Component({
  selector: "ui-story-task-detail-popover",
  standalone: true,
  imports: [DatePipe, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 0.75rem 1rem;
        min-width: 16rem;
        font-size: 0.8125rem;
      }
      .task-title {
        margin: 0 0 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
      }
      dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.2rem 0.75rem;
        margin: 0 0 0.5rem;
      }
      dt {
        font-weight: 600;
        opacity: 0.7;
      }
      dd {
        margin: 0;
      }
      .progress-bar {
        height: 6px;
        border-radius: 3px;
        background: var(--theredhead-outline-variant, #d7dce2);
        margin-bottom: 0.75rem;
        overflow: hidden;
      }
      .progress-bar__fill {
        height: 100%;
        border-radius: 3px;
        background: var(--theredhead-primary, #3b82f6);
        transition: width 0.2s;
      }
      nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      a {
        color: var(--theredhead-primary, #2563eb);
        text-decoration: none;
        font-size: 0.8125rem;
      }
      a:hover {
        text-decoration: underline;
      }
    `,
  ],
  template: `
    <p class="task-title">{{ title() }}</p>
    <dl>
      <dt>Start</dt>
      <dd>{{ start() | date: "mediumDate" }}</dd>
      <dt>End</dt>
      <dd>{{ end() | date: "mediumDate" }}</dd>
      <dt>Owner</dt>
      <dd>{{ owner() }}</dd>
    </dl>
    @if (progress() !== null) {
      <div class="progress-bar">
        <div class="progress-bar__fill" [style.width.%]="progress()"></div>
      </div>
    }
    <nav>
      <a [href]="docsUrl()" target="_blank" rel="noopener"
        ><ui-icon [svg]="icons.Files.FileText" [size]="14" /> Documentation</a
      >
      <a [href]="jiraUrl()" target="_blank" rel="noopener"
        ><ui-icon [svg]="icons.Account.Ticket" [size]="14" /> Jira ticket</a
      >
    </nav>
  `,
})
class StoryTaskDetailPopover implements UIPopoverContent {
  public readonly popoverRef = inject(PopoverRef);
  protected readonly icons = UIIcons.Lucide;
  public readonly title = input("");
  public readonly start = input<Date | null>(null);
  public readonly end = input<Date | null>(null);
  public readonly progress = input<number | null>(null);
  public readonly owner = input("");
  public readonly docsUrl = input("#");
  public readonly jiraUrl = input("#");
}

// ── Demo: Task popover ───────────────────────────────────────────────

/** Owner and link lookup keyed by task ID. */
const TASK_META: Record<string, TaskDocsMeta> = {
  planning: {
    owner: "Alice Chen",
    docsUrl: "https://wiki.example.com/planning",
    jiraUrl: "https://jira.example.com/browse/PROJ-100",
  },
  design: {
    owner: "Bob Rivera",
    docsUrl: "https://wiki.example.com/design",
    jiraUrl: "https://jira.example.com/browse/PROJ-101",
  },
  frontend: {
    owner: "Carol Park",
    docsUrl: "https://wiki.example.com/frontend",
    jiraUrl: "https://jira.example.com/browse/PROJ-102",
  },
  api: {
    owner: "David Kim",
    docsUrl: "https://wiki.example.com/api",
    jiraUrl: "https://jira.example.com/browse/PROJ-103",
  },
  auth: {
    owner: "David Kim",
    docsUrl: "https://wiki.example.com/auth",
    jiraUrl: "https://jira.example.com/browse/PROJ-104",
  },
  data: {
    owner: "Erin Liu",
    docsUrl: "https://wiki.example.com/data-layer",
    jiraUrl: "https://jira.example.com/browse/PROJ-105",
  },
  integration: {
    owner: "Frank Torres",
    docsUrl: "https://wiki.example.com/integration",
    jiraUrl: "https://jira.example.com/browse/PROJ-106",
  },
  beta: {
    owner: "Grace Nguyen",
    docsUrl: "https://wiki.example.com/beta",
    jiraUrl: "https://jira.example.com/browse/PROJ-107",
  },
  qa: {
    owner: "Hiro Tanaka",
    docsUrl: "https://wiki.example.com/qa",
    jiraUrl: "https://jira.example.com/browse/PROJ-108",
  },
  launch: {
    owner: "Grace Nguyen",
    docsUrl: "https://wiki.example.com/launch",
    jiraUrl: "https://jira.example.com/browse/PROJ-109",
  },
};

@Component({
  selector: "ui-gantt-popover-demo",
  standalone: true,
  imports: [UIGanttChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .demo-info {
        margin-bottom: 1rem;
        font-size: 0.8rem;
        opacity: 0.6;
      }
    `,
  ],
  template: `
    <p class="demo-info">
      Click any task bar or milestone to open a popover with metadata and links
      to documentation.
    </p>
    <ui-gantt-chart
      [datasource]="datasource"
      viewMode="day"
      [showToday]="true"
      (taskClicked)="openPopover($event)"
    />
  `,
})
class GanttPopoverDemo {
  private readonly popover = inject(PopoverService);
  private readonly el = inject(ElementRef<HTMLElement>);
  public readonly datasource = new GanttArrayDatasource(PROJECT_TASKS);

  public openPopover(task: GanttTask): void {
    const anchor = this.el.nativeElement.querySelector(
      `[data-task-id="${task.id}"]`,
    );
    if (!anchor) return;

    const meta = TASK_META[task.id];

    this.popover.openPopover({
      component: StoryTaskDetailPopover,
      anchor,
      verticalAxisAlignment: "auto",
      horizontalAxisAlignment: "auto",
      verticalOffset: 4,
      ariaLabel: `Details for ${task.title}`,
      inputs: {
        title: task.title,
        start: task.start,
        end: task.end,
        progress: task.progress ?? null,
        owner: meta?.owner ?? "—",
        docsUrl: meta?.docsUrl ?? "#",
        jiraUrl: meta?.jiraUrl ?? "#",
      },
    });
  }
}

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta<UIGanttChart> = {
  title: "@Theredhead/UI Kit/Gantt Chart",
  component: UIGanttChart,
  tags: ["autodocs"],
  argTypes: {
    viewMode: {
      control: "select",
      options: ["day", "week", "month"],
      description: "Time granularity for the timeline columns.",
    },
    rowHeight: {
      control: "number",
      description: "Height of each task row in pixels.",
    },
    showToday: {
      control: "boolean",
      description: "Show a vertical marker for the current date.",
    },
    showTaskList: {
      control: "boolean",
      description: "Show the task-name sidebar.",
    },
    taskListWidth: {
      control: "number",
      description: "Width of the task-name sidebar in pixels.",
    },
    paddingDays: {
      control: "number",
      description: "Extra days before the first task and after the last.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the chart.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          "`UIGanttChart` is a pure-CSS Gantt chart component driven by an",
          "`IGanttDatasource`. It renders a scrollable timeline with task bars,",
          'progress overlays, milestones, a "today" marker, and hierarchical',
          "task indentation.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        GanttDefaultDemo,
        GanttWeekDemo,
        GanttMonthDemo,
        GanttSwitcherDemo,
        GanttPopoverDemo,
        StoryTaskDetailPopover,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIGanttChart>;

// ── Stories ──────────────────────────────────────────────────────────

/**
 * **Default (Day View)** — A software project timeline with tasks,
 * sub-tasks, milestones, and dependency chains. The "today" marker
 * shows the current date.
 */
export const Default: Story = {
  render: () => ({ template: `<ui-gantt-default-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-gantt-chart
  [datasource]="datasource"
  viewMode="day"
  [showToday]="true"
  [rowHeight]="36"
  (taskClicked)="onTask($event)"
/>

@if (clickedTask()) {
  <p>Clicked: <strong>{{ clickedTask() }}</strong></p>
}

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import {
  UIGanttChart, GanttArrayDatasource, GanttTask,
} from '@theredhead/ui-kit';

export class MyComponent {
  readonly datasource = new GanttArrayDatasource([
    {
      id: 'design',
      title: 'Design Phase',
      start: new Date('2026-03-01'),
      end: new Date('2026-03-10'),
      progress: 100,
      style: { color: '#4285f4' },
    },
    {
      id: 'build',
      title: 'Build Phase',
      start: new Date('2026-03-11'),
      end: new Date('2026-03-25'),
      progress: 35,
      dependencies: ['design'],
      style: { color: '#34a853' },
    },
    {
      id: 'launch',
      title: 'Launch',
      start: new Date('2026-03-26'),
      end: new Date('2026-03-26'),
      milestone: true,
      dependencies: ['build'],
    },
  ]);

  readonly clickedTask = signal<string | null>(null);

  onTask(task: GanttTask): void {
    this.clickedTask.set(task.title);
  }
}
`,
        language: "html",
      },
    },
  },
};

/**
 * **Week View** — Same project data rendered with week-level
 * granularity for a higher-level overview.
 */
export const WeekView: Story = {
  render: () => ({ template: `<ui-gantt-week-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-gantt-chart
  [datasource]="datasource"
  viewMode="week"
  [showToday]="true"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIGanttChart, GanttArrayDatasource } from '@theredhead/ui-kit';

export class MyComponent {
  readonly datasource = new GanttArrayDatasource(myTasks);
}
`,
        language: "html",
      },
    },
  },
};

/**
 * **Month View** — A 6-month project timeline viewed at month
 * granularity, with quarterly phases and milestone markers.
 */
export const MonthView: Story = {
  render: () => ({ template: `<ui-gantt-month-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-gantt-chart
  [datasource]="datasource"
  viewMode="month"
  [showToday]="true"
  [paddingDays]="7"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIGanttChart, GanttArrayDatasource } from '@theredhead/ui-kit';

export class MyComponent {
  readonly datasource = new GanttArrayDatasource([
    {
      id: 'q1',
      title: 'Q1 — Research',
      start: new Date('2026-01-05'),
      end: new Date('2026-03-15'),
      progress: 100,
      style: { color: '#4285f4' },
    },
    {
      id: 'q2',
      title: 'Q2 — Development',
      start: new Date('2026-03-16'),
      end: new Date('2026-06-15'),
      progress: 40,
      dependencies: ['q1'],
      style: { color: '#34a853' },
    },
    {
      id: 'mvp',
      title: 'MVP',
      start: new Date('2026-06-15'),
      end: new Date('2026-06-15'),
      milestone: true,
      dependencies: ['q2'],
    },
  ]);
}
`,
        language: "html",
      },
    },
  },
};

/**
 * **View Mode Switcher** — Interactive demo with buttons to toggle
 * between day, week, and month view modes.
 */
export const ViewModeSwitcher: Story = {
  render: () => ({ template: `<ui-gantt-switcher-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<div class="controls">
  @for (mode of modes; track mode) {
    <button
      [class.active]="viewMode() === mode"
      (click)="viewMode.set(mode)"
    >
      {{ mode | titlecase }}
    </button>
  }
</div>

<ui-gantt-chart
  [datasource]="datasource"
  [viewMode]="viewMode()"
  [showToday]="true"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  UIGanttChart, GanttArrayDatasource, GanttViewMode,
} from '@theredhead/ui-kit';

export class MyComponent {
  readonly modes: GanttViewMode[] = ['day', 'week', 'month'];
  readonly viewMode = signal<GanttViewMode>('day');
  readonly datasource = new GanttArrayDatasource(myTasks);
}

// ── SCSS ──────────────────────────────────────────────────────
.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.controls button {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--ui-border, #d1d5db);
  border-radius: 4px;
  background: var(--ui-surface, #f3f4f6);
  color: inherit;
  cursor: pointer;
  font-size: 0.8rem;
}
.controls button.active {
  background: var(--theredhead-primary, #3b82f6);
  color: #fff;
  border-color: var(--theredhead-primary, #3b82f6);
}
`,
        language: "html",
      },
    },
  },
};

/**
 * **Task Popover** — Click any task bar or milestone to open a
 * popover showing metadata (dates, owner, progress) and links
 * to documentation and issue tracker.
 */
export const TaskPopover: Story = {
  render: () => ({ template: `<ui-gantt-popover-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-gantt-chart
  [datasource]="datasource"
  viewMode="day"
  [showToday]="true"
  (taskClicked)="openPopover($event)"
/>

// ── TypeScript ────────────────────────────────────────────────
import { ElementRef, inject } from '@angular/core';
import {
  UIGanttChart, GanttArrayDatasource, GanttTask,
  PopoverService,
} from '@theredhead/ui-kit';

export class MyComponent {
  private readonly popover = inject(PopoverService);
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly datasource = new GanttArrayDatasource(myTasks);

  openPopover(task: GanttTask): void {
    // Anchor to the clicked bar via data-task-id attribute
    const anchor = this.el.nativeElement.querySelector(
      \`[data-task-id="\${task.id}"]\`,
    );
    if (!anchor) return;

    this.popover.openPopover({
      component: TaskDetailPopover,
      anchor,
      verticalAxisAlignment: 'auto',
      horizontalAxisAlignment: 'auto',
      verticalOffset: 4,
      ariaLabel: \`Details for \${task.title}\`,
      inputs: {
        title: task.title,
        start: task.start,
        end: task.end,
        progress: task.progress ?? null,
      },
    });
  }
}

// ── Popover content component ─────────────────────────────────
@Component({ ... })
export class TaskDetailPopover implements UIPopoverContent {
  readonly popoverRef = inject(PopoverRef);
  readonly title = input('');
  readonly start = input<Date | null>(null);
  readonly end = input<Date | null>(null);
  readonly progress = input<number | null>(null);
}

// ── SCSS (popover content) ────────────────────────────────────
:host {
  display: block;
  padding: 0.75rem 1rem;
  min-width: 16rem;
  font-size: 0.8125rem;
}
.task-title {
  margin: 0 0 0.5rem;
  font-weight: 600;
}
dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.2rem 0.75rem;
  margin: 0 0 0.5rem;
}
`,
        language: "html",
      },
    },
  },
};

/**
 * _API Reference_ — features, inputs, outputs, and view modes.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Datasource-driven** — `GanttArrayDatasource` for in-memory data",
          "- **View modes** — day, week, and month granularity",
          "- **Progress bars** — optional percentage overlay per task",
          "- **Milestones** — diamond markers for zero-duration events",
          "- **Hierarchical** — parent/child task indentation in the sidebar",
          "- **Dependencies** — `dependencies` array on each task",
          "- **Today marker** — vertical line showing the current date",
          "- **Dark-mode ready** — three-tier CSS custom property theming",
          "- **Accessible** — `role=region`, `aria-label`, keyboard focusable bars",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `IGanttDatasource` | *required* | Task data source |",
          "| `viewMode` | `'day' \\| 'week' \\| 'month'` | `'day'` | Timeline granularity |",
          "| `rowHeight` | `number` | `36` | Row height in pixels |",
          "| `showToday` | `boolean` | `true` | Show today marker line |",
          "| `showTaskList` | `boolean` | `true` | Show sidebar with task names |",
          "| `taskListWidth` | `number` | `200` | Sidebar width in pixels |",
          "| `paddingDays` | `number` | `2` | Extra days before/after range |",
          '| `ariaLabel` | `string` | `"Gantt chart"` | Accessible label |',
          "",
          "## Outputs",
          "",
          "| Output | Type | Description |",
          "|--------|------|-------------|",
          "| `taskClicked` | `GanttTask<T>` | Emitted when a bar or milestone is clicked |",
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};
