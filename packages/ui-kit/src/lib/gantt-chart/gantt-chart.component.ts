import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import type {
  GanttTask,
  GanttViewMode,
  IGanttDatasource,
} from "./gantt-chart.types";
import { DEFAULT_GANTT_PALETTE } from "./gantt-chart.types";
import {
  buildTimeline,
  computeBarPosition,
  computeDateRange,
  computeTodayPosition,
} from "./gantt-chart.utils";
import { UISurface } from "@theredhead/foundation";

/**
 * Processed task row ready for template rendering.
 *
 * @internal
 */
interface GanttRow<T = unknown> {
  readonly task: GanttTask<T>;
  readonly left: number;
  readonly width: number;
  readonly color: string;
  readonly progressWidth: number | null;
  readonly isMilestone: boolean;
  readonly depth: number;
}

/**
 * A pure-CSS Gantt chart component driven by an {@link IGanttDatasource}.
 *
 * Renders a scrollable timeline with task bars, optional progress
 * overlays, milestone diamonds, a "today" marker line, and
 * dependency connector arrows.
 *
 * The component is content-agnostic — all data comes from the datasource.
 *
 * @example
 * ```html
 * <ui-gantt-chart
 *   [datasource]="ds"
 *   [viewMode]="'week'"
 *   [showToday]="true"
 *   (taskClicked)="onTask($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-gantt-chart",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  templateUrl: "./gantt-chart.component.html",
  styleUrl: "./gantt-chart.component.scss",
  host: {
    class: "ui-gantt-chart",
  },
})
export class UIGanttChart<T = unknown> {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Datasource providing tasks and dependency links. */
  public readonly datasource = input.required<IGanttDatasource<T>>();

  /** Timeline granularity. */
  public readonly viewMode = input<GanttViewMode>("day");

  /** Row height in pixels. */
  public readonly rowHeight = input<number>(36);

  /** Whether to show the "today" marker line. */
  public readonly showToday = input<boolean>(true);

  /** Whether to show the task-list sidebar with task names. */
  public readonly showTaskList = input<boolean>(true);

  /** Width of the task-list sidebar in pixels. */
  public readonly taskListWidth = input<number>(200);

  /** Custom colour palette for task bars. */
  public readonly palette = input<readonly string[]>(DEFAULT_GANTT_PALETTE);

  /** Number of padding days before the first and after the last task. */
  public readonly paddingDays = input<number>(2);

  /** Accessible label for the chart region. */
  public readonly ariaLabel = input<string>("Gantt chart");

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emits when a task bar is clicked. */
  public readonly taskClicked = output<GanttTask<T>>();

  // ── Internal state ──────────────────────────────────────────────────

  /** Scroll-left position for syncing the header and body. */
  protected readonly scrollLeft = signal<number>(0);

  // ── Computed ────────────────────────────────────────────────────────

  /** All tasks from the datasource. */
  protected readonly tasks = computed(() => this.datasource().getTasks());

  /** All dependency links from the datasource. */
  protected readonly dependencies = computed(() =>
    this.datasource().getDependencies(),
  );

  /** Computed date range with padding. */
  protected readonly dateRange = computed(() =>
    computeDateRange(this.tasks(), this.paddingDays()),
  );

  /** Full timeline metadata (columns, groups, total days). */
  protected readonly timeline = computed(() => {
    const range = this.dateRange();
    return buildTimeline(range.start, range.end, this.viewMode());
  });

  /** Percentage position of the "today" marker, or null. */
  protected readonly todayPosition = computed(() => {
    if (!this.showToday()) return null;
    const tl = this.timeline();
    return computeTodayPosition(tl.rangeStart, tl.totalDays);
  });

  /** Processed rows for template rendering. */
  protected readonly rows = computed<readonly GanttRow<T>[]>(() => {
    const tl = this.timeline();
    const tasks = this.tasks();
    const pal = this.palette();
    const depthMap = this.buildDepthMap(tasks);

    return tasks.map((task, i) => {
      const pos = computeBarPosition(task, tl.rangeStart, tl.totalDays);
      const color = task.style?.color ?? pal[i % pal.length];
      const progressWidth =
        task.progress != null
          ? Math.min(100, Math.max(0, task.progress))
          : null;

      return {
        task,
        left: pos.left,
        width: pos.width,
        color,
        progressWidth,
        isMilestone: task.milestone === true,
        depth: depthMap.get(task.id) ?? 0,
      };
    });
  });

  /** CSS grid-template-columns for the timeline header columns. */
  protected readonly headerGridColumns = computed(() => {
    const cols = this.timeline().columns;
    return cols.map((c) => `${c.span}fr`).join(" ");
  });

  /** CSS grid-template-columns for the top-level group header. */
  protected readonly groupGridColumns = computed(() => {
    const groups = this.timeline().groups;
    return groups.map((g) => `${g.span}fr`).join(" ");
  });

  // ── Public methods ──────────────────────────────────────────────────

  /** Handle task bar click. */
  protected onTaskClick(task: GanttTask<T>): void {
    this.taskClicked.emit(task);
  }

  /** Sync horizontal scroll between header and body. */
  protected onBodyScroll(event: Event): void {
    const el = event.target as HTMLElement;
    this.scrollLeft.set(el.scrollLeft);
  }

  // ── Private methods ─────────────────────────────────────────────────

  /** Build a depth map for hierarchical indentation. */
  private buildDepthMap(tasks: readonly GanttTask[]): Map<string, number> {
    const map = new Map<string, number>();
    const taskById = new Map(tasks.map((t) => [t.id, t]));

    const getDepth = (id: string): number => {
      if (map.has(id)) return map.get(id)!;
      const task = taskById.get(id);
      if (!task?.parentId || !taskById.has(task.parentId)) {
        map.set(id, 0);
        return 0;
      }
      const depth = getDepth(task.parentId) + 1;
      map.set(id, depth);
      return depth;
    };

    for (const t of tasks) {
      getDepth(t.id);
    }

    return map;
  }
}
