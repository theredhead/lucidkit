import type { GanttTask, GanttViewMode } from "./gantt-chart.types";

// ── Date arithmetic helpers ───────────────────────────────────────────

const MS_PER_DAY = 86_400_000;

/**
 * Strip time from a Date, returning midnight UTC.
 *
 * @internal
 */
export function startOfDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

/**
 * Number of whole days between two dates (inclusive).
 *
 * @internal
 */
export function daysBetween(a: Date, b: Date): number {
  return Math.round(
    (startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY,
  );
}

/**
 * Add `n` days to a date and return a new Date.
 *
 * @internal
 */
export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Return the Monday of the week containing `date`.
 *
 * @internal
 */
export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getUTCDay(); // 0 = Sunday
  const diff = (day + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

/**
 * Return the 1st of the month containing `date`.
 *
 * @internal
 */
export function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
}

/**
 * Return the last day of the month containing `date`.
 *
 * @internal
 */
export function endOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
}

// ── Timeline computation ──────────────────────────────────────────────

/**
 * A single column in the timeline header.
 */
export interface TimelineColumn {

  /** Label displayed in the header cell. */
  readonly label: string;

  /** The date this column starts on. */
  readonly date: Date;

  /** Number of day-units this column spans. */
  readonly span: number;
}

/**
 * Top-level header group (e.g. month name when view mode is "day" or "week").
 */
export interface TimelineGroup {

  /** Display label (e.g. "Mar 2026"). */
  readonly label: string;

  /** Number of sub-columns this group spans. */
  readonly span: number;
}

/**
 * Complete timeline metadata for the Gantt chart.
 */
export interface TimelineInfo {

  /** Start of the visible range (midnight UTC). */
  readonly rangeStart: Date;

  /** End of the visible range (midnight UTC). */
  readonly rangeEnd: Date;

  /** Total number of day-units in the range. */
  readonly totalDays: number;

  /** Top-level header groups. */
  readonly groups: readonly TimelineGroup[];

  /** Individual columns in the sub-header row. */
  readonly columns: readonly TimelineColumn[];
}

/**
 * Compute the visible date range from a set of tasks with padding.
 *
 * @internal
 */
export function computeDateRange(
  tasks: readonly GanttTask[],
  paddingDays = 2,
): { start: Date; end: Date } {
  if (tasks.length === 0) {
    const today = startOfDay(new Date());
    return { start: today, end: addDays(today, 30) };
  }

  let minDate = Infinity;
  let maxDate = -Infinity;

  for (const t of tasks) {
    const s = startOfDay(t.start).getTime();
    const e = startOfDay(t.end).getTime();
    if (s < minDate) minDate = s;
    if (e > maxDate) maxDate = e;
  }

  return {
    start: addDays(new Date(minDate), -paddingDays),
    end: addDays(new Date(maxDate), paddingDays),
  };
}

/**
 * Build timeline columns and groups for a given date range and view mode.
 *
 * @internal
 */
export function buildTimeline(
  rangeStart: Date,
  rangeEnd: Date,
  viewMode: GanttViewMode,
): TimelineInfo {
  const start = startOfDay(rangeStart);
  const end = startOfDay(rangeEnd);
  const totalDays = daysBetween(start, end) + 1;

  const columns: TimelineColumn[] = [];
  const groups: TimelineGroup[] = [];

  switch (viewMode) {
    case "day":
      buildDayColumns(start, totalDays, columns, groups);
      break;
    case "week":
      buildWeekColumns(start, end, columns, groups);
      break;
    case "month":
      buildMonthColumns(start, end, columns, groups);
      break;
  }

  return { rangeStart: start, rangeEnd: end, totalDays, groups, columns };
}

/**
 * Format a short month label.
 *
 * @internal
 */
function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Build day-level columns grouped by month.
 */
function buildDayColumns(
  start: Date,
  totalDays: number,
  columns: TimelineColumn[],
  groups: TimelineGroup[],
): void {
  let currentMonth = -1;
  let currentGroupIdx = -1;

  for (let i = 0; i < totalDays; i++) {
    const d = addDays(start, i);
    const m = d.getMonth();

    if (m !== currentMonth) {
      currentMonth = m;
      groups.push({ label: monthLabel(d), span: 0 });
      currentGroupIdx = groups.length - 1;
    }

    columns.push({
      label: String(d.getDate()),
      date: d,
      span: 1,
    });

    (groups[currentGroupIdx] as { span: number }).span++;
  }
}

/**
 * Build week-level columns grouped by month.
 */
function buildWeekColumns(
  start: Date,
  end: Date,
  columns: TimelineColumn[],
  groups: TimelineGroup[],
): void {
  let cursor = startOfWeek(start);
  let currentMonth = -1;
  let currentGroupIdx = -1;

  while (cursor.getTime() <= end.getTime()) {
    const weekEnd = addDays(cursor, 6);
    const m = cursor.getMonth();

    if (m !== currentMonth) {
      currentMonth = m;
      groups.push({ label: monthLabel(cursor), span: 0 });
      currentGroupIdx = groups.length - 1;
    }

    const span = daysBetween(cursor, weekEnd) + 1;

    columns.push({
      label: `${cursor.getDate()}`,
      date: cursor,
      span,
    });

    (groups[currentGroupIdx] as { span: number }).span++;
    cursor = addDays(cursor, 7);
  }
}

/**
 * Build month-level columns grouped by year.
 */
function buildMonthColumns(
  start: Date,
  end: Date,
  columns: TimelineColumn[],
  groups: TimelineGroup[],
): void {
  let cursor = startOfMonth(start);
  let currentYear = -1;
  let currentGroupIdx = -1;

  while (cursor.getTime() <= end.getTime()) {
    const y = cursor.getFullYear();

    if (y !== currentYear) {
      currentYear = y;
      groups.push({ label: String(y), span: 0 });
      currentGroupIdx = groups.length - 1;
    }

    const monthEnd = endOfMonth(cursor);
    const span = daysBetween(cursor, monthEnd) + 1;

    columns.push({
      label: cursor.toLocaleDateString("en-US", { month: "short" }),
      date: cursor,
      span,
    });

    (groups[currentGroupIdx] as { span: number }).span++;
    cursor = new Date(Date.UTC(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  }
}

/**
 * Compute the left offset (%) and width (%) of a task bar within the
 * full timeline range.
 *
 * @internal
 */
export function computeBarPosition(
  task: GanttTask,
  rangeStart: Date,
  totalDays: number,
): { left: number; width: number } {
  const taskStart = daysBetween(rangeStart, task.start);
  const taskDuration = daysBetween(task.start, task.end) + 1;

  const left = (taskStart / totalDays) * 100;
  const width = (taskDuration / totalDays) * 100;

  return { left: Math.max(0, left), width: Math.max(0.5, width) };
}

/**
 * Compute the left offset (%) for the "today" marker line.
 * Returns `null` if today is outside the visible range.
 *
 * @internal
 */
export function computeTodayPosition(
  rangeStart: Date,
  totalDays: number,
): number | null {
  const today = startOfDay(new Date());
  const offset = daysBetween(rangeStart, today);
  if (offset < 0 || offset > totalDays) return null;
  return (offset / totalDays) * 100;
}
