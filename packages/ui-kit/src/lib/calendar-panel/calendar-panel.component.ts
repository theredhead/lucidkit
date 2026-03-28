import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";

import type {
  CalendarDay,
  DateFormat,
  WeekdayLabel,
} from "../date-picker/date-picker.types";
import {
  buildCalendarGrid,
  getWeekdayLabels,
  parseDate,
} from "../date-picker/date-picker.utils";
import type { InputPopupPanel } from "../input/adapters/popup-text-adapter";

/**
 * Standalone calendar grid panel for date selection.
 *
 * Renders a month view with navigation and day buttons. Designed to
 * be used inside {@link UIInput} via a {@link PopupTextAdapter} but
 * can also be used standalone.
 *
 * Implements {@link InputPopupPanel} so {@link UIInput} can subscribe
 * to `valueSelected` and `closeRequested` automatically.
 *
 * @example
 * ```html
 * <ui-calendar-panel
 *   currentValue="2026-03-15"
 *   format="yyyy-MM-dd"
 *   (valueSelected)="onDatePicked($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-calendar-panel",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar-panel.component.html",
  styleUrl: "./calendar-panel.component.scss",
  host: {
    class: "ui-calendar-panel",
    "(keydown.escape)": "closeRequested.emit()",
  },
})
export class UICalendarPanel implements InputPopupPanel<Date> {
  // ── Inputs ─────────────────────────────────────────────────

  /** Current value as a formatted date string (e.g. `"2026-03-15"`). */
  public readonly currentValue = input<string>("");

  /** Date format used for parsing {@link currentValue}. */
  public readonly format = input<DateFormat>("yyyy-MM-dd");

  /** Minimum selectable date. */
  public readonly min = input<Date | null>(null);

  /** Maximum selectable date. */
  public readonly max = input<Date | null>(null);

  /**
   * First day of the week.
   * `0` = Sunday, `1` = Monday, …, `6` = Saturday.
   */
  public readonly firstDayOfWeek = input<number>(1);

  // ── Outputs ────────────────────────────────────────────────

  /** Emitted when the user selects a day. */
  public readonly valueSelected = output<Date>();

  /** Emitted when the panel should close (e.g. Escape key). */
  public readonly closeRequested = output<void>();

  // ── Computed ───────────────────────────────────────────────

  /** Column headers for the calendar grid. */
  protected readonly weekdayLabels = computed<WeekdayLabel[]>(() =>
    getWeekdayLabels(this.firstDayOfWeek()),
  );

  /** The 6 × 7 grid of calendar days for the currently viewed month. */
  protected readonly calendarDays = computed<CalendarDay[]>(() =>
    buildCalendarGrid(
      this.viewDate(),
      this.parsedDate(),
      this.min(),
      this.max(),
      this.firstDayOfWeek(),
    ),
  );

  /** Month/year label shown in the header. */
  protected readonly monthYearLabel = computed(() => {
    const d = this.viewDate();
    const month = d.toLocaleDateString("en", { month: "long" });
    return `${month} ${d.getFullYear()}`;
  });

  // ── Internal state ─────────────────────────────────────────

  /** The month currently displayed in the calendar. */
  protected readonly viewDate = signal(new Date());

  /** Parsed Date from the currentValue text input. */
  private readonly parsedDate = computed<Date | null>(() => {
    const text = this.currentValue();
    if (!text) return null;
    return parseDate(text, this.format());
  });

  // ── Effects ────────────────────────────────────────────────

  /** Sync viewDate to the parsed value when it changes. */
  private readonly _syncViewDate = effect(() => {
    const parsed = this.parsedDate();
    if (parsed) {
      this.viewDate.set(new Date(parsed));
    }
  });

  // ── Calendar navigation ────────────────────────────────────

  /** @internal */
  protected prevMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  /** @internal */
  protected nextMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  /** @internal */
  protected prevYear(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear() - 1, d.getMonth(), 1));
  }

  /** @internal */
  protected nextYear(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear() + 1, d.getMonth(), 1));
  }

  /** @internal */
  protected goToToday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.viewDate.set(today);
    this.valueSelected.emit(today);
  }

  /** @internal */
  protected selectDay(day: CalendarDay): void {
    if (day.isDisabled) return;
    this.valueSelected.emit(day.date);
  }
}
