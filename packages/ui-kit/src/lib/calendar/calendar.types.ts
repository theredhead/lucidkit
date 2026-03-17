import { Emitter } from "@theredhead/foundation";

// ── Calendar Event ────────────────────────────────────────────────

/**
 * A single calendar event.
 *
 * @typeParam T - Optional payload type for application-specific data
 *               attached to the event.
 */
export interface CalendarEvent<T = unknown> {
  /** Unique identifier for this event. */
  readonly id: string;

  /** Display title shown on the calendar. */
  readonly title: string;

  /** Start date-time of the event. */
  readonly start: Date;

  /**
   * End date-time of the event.
   * When omitted, the event is treated as a single-day / point-in-time
   * occurrence whose end equals its start.
   */
  readonly end?: Date;

  /**
   * Whether the event spans the entire day.
   * When `true`, the time portion of `start` / `end` is ignored in
   * display logic.
   */
  readonly allDay?: boolean;

  /**
   * CSS colour string for the event swatch (hex, rgb, hsl, named).
   * Falls back to the first palette colour when omitted.
   */
  readonly color?: string;

  /** Optional arbitrary payload the consumer can attach. */
  readonly data?: T;
}

// ── Day cell descriptor ───────────────────────────────────────────

/**
 * Describes a single day cell in the month grid.
 *
 * @internal Used by the month-view component template.
 */
export interface CalendarMonthDay {
  /** The date this cell represents. */
  readonly date: Date;
  /** ISO date string `YYYY-MM-DD` (used as track key). */
  readonly iso: string;
  /** Day-of-month number (1–31). */
  readonly day: number;
  /** Whether this day belongs to the currently displayed month. */
  readonly inMonth: boolean;
  /** Whether this day is today. */
  readonly isToday: boolean;
  /** Events that fall on this day. */
  readonly events: readonly CalendarEvent[];
}

// ── Datasource contract ───────────────────────────────────────────

/**
 * Contract for a calendar event provider.
 *
 * Implementations supply events that fall within a given date range.
 * The datasource emits a `changed` event whenever its underlying data
 * is mutated so the view can re-query.
 *
 * @typeParam T - The event payload type.
 *
 * @example
 * ```ts
 * const ds = new ArrayCalendarDatasource(myEvents);
 * const visible = ds.getEvents(startOfMonth, endOfMonth);
 * ds.changed.subscribe(() => refreshView());
 * ```
 */
export interface CalendarDatasource<T = unknown> {
  /**
   * Returns all events whose date range intersects `[rangeStart, rangeEnd]`.
   *
   * An event intersects the range when:
   * - `event.start <= rangeEnd` **and**
   * - `(event.end ?? event.start) >= rangeStart`
   *
   * @param rangeStart - Inclusive start of the query window.
   * @param rangeEnd   - Inclusive end of the query window.
   */
  getEvents(rangeStart: Date, rangeEnd: Date): readonly CalendarEvent<T>[];

  /**
   * Emitted whenever the underlying event data changes
   * (add, remove, update, bulk replace).
   */
  readonly changed: Emitter<void>;
}

// ── Default palette ───────────────────────────────────────────────

/**
 * Default event colour palette — 8 distinct hues for auto-assignment.
 */
export const DEFAULT_EVENT_PALETTE: readonly string[] = [
  "#4285f4", // blue
  "#ea4335", // red
  "#34a853", // green
  "#fbbc04", // yellow
  "#ff6d01", // orange
  "#46bdc6", // teal
  "#7b1fa2", // purple
  "#c2185b", // pink
];
