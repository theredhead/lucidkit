import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";

import { UIDatePicker } from "../date-picker/date-picker.component";
import type { DateFormat } from "../date-picker/date-picker.types";
import { UITimePicker } from "../time-picker/time-picker.component";
import type { TimeMode } from "../time-picker/time-picker.types";
import { parseTime } from "../time-picker/time-picker.utils";

/**
 * Combined date-time picker that composes `UIDatePicker` and `UITimePicker`.
 *
 * The value is a single `Date` object carrying both date and time.
 * All inputs and outputs from both sub-components are forwarded so
 * callers have full control.
 *
 * @example
 * ```html
 * <ui-date-time-picker
 *   [(value)]="appointment"
 *   format="dd/MM/yyyy"
 *   [timeMode]="12"
 * />
 * ```
 */
@Component({
  selector: "ui-date-time-picker",
  standalone: true,
  imports: [UIDatePicker, UITimePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./date-time-picker.component.html",
  styleUrl: "./date-time-picker.component.scss",
  host: {
    class: "ui-date-time-picker",
  },
})
export class UIDateTimePicker {
  // ── Date-picker inputs ─────────────────────────────────────

  /**
   * Date format used for display and parsing.
   * Defaults to `'yyyy-MM-dd'` (ISO 8601).
   */
  readonly format = input<DateFormat>("yyyy-MM-dd");

  /** Placeholder text for the date input. Defaults to the format string. */
  readonly datePlaceholder = input<string | undefined>(undefined);

  /** Minimum selectable date. */
  readonly minDate = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly maxDate = input<Date | null>(null);

  /**
   * First day of the week.
   * `0` = Sunday, `1` = Monday (default), …, `6` = Saturday.
   */
  readonly firstDayOfWeek = input<number>(1);

  /** Accessible label for the date portion. */
  readonly dateAriaLabel = input<string>("Date");

  // ── Time-picker inputs ─────────────────────────────────────

  /**
   * Clock mode: `24` for 24-hour (default) or `12` for 12-hour with AM/PM.
   */
  readonly timeMode = input<TimeMode>(24);

  /** Minimum selectable time as `"HH:mm"`. */
  readonly minTime = input<string | null>(null);

  /** Maximum selectable time as `"HH:mm"`. */
  readonly maxTime = input<string | null>(null);

  /** Minute step for increment/decrement (default 1). */
  readonly minuteStep = input<number>(1);

  /** Accessible label for the time portion. */
  readonly timeAriaLabel = input<string>("Time");

  // ── Shared inputs ──────────────────────────────────────────

  /** Whether both controls are disabled. */
  readonly disabled = input<boolean>(false);

  /** Whether both controls are read-only. */
  readonly readonly = input<boolean>(false);

  /** Accessible label for the entire group. */
  readonly ariaLabel = input<string>("Date and time");

  // ── Model (two-way) ────────────────────────────────────────

  /**
   * Currently selected date-time as a single `Date`.
   * Two-way bindable via `[(value)]`.
   */
  readonly value = model<Date | null>(null);

  // ── Outputs ────────────────────────────────────────────────

  /** Emitted whenever the combined date-time changes. */
  readonly valueChange = output<Date | null>();

  /** Emitted when the date portion changes. */
  readonly dateChange = output<Date | null>();

  /** Emitted when the time portion changes. */
  readonly timeChange = output<string | null>();

  // ── Queries ────────────────────────────────────────────────

  /** @internal */
  protected readonly datePickerRef = viewChild<UIDatePicker>("datePicker");

  /** @internal */
  protected readonly timePickerRef = viewChild<UITimePicker>("timePicker");

  // ── Internal state ─────────────────────────────────────────

  /** Internal date signal fed to the date sub-component. */
  protected readonly internalDate = signal<Date | null>(null);

  /** Internal time string fed to the time sub-component. */
  protected readonly internalTime = signal<string | null>(null);

  /** The placeholder for the date picker (forwarded). */
  protected readonly effectiveDatePlaceholder = computed(() =>
    this.datePlaceholder(),
  );

  // ── Effects ────────────────────────────────────────────────

  /**
   * Sync sub-component signals when the combined `value` changes
   * externally (programmatic set or two-way binding upstream).
   */
  private readonly syncFromValue = effect(() => {
    const v = this.value();
    if (v) {
      this.internalDate.set(v);
      const hh = String(v.getHours()).padStart(2, "0");
      const mm = String(v.getMinutes()).padStart(2, "0");
      this.internalTime.set(`${hh}:${mm}`);
    } else {
      this.internalDate.set(null);
      this.internalTime.set(null);
    }
  });

  // ── Sub-component event handlers ───────────────────────────

  /** @internal — called when the date picker emits a new date. */
  protected onDateChanged(date: Date | null): void {
    this.internalDate.set(date);
    this.dateChange.emit(date);
    this.rebuildValue();
  }

  /** @internal — called when the time picker emits a new time. */
  protected onTimeChanged(time: string | null): void {
    this.internalTime.set(time);
    this.timeChange.emit(time);
    this.rebuildValue();
  }

  // ── Helpers ────────────────────────────────────────────────

  /**
   * Merge `internalDate` and `internalTime` into a single `Date`
   * and push it to the model + output.
   */
  private rebuildValue(): void {
    const d = this.internalDate();
    if (!d) {
      this.value.set(null);
      this.valueChange.emit(null);
      return;
    }

    const combined = new Date(d);
    const t = this.internalTime();
    if (t) {
      const parsed = parseTime(t);
      if (parsed) {
        combined.setHours(parsed.hours, parsed.minutes, 0, 0);
      }
    } else {
      combined.setHours(0, 0, 0, 0);
    }

    this.value.set(combined);
    this.valueChange.emit(combined);
  }
}
