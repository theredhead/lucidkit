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

import type { Meridiem, TimeMode, TimeValue } from "./time-picker.types";
import {
  clamp,
  compareTime,
  formatTime,
  getMeridiem,
  parseTime,
  to12Hour,
  wrap,
} from "./time-picker.utils";

/**
 * Time picker with separate hour, minute, and optional AM/PM segments.
 *
 * Supports both 12-hour and 24-hour modes. The value is stored as
 * `"HH:mm"` (24-hour string) for easy form integration. Arrow keys
 * increment/decrement the focused segment.
 *
 * @example
 * ```html
 * <ui-time-picker [(value)]="meetingTime" [mode]="24" />
 * ```
 */
@Component({
  selector: "ui-time-picker",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./time-picker.component.html",
  styleUrl: "./time-picker.component.scss",
  host: {
    class: "ui-time-picker",
  },
})
export class UITimePicker {
  // ── Inputs ─────────────────────────────────────────────────

  /**
   * Clock mode: `24` for 24-hour (default) or `12` for 12-hour with AM/PM.
   */
  readonly mode = input<TimeMode>(24);

  /** Whether the control is disabled. */
  readonly disabled = input<boolean>(false);

  /** Whether the control is read-only. */
  readonly readonly = input<boolean>(false);

  /** Minimum selectable time as `"HH:mm"`. */
  readonly min = input<string | null>(null);

  /** Maximum selectable time as `"HH:mm"`. */
  readonly max = input<string | null>(null);

  /** Minute step for increment/decrement (default 1). */
  readonly minuteStep = input<number>(1);

  /** Accessible label forwarded to the container. */
  readonly ariaLabel = input<string>("Time");

  // ── Model (two-way) ────────────────────────────────────────

  /**
   * Currently selected time as `"HH:mm"` (24-hour format).
   * Two-way bindable via `[(value)]`.
   */
  readonly value = model<string | null>(null);

  // ── Outputs ────────────────────────────────────────────────

  /** Emitted when the user changes the time. */
  readonly timeChange = output<string | null>();

  // ── Computed ───────────────────────────────────────────────

  /** Parsed internal representation of the current value. */
  protected readonly parsedValue = computed<TimeValue | null>(() => {
    const v = this.value();
    return v ? parseTime(v) : null;
  });

  /** Display hour as string. */
  protected readonly displayHour = computed<string>(() => {
    const tv = this.parsedValue();
    if (!tv) return "";
    if (this.mode() === 12) {
      return String(to12Hour(tv.hours));
    }
    return String(tv.hours).padStart(2, "0");
  });

  /** Display minute as string. */
  protected readonly displayMinute = computed<string>(() => {
    const tv = this.parsedValue();
    if (!tv) return "";
    return String(tv.minutes).padStart(2, "0");
  });

  /** Current meridiem for 12-hour mode. */
  protected readonly meridiem = computed<Meridiem>(() => {
    const tv = this.parsedValue();
    return tv ? getMeridiem(tv.hours) : "AM";
  });

  /** Whether to show AM/PM segment. */
  protected readonly show12Hr = computed(() => this.mode() === 12);

  /** Display text for the full time (used in aria-valuenow). */
  protected readonly displayText = computed(() =>
    formatTime(this.parsedValue(), this.mode()),
  );

  // ── Internal state ─────────────────────────────────────────

  /** Raw text typed into the hour field. */
  protected readonly hourText = signal("");

  /** Raw text typed into the minute field. */
  protected readonly minuteText = signal("");

  private readonly elRef = inject(ElementRef<HTMLElement>);

  // ── Effects ────────────────────────────────────────────────

  /** Sync display texts when value changes programmatically. */
  private readonly syncDisplay = effect(() => {
    this.hourText.set(this.displayHour());
    this.minuteText.set(this.displayMinute());
  });

  // ── Hour handlers ──────────────────────────────────────────

