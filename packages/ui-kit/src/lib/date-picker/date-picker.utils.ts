import type {
  DateFormat,
  CalendarDay,
  WeekdayLabel,
} from "./date-picker.types";

// ── Separator helpers ──────────────────────────────────────────────

/** Extract the separator character from a format string. */
export function getSeparator(format: DateFormat): string {
  if (format.includes("/")) return "/";
  if (format.includes(".")) return ".";
  return "-";
}

// ── Formatting ─────────────────────────────────────────────────────

/** Zero-pad a number to two digits. */
function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Format a `Date` into a string using the given format. */
export function formatDate(date: Date | null, format: DateFormat): string {
  if (!date || isNaN(date.getTime())) return "";

  const dd = pad2(date.getDate());
  const MM = pad2(date.getMonth() + 1);
  const yyyy = `${date.getFullYear()}`;

  switch (format) {
    case "yyyy-MM-dd":
      return `${yyyy}-${MM}-${dd}`;
    case "dd/MM/yyyy":
      return `${dd}/${MM}/${yyyy}`;
    case "MM/dd/yyyy":
      return `${MM}/${dd}/${yyyy}`;
    case "dd.MM.yyyy":
      return `${dd}.${MM}.${yyyy}`;
    case "dd-MM-yyyy":
      return `${dd}-${MM}-${yyyy}`;
    case "yyyy/MM/dd":
      return `${yyyy}/${MM}/${dd}`;
  }
}

// ── Parsing ────────────────────────────────────────────────────────

/**
 * Parse a user-typed string into a `Date` using the expected format.
 * Returns `null` if the input doesn't match the format or produces
 * an invalid date.
 */
export function parseDate(text: string, format: DateFormat): Date | null {
  const sep = getSeparator(format);
  const parts = text.split(sep);
  if (parts.length !== 3) return null;

  let year: number;
  let month: number;
  let day: number;

  switch (format) {
    case "yyyy-MM-dd":
    case "yyyy/MM/dd":
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
      break;
    case "dd/MM/yyyy":
    case "dd.MM.yyyy":
    case "dd-MM-yyyy":
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
      break;
    case "MM/dd/yyyy":
      month = parseInt(parts[0], 10);
      day = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
      break;
  }

  if (isNaN(year!) || isNaN(month!) || isNaN(day!)) return null;
  if (year! < 1 || month! < 1 || month! > 12 || day! < 1 || day! > 31)
    return null;

  const date = new Date(year!, month! - 1, day!);

  // Validate the date is real (e.g. Feb 30 → invalid)
  if (
    date.getFullYear() !== year! ||
    date.getMonth() !== month! - 1 ||
    date.getDate() !== day!
  ) {
    return null;
  }

  return date;
}

// ── Calendar grid ──────────────────────────────────────────────────

/** Build the 6 × 7 grid of days for the month that contains `viewDate`. */
export function buildCalendarGrid(
  viewDate: Date,
  selectedDate: Date | null,
  min: Date | null,
  max: Date | null,
  firstDayOfWeek: number,
): CalendarDay[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  let startDay = firstOfMonth.getDay() - firstDayOfWeek;
  if (startDay < 0) startDay += 7;

  const gridStart = new Date(year, month, 1 - startDay);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selNorm = selectedDate ? normalizeDate(selectedDate) : null;
  const minNorm = min ? normalizeDate(min) : null;
  const maxNorm = max ? normalizeDate(max) : null;

  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    const norm = normalizeDate(date);

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: norm.getTime() === today.getTime(),
      isSelected: selNorm !== null && norm.getTime() === selNorm.getTime(),
      isDisabled:
        (minNorm !== null && norm < minNorm) ||
        (maxNorm !== null && norm > maxNorm),
    });
  }

  return days;
}

/** Strip time information from a Date. */
export function normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get localized weekday labels starting from `firstDayOfWeek`. */
export function getWeekdayLabels(firstDayOfWeek: number): WeekdayLabel[] {
  const labels: WeekdayLabel[] = [];
  // Use a known Sunday as base: Jan 4, 1970 was a Sunday
  const base = new Date(1970, 0, 4);

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + ((firstDayOfWeek + i) % 7));
    labels.push({
      short: d.toLocaleDateString("en", { weekday: "narrow" }),
      long: d.toLocaleDateString("en", { weekday: "long" }),
    });
  }
  return labels;
}

/** Get the display placeholder from a format, e.g. "dd/MM/yyyy". */
export function getPlaceholder(format: DateFormat): string {
  return format;
}

/** Check if two dates are the same calendar month. */
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
