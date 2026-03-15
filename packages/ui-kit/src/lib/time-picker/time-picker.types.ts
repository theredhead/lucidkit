/**
 * Supported time display modes.
 *
 * | Mode   | Display     | Notes                        |
 * |--------|-------------|------------------------------|
 * | `24`   | `14:30`     | 24-hour clock (default)      |
 * | `12`   | `2:30 PM`   | 12-hour clock with AM/PM     |
 */
export type TimeMode = 12 | 24;

/** Meridiem indicator for 12-hour mode. */
export type Meridiem = "AM" | "PM";

/** Parsed time value used internally. */
export interface TimeValue {
  /** Hour (0–23). */
  readonly hours: number;
  /** Minute (0–59). */
  readonly minutes: number;
}
