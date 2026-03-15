import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";

import type {
  DateFormat,
  CalendarDay,
  WeekdayLabel,
} from "./date-picker.types";
import {
  buildCalendarGrid,
  formatDate,
  getPlaceholder,
  getWeekdayLabels,
  parseDate,
} from "./date-picker.utils";

/**
 * Date picker with text input and popover calendar.
 *
 * Supports international date formats and keyboard interaction.
 * The calendar popup opens on focus or button click and allows
 * month/year navigation plus direct day selection.
 *
 * @example
 * ```html
 * <ui-date-picker
 *   [(value)]="birthday"
 *   format="dd/MM/yyyy"
 *   placeholder="dd/MM/yyyy"
 * />
 * ```
 */
@Component({
  selector: "ui-date-picker",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./date-picker.component.html",
  styleUrl: "./date-picker.component.scss",
  host: {
    class: "ui-date-picker",
    "(document:click)": "onDocumentClick($event)",
    "(document:keydown.escape)": "closeCalendar()",
  },
})
export class UIDatePicker {
  private static _nextId = 0;

  // ── Inputs ─────────────────────────────────────────────────

  /**
   * Date format used for display and parsing.
   * Defaults to `'yyyy-MM-dd'` (ISO 8601).
   */
  readonly format = input<DateFormat>("yyyy-MM-dd");

  /** Placeholder text shown when empty. Defaults to the format string. */
  readonly placeholder = input<string | undefined>(undefined);

  /** Whether the control is disabled. */
  readonly disabled = input<boolean>(false);

  /** Whether the control is read-only. */
  readonly readonly = input<boolean>(false);

  /** Minimum selectable date. */
  readonly min = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly max = input<Date | null>(null);

  /**
   * First day of the week.
   * `0` = Sunday, `1` = Monday (default), …, `6` = Saturday.
   */
  readonly firstDayOfWeek = input<number>(1);

  /** Accessible label forwarded to the native `<input>`. */
  readonly ariaLabel = input<string>("Date");

  // ── Model (two-way) ────────────────────────────────────────

  /** Currently selected date. Two-way bindable via `[(value)]`. */
  readonly value = model<Date | null>(null);

  // ── Outputs ────────────────────────────────────────────────

  /** Emitted when the user selects a date from the calendar or types a valid date. */
  readonly dateChange = output<Date | null>();

  // ── Computed ───────────────────────────────────────────────

  /** Effective placeholder derived from format if not explicitly set. */
  protected readonly effectivePlaceholder = computed(
    () => this.placeholder() ?? getPlaceholder(this.format()),
  );

  /** Column headers for the calendar grid. */
  protected readonly weekdayLabels = computed<WeekdayLabel[]>(() =>
    getWeekdayLabels(this.firstDayOfWeek()),
  );

  /** The 6×7 grid of calendar days for the currently viewed month. */
  protected readonly calendarDays = computed<CalendarDay[]>(() =>
    buildCalendarGrid(
      this.viewDate(),
      this.value(),
      this.min(),
      this.max(),
      this.firstDayOfWeek(),
    ),
  );

  /** Month/year label shown in the calendar header. */
  protected readonly monthYearLabel = computed(() => {
    const d = this.viewDate();
    const month = d.toLocaleDateString("en", { month: "long" });
    return `${month} ${d.getFullYear()}`;
  });

  // ── Internal state ─────────────────────────────────────────

  /** Raw text in the input field. */
  protected readonly inputText = signal("");

  /** Whether the calendar popup is open. */
  protected readonly isOpen = signal(false);

  /** The month currently displayed in the calendar. */
  protected readonly viewDate = signal(new Date());

  /** Unique id for ARIA linkage. */
  protected readonly calendarId = `ui-dp-cal-${UIDatePicker._nextId++}`;

  private readonly elRef = inject(ElementRef<HTMLElement>);

  // ── Effects ────────────────────────────────────────────────

  /** Sync input text when value changes programmatically. */
  private readonly syncText = effect(() => {
    const val = this.value();
    const fmt = this.format();
    this.inputText.set(formatDate(val, fmt));
    if (val) {
      this.viewDate.set(new Date(val));
    }
  });

  // ── Input handlers ─────────────────────────────────────────

  /** @internal */
  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.inputText.set(text);

    const parsed = parseDate(text, this.format());
    if (parsed) {
      if (!this.isDateDisabled(parsed)) {
        this.value.set(parsed);
        this.dateChange.emit(parsed);
        this.viewDate.set(new Date(parsed));
      }
    }
  }

  /** @internal */
  protected onBlur(): void {
    const text = this.inputText();
    if (text === "") {
      this.value.set(null);
      this.dateChange.emit(null);
      return;
    }

    const parsed = parseDate(text, this.format());
    if (parsed && !this.isDateDisabled(parsed)) {
      this.value.set(parsed);
      this.dateChange.emit(parsed);
    }
    // Re-sync text to normalised format
    this.inputText.set(formatDate(this.value(), this.format()));
  }

  /** @internal */
  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === "ArrowDown" && !this.isOpen()) {
      event.preventDefault();
      this.openCalendar();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      this.onBlur();
    }
  }

  // ── Calendar interaction ───────────────────────────────────

  /** @internal */
  protected selectDay(day: CalendarDay): void {
    if (day.isDisabled) return;
    this.value.set(day.date);
    this.dateChange.emit(day.date);
    this.closeCalendar();
  }

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
    this.viewDate.set(today);
    if (!this.isDateDisabled(today)) {
      this.value.set(today);
      this.dateChange.emit(today);
    }
    this.closeCalendar();
  }

  // ── Popup management ───────────────────────────────────────

  /** @internal */
  protected openCalendar(): void {
    if (this.disabled() || this.readonly()) return;
    this.isOpen.set(true);
    if (this.value()) {
      this.viewDate.set(new Date(this.value()!));
    }
  }

  /** @internal */
  protected closeCalendar(): void {
    this.isOpen.set(false);
  }

  /** @internal */
  protected toggleCalendar(): void {
    if (this.isOpen()) {
      this.closeCalendar();
    } else {
      this.openCalendar();
    }
  }

  /** @internal */
  protected onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target as Node)) {
      this.closeCalendar();
    }
  }

  /** @internal */
  protected onCalendarKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.closeCalendar();
    }
  }

  // ── Helpers ────────────────────────────────────────────────

  private isDateDisabled(date: Date): boolean {
    const min = this.min();
    const max = this.max();
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (min) {
      const m = new Date(min);
      m.setHours(0, 0, 0, 0);
      if (d < m) return true;
    }
    if (max) {
      const m = new Date(max);
      m.setHours(0, 0, 0, 0);
      if (d > m) return true;
    }
    return false;
  }
}
