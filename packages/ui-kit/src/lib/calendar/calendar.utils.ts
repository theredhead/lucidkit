/**
 * Pure date-utility functions for the calendar module.
 *
 * All helpers are side-effect free and return new `Date` instances.
 *
 * @internal
 */

/**
 * Returns a new `Date` set to midnight of the given date.
 */
export function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/**
 * Returns a new `Date` set to 23:59:59.999 of the given date.
 */
export function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

/**
 * Returns the first day of the month containing `d`.
 */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Returns the last day of the month containing `d`.
 */
export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * Returns an ISO date string `YYYY-MM-DD` for the given date.
 */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Returns `true` if `a` and `b` represent the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Adds (or subtracts) the given number of months to `d`.
 */
export function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setDate(1); // avoid overflow (e.g. Jan 31 + 1 month)
  r.setMonth(r.getMonth() + months);
  return r;
}

/**
 * Returns the day-of-week index (0 = Monday … 6 = Sunday)
 * following ISO-8601 convention (week starts on Monday).
 */
export function isoWeekday(d: Date): number {
  return (d.getDay() + 6) % 7; // JS Sunday=0 → ISO Sunday=6
}

/**
 * Short weekday labels starting from Monday (ISO).
 */
export const WEEKDAY_LABELS: readonly string[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

/**
 * Returns the ISO 8601 week number (1–53) for the given date.
 *
 * ISO weeks start on Monday. Week 1 is the week containing the
 * first Thursday of the year (equivalently, the week containing
 * January 4th).
 */
export function isoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to the nearest Thursday: current date + 4 − current day number.
  // Make Sunday (0) map to 7.
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  // Get first day of the year
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
}
