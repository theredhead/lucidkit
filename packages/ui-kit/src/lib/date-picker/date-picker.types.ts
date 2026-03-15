/**
 * Predefined date format strings.
 *
 * Each format describes how day (dd), month (MM), and four-digit year
 * (yyyy) are arranged plus the separator character used between them.
 *
 * | Format         | Example        | Region                      |
 * |----------------|----------------|-----------------------------|
 * `yyyy-MM-dd`     | 2026-03-15     | ISO 8601 / international    |
 * `dd/MM/yyyy`     | 15/03/2026     | Europe, South America, etc. |
 * `MM/dd/yyyy`     | 03/15/2026     | United States               |
 * `dd.MM.yyyy`     | 15.03.2026     | Germany, Switzerland        |
 * `dd-MM-yyyy`     | 15-03-2026     | Netherlands, various        |
 * `yyyy/MM/dd`     | 2026/03/15     | Japan, China, Korea         |
 */
export type DateFormat =
  | "yyyy-MM-dd"
  | "dd/MM/yyyy"
  | "MM/dd/yyyy"
  | "dd.MM.yyyy"
  | "dd-MM-yyyy"
  | "yyyy/MM/dd";

/** Represents a calendar day inside the month grid. */
export interface CalendarDay {
  /** The full date this cell represents. */
  readonly date: Date;
  /** Day of the month (1–31). */
  readonly day: number;
  /** Whether this day belongs to the currently displayed month. */
  readonly isCurrentMonth: boolean;
  /** Whether this day is today. */
  readonly isToday: boolean;
  /** Whether this day matches the currently selected date. */
  readonly isSelected: boolean;
  /** Whether this day is outside the allowed min/max range. */
  readonly isDisabled: boolean;
}

/** Names of weekdays used as column headers. */
export interface WeekdayLabel {
  readonly short: string;
  readonly long: string;
}
