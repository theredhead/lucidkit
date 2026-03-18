/**
 * View-mode granularity for the Gantt timeline header.
 *
 * - `'day'`   — one column per day
 * - `'week'`  — one column per week
 * - `'month'` — one column per month
 */
export type GanttViewMode = "day" | "week" | "month";

/**
 * Style overrides for an individual task bar.
 */
export interface GanttBarStyle {
  /** Bar fill colour. Falls back to the palette colour. */
  readonly color?: string;

  /** Border radius in pixels. */
  readonly borderRadius?: number;

  /** Bar height as a fraction of the row height (0–1). */
  readonly heightRatio?: number;
}

/**
 * A single task in a Gantt chart.
 *
 * @typeParam T - Optional payload type for extra data.
 */
export interface GanttTask<T = unknown> {
  /** Unique identifier. */
  readonly id: string;

  /** Display label shown in the task list. */
  readonly title: string;

  /** Task start date (inclusive). */
  readonly start: Date;

  /** Task end date (inclusive). */
  readonly end: Date;

  /**
   * Completion percentage (0–100).
   * When provided a progress overlay is drawn inside the bar.
   */
  readonly progress?: number;

  /**
   * Parent task ID for hierarchical grouping.
   * Top-level tasks have no parent.
   */
  readonly parentId?: string;

  /** Whether this task is a milestone (zero-duration diamond marker). */
  readonly milestone?: boolean;

  /** Visual style overrides. */
  readonly style?: GanttBarStyle;

  /** IDs of tasks that must complete before this task can start. */
  readonly dependencies?: readonly string[];

  /** Arbitrary user data attached to the task. */
  readonly data?: T;
}

/**
 * A resolved dependency link between two tasks, used for rendering
 * connector lines.
 */
export interface GanttDependencyLink {
  /** ID of the predecessor (from) task. */
  readonly fromId: string;

  /** ID of the successor (to) task. */
  readonly toId: string;
}

/**
 * Datasource contract for the Gantt chart.
 *
 * Follows the same philosophy as `IDatasource<T>` but is tailored
 * for temporal task data: it exposes a flat list of tasks and a
 * derived list of dependency links.
 *
 * @typeParam T - Optional payload type on each {@link GanttTask}.
 */
export interface IGanttDatasource<T = unknown> {
  /** Returns all tasks. */
  getTasks(): readonly GanttTask<T>[];

  /** Returns all dependency links derived from task `dependencies` arrays. */
  getDependencies(): readonly GanttDependencyLink[];
}

/**
 * Default colour palette for Gantt task bars.
 * 8 distinct hues with good contrast in both light and dark themes.
 */
export const DEFAULT_GANTT_PALETTE: readonly string[] = [
  "#4285f4", // blue
  "#34a853", // green
  "#ff6d01", // orange
  "#7b1fa2", // purple
  "#ea4335", // red
  "#46bdc6", // teal
  "#fbbc04", // yellow
  "#c2185b", // pink
];