  /** @internal */
  protected onHourInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value.replace(/\D/g, "");
    this.hourText.set(text);
    this.tryCommit();
  }

  /** @internal */
  protected onHourBlur(): void {
    this.normalizeAndCommit();
  }

  /** @internal */
  protected onHourKeydown(event: KeyboardEvent): void {
    if (this.disabled() || this.readonly()) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.stepHour(1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.stepHour(-1);
    } else if (event.key === "Tab" && !event.shiftKey) {
      // Default Tab behaviour to move to minute field
    }
  }

  // ── Minute handlers ────────────────────────────────────────

  /** @internal */
  protected onMinuteInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value.replace(/\D/g, "");
    this.minuteText.set(text);
    this.tryCommit();
  }

  /** @internal */
  protected onMinuteBlur(): void {
    this.normalizeAndCommit();
  }

  /** @internal */
  protected onMinuteKeydown(event: KeyboardEvent): void {
    if (this.disabled() || this.readonly()) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.stepMinute(1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.stepMinute(-1);
    }
  }

  // ── Meridiem handlers ──────────────────────────────────────

  /** @internal */
  protected toggleMeridiem(): void {
    if (this.disabled() || this.readonly()) return;

    const tv = this.parsedValue();
    if (!tv) {
      // If no value, set to 12:00 PM
      this.commitValue({ hours: 12, minutes: 0 });
      return;
    }

    const newHours = tv.hours >= 12 ? tv.hours - 12 : tv.hours + 12;
    this.commitValue({ hours: newHours, minutes: tv.minutes });
  }

  /** @internal */
  protected onMeridiemKeydown(event: KeyboardEvent): void {
    if (this.disabled() || this.readonly()) return;

    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === " "
    ) {
      event.preventDefault();
      this.toggleMeridiem();
    }
  }

  // ── Increment / decrement ──────────────────────────────────

  /** @internal */
  protected stepHour(delta: number): void {
    const tv = this.parsedValue() ?? { hours: 0, minutes: 0 };
    const maxH = this.mode() === 24 ? 23 : 23;
    const newHours = wrap(tv.hours + delta, 0, maxH);
    this.commitValue({ hours: newHours, minutes: tv.minutes });
  }

  /** @internal */
  protected stepMinute(delta: number): void {
    const tv = this.parsedValue() ?? { hours: 0, minutes: 0 };
    const step = this.minuteStep();
    const newMinutes = wrap(tv.minutes + delta * step, 0, 59);
    this.commitValue({ hours: tv.hours, minutes: newMinutes });
  }

  // ── Value management ───────────────────────────────────────

  private tryCommit(): void {
    const h = parseInt(this.hourText(), 10);
    const m = parseInt(this.minuteText(), 10);

    if (isNaN(h) || isNaN(m)) return;

    let hours = this.mode() === 24 ? clamp(h, 0, 23) : h;

    // Convert 12-hour input to 24-hour
    if (this.mode() === 12) {
      if (hours < 1 || hours > 12) return;
      const mer = this.meridiem();
      if (mer === "AM" && hours === 12) hours = 0;
      else if (mer === "PM" && hours !== 12) hours += 12;
    }

    const minutes = clamp(m, 0, 59);
    const tv: TimeValue = { hours, minutes };

    if (this.isTimeDisabled(tv)) return;

    this.emitValue(tv);
  }

  private normalizeAndCommit(): void {
    const tv = this.parsedValue();
    if (tv) {
      // Re-sync display to normalised format
      this.hourText.set(this.displayHour());
      this.minuteText.set(this.displayMinute());
    } else if (this.hourText() === "" && this.minuteText() === "") {
      this.value.set(null);
      this.timeChange.emit(null);
    }
  }

  private commitValue(tv: TimeValue): void {
    if (this.isTimeDisabled(tv)) return;
    this.emitValue(tv);
  }

  private emitValue(tv: TimeValue): void {
    const str = `${String(tv.hours).padStart(2, "0")}:${String(tv.minutes).padStart(2, "0")}`;
    this.value.set(str);
    this.timeChange.emit(str);
  }

  private isTimeDisabled(tv: TimeValue): boolean {
    const minStr = this.min();
    const maxStr = this.max();

    if (minStr) {
      const minTv = parseTime(minStr);
      if (minTv && compareTime(tv, minTv) < 0) return true;
    }

    if (maxStr) {
      const maxTv = parseTime(maxStr);
      if (maxTv && compareTime(tv, maxTv) > 0) return true;
    }

    return false;
  }
}
