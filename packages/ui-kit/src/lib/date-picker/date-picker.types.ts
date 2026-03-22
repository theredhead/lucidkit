import { InjectionToken } from "@angular/core";

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

/**
 * Application-wide defaults for `UIDatePicker`.
 *
 * Provide via `UI_DATE_PICKER_DEFAULTS` to override the locale-detected
 * format and/or first day of week for every date picker that doesn't
 * have an explicit input set.
 *
 * @example
 * ```ts
 * providers: [
 *   {
 *     provide: UI_DATE_PICKER_DEFAULTS,
 *     useValue: { format: 'dd/MM/yyyy', firstDayOfWeek: 1 },
 *   },
 * ]
 * ```
 */
export interface DatePickerDefaults {
  /** Default date format. */
  readonly format?: DateFormat;
  /** Default first day of the week (`0` = Sunday … `6` = Saturday). */
  readonly firstDayOfWeek?: number;
}

/**
 * Injection token for application-wide `UIDatePicker` defaults.
 *
 * When provided, these values are used instead of locale detection
 * for any date picker whose corresponding input is not explicitly set.
 */
export const UI_DATE_PICKER_DEFAULTS = new InjectionToken<DatePickerDefaults>(
  "UI_DATE_PICKER_DEFAULTS",
);
