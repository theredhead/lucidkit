import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { SlicePipe } from "@angular/common";
import { LoggerFactory } from "@theredhead/foundation";
import { PopoverService } from "../popover/popover.service";
import { UICalendarDayPopover } from "./calendar-day-popover.component";
import type {
  CalendarDatasource,
  CalendarMonthDay,
  CalendarEvent,
} from "./calendar.types";
import { DEFAULT_EVENT_PALETTE } from "./calendar.types";
import {
  addMonths,
  isSameDay,
  isoWeekday,
  isoWeekNumber,
  startOfMonth,
  toIsoDate,
  WEEKDAY_LABELS,
} from "./calendar.utils";
import type { PopoverRef } from "../popover/popover.types";

/**
 * Calendar month-view component.
 *
 * Renders a traditional month grid (7 columns × 4–6 rows) populated
 * with events from a {@link CalendarDatasource}. The user can navigate
 * between months and select individual days.
 *
 * @example
 * ```html
 * <ui-calendar-month-view
 *   [datasource]="calendarDs"
 *   [(selectedDate)]="selected"
 *   (dateSelected)="onPick($event)"
 *   (monthChanged)="onNav($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-calendar-month-view",
  standalone: true,
  imports: [SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar-month-view.component.html",
  styleUrl: "./calendar-month-view.component.scss",
  host: {
    class: "ui-calendar-month-view",
    "[class.ui-calendar-month-view--disabled]": "disabled()",
  },
})
export class UICalendarMonthView {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Whether the calendar month view is disabled. */
  public readonly disabled = input<boolean>(false);

  /** The datasource providing calendar events. */
  public readonly datasource = input.required<CalendarDatasource>();

  /**
   * The currently selected date (two-way bindable).
   * Defaults to today.
   */
  public readonly selectedDate = model<Date>(new Date());

  /** Maximum number of event badges shown per day cell. */
  public readonly maxEventsPerDay = input<number>(3);

  /** Colour palette for events that lack an explicit `color`. */
  public readonly palette = input<readonly string[]>(DEFAULT_EVENT_PALETTE);

  /** Accessible label for the calendar region. */
  public readonly ariaLabel = input<string>("Calendar month view");

  /** Whether to show an ISO week-number column on the leading edge. */
  public readonly showWeekNumbers = input<boolean>(false);

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emitted when the user clicks a day cell. */
  public readonly dateSelected = output<Date>();

  /** Emitted when the user clicks an event badge. */
  public readonly eventSelected = output<CalendarEvent>();

  /** Emitted when the displayed month changes (navigation). */
  public readonly monthChanged = output<Date>();

  // ── Computed ─────────────────────────────────────────────────────────

  /** The first day of the currently displayed month. */
  protected readonly displayMonth = signal<Date>(startOfMonth(new Date()));

  /** Header label, e.g. "March 2026". */
  protected readonly monthLabel = computed(() => {
    const d = this.displayMonth();
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  });

  /** Weekday column headers. */
  protected readonly weekdays = WEEKDAY_LABELS;

  /** The 6 × 7 = 42 day cells filling the month grid. */
  protected readonly days = computed<CalendarMonthDay[]>(() => {
    const month = this.displayMonth();
    const ds = this.datasource();
    const palette = this.palette();

    const firstOfMonth = startOfMonth(month);

    // Start grid from Monday of the week containing the 1st
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - isoWeekday(firstOfMonth));

    // Query events for the entire visible range (may include prev/next month days)
    const gridEnd = new Date(gridStart);
    gridEnd.setDate(gridEnd.getDate() + 41); // 42 cells
    const events = ds.getEvents(gridStart, gridEnd);

    const today = new Date();
    const cells: CalendarMonthDay[] = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);

      const dayEvents = events
        .filter((evt) => {
          const evtEnd = evt.end ?? evt.start;
          return (
            evt.start <= endOfDayFast(date) && evtEnd >= startOfDayFast(date)
          );
        })
        .map((evt, idx) => ({
          ...evt,
          color: evt.color ?? palette[idx % palette.length],
        }));

      cells.push({
        date,
        iso: toIsoDate(date),
        day: date.getDate(),
        inMonth:
          date.getMonth() === firstOfMonth.getMonth() &&
          date.getFullYear() === firstOfMonth.getFullYear(),
        isToday: isSameDay(date, today),
        events: dayEvents,
      });
    }

    return cells;
  });

  /** Rows of 7 days each (for the template grid). */
  protected readonly weeks = computed<CalendarWeekRow[]>(() => {
    const d = this.days();
    const rows: CalendarWeekRow[] = [];
    for (let i = 0; i < d.length; i += 7) {
      const days = d.slice(i, i + 7);
      rows.push({
        days,
        weekNumber: isoWeekNumber(days[3].date), // Thursday determines the ISO week
      });
    }
    return rows;
  });

  /**
   * The day whose popover is currently open, or `null` if none.
   * @internal
   */
  protected readonly popoverDay = signal<CalendarMonthDay | null>(null);

  // ── Private fields ──────────────────────────────────────────────────

  private readonly log = inject(LoggerFactory).createLogger(
    "UICalendarMonthView",
  );

  private readonly popoverService = inject(PopoverService);

  private activePopoverRef: PopoverRef<CalendarEvent | undefined> | null = null;

  // ── Public methods ──────────────────────────────────────────────────

  /** Navigate to the previous month. */
  public previousMonth(): void {
    this.displayMonth.update((d) => addMonths(d, -1));
    this.monthChanged.emit(this.displayMonth());
    this.log.debug("Navigated to previous month");
  }

  /** Navigate to the next month. */
  public nextMonth(): void {
    this.displayMonth.update((d) => addMonths(d, 1));
    this.monthChanged.emit(this.displayMonth());
    this.log.debug("Navigated to next month");
  }

  /** Navigate to today's month. */
  public goToToday(): void {
    this.displayMonth.set(startOfMonth(new Date()));
    this.monthChanged.emit(this.displayMonth());
    this.log.debug("Navigated to today");
  }

  /** Navigate to a specific month. */
  public goToMonth(date: Date): void {
    this.displayMonth.set(startOfMonth(date));
    this.monthChanged.emit(this.displayMonth());
  }

  // ── Protected methods (template) ────────────────────────────────────

  /** Handle day cell click — first click selects; second click on already-selected day opens popover. */
  protected onDayClick(day: CalendarMonthDay, event: MouseEvent): void {
    const alreadySelected = isSameDay(day.date, this.selectedDate());

    this.selectedDate.set(day.date);
    this.dateSelected.emit(day.date);

    if (alreadySelected && day.events.length > 0) {
      this.openDayPopover(day, event.currentTarget as Element);
    }
  }

  /** Check if a day is the currently selected date. */
  protected isSelected(day: CalendarMonthDay): boolean {
    return isSameDay(day.date, this.selectedDate());
  }

  /** Return the overflow count for a day. */
  protected overflowCount(day: CalendarMonthDay): number {
    return Math.max(0, day.events.length - this.maxEventsPerDay());
  }

  // ── Private methods ─────────────────────────────────────────────────

  /** Open a day-detail popover anchored to the given element. */
  private openDayPopover(day: CalendarMonthDay, anchor: Element): void {
    // Close any previously open popover
    if (this.activePopoverRef && !this.activePopoverRef.isClosed) {
      this.activePopoverRef.close(undefined);
    }

    this.popoverDay.set(day);

    this.activePopoverRef = this.popoverService.openPopover<
      UICalendarDayPopover,
      CalendarEvent | undefined
    >({
      component: UICalendarDayPopover,
      anchor,
      verticalAxisAlignment: "auto",
      horizontalAxisAlignment: "auto",
      verticalOffset: 4,
      inputs: { day },
      ariaLabel: `Events on ${day.date.toDateString()}`,
    });

    this.activePopoverRef.closed.subscribe((result) => {
      this.activePopoverRef = null;
      this.popoverDay.set(null);
      if (result) {
        this.eventSelected.emit(result);
      }
    });
  }
}

// ── Internal types ────────────────────────────────────────────────

/** @internal Row descriptor for a single week in the grid. */
interface CalendarWeekRow {
  readonly days: CalendarMonthDay[];
  readonly weekNumber: number;
}

// ── Inline date helpers (avoid function-call overhead in loop) ────

/** @internal */
function startOfDayFast(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** @internal */
function endOfDayFast(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
