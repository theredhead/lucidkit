import type { Meridiem, TimeMode, TimeValue } from "./time-picker.types";

// ── Formatting ─────────────────────────────────────────────────────

/** Zero-pad a number to two digits. */
function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Format a `TimeValue` to a display string.
 *
 * - 24-hour: `"14:05"`
 * - 12-hour: `"2:05 PM"`
 */
export function formatTime(value: TimeValue | null, mode: TimeMode): string {
  if (!value) return "";

  if (mode === 24) {
    return `${pad2(value.hours)}:${pad2(value.minutes)}`;
  }

  // 12-hour
  const meridiem = value.hours >= 12 ? "PM" : "AM";
  let h = value.hours % 12;
  if (h === 0) h = 12;
  return `${h}:${pad2(value.minutes)} ${meridiem}`;
}

// ── Parsing ────────────────────────────────────────────────────────

/**
 * Parse a time string into a `TimeValue`.
 *
 * Accepts:
 * - `"HH:mm"` (24-hour)
 * - `"H:mm AM"` / `"H:mm PM"` (12-hour)
 *
 * Returns `null` if the string cannot be parsed into valid hours/minutes.
 */
export function parseTime(text: string): TimeValue | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Try 12-hour format first: "2:30 PM" or "02:30 pm"
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const meridiem = match12[3].toUpperCase() as Meridiem;

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;

    if (meridiem === "AM" && hours === 12) hours = 0;
    if (meridiem === "PM" && hours !== 12) hours += 12;

    return { hours, minutes };
  }

  // Try 24-hour format: "14:30" or "09:05"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

    return { hours, minutes };
  }

  return null;
}

// ── Helpers ────────────────────────────────────────────────────────

/** Convert a 24-hour value to 12-hour display hour (1–12). */
export function to12Hour(hours24: number): number {
  const h = hours24 % 12;
  return h === 0 ? 12 : h;
}

/** Get the meridiem for a 24-hour value. */
export function getMeridiem(hours24: number): Meridiem {
  return hours24 >= 12 ? "PM" : "AM";
}

/** Clamp a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Wrap a value cyclically (used for hour/minute up/down). */
export function wrap(value: number, min: number, max: number): number {
  if (value < min) return max;
  if (value > max) return min;
  return value;
}

/**
 * Compare two TimeValues.
 * Returns negative if a < b, 0 if equal, positive if a > b.
 */
export function compareTime(a: TimeValue, b: TimeValue): number {
  const diff = a.hours * 60 + a.minutes - (b.hours * 60 + b.minutes);
  return diff;
}
