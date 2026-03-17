import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { LoggerFactory } from "@theredhead/foundation";

/**
 * Represents the three hand positions of a clock.
 *
 * @internal
 */
interface ClockTime {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

/**
 * Standalone analog clock component rendered entirely in SVG.
 *
 * Displays a classic clock face with hour, minute, and (optionally) second
 * hands. When no `time` input is provided the clock ticks in real time
 * using a one-second interval driven by plain `setInterval` (zoneless-safe).
 *
 * @example Live clock
 * ```html
 * <ui-analog-clock />
 * ```
 *
 * @example Fixed time, no seconds hand
 * ```html
 * <ui-analog-clock [time]="fixedDate" [showSeconds]="false" />
 * ```
 *
 * @example Custom size with hidden numbers
 * ```html
 * <ui-analog-clock [size]="120" [showNumbers]="false" />
 * ```
 */
@Component({
  selector: "ui-analog-clock",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./analog-clock.component.html",
  styleUrl: "./analog-clock.component.scss",
  host: {
    class: "ui-analog-clock",
    "[style.width.px]": "size()",
    "[style.height.px]": "size()",
  },
})
export class UIAnalogClock implements OnInit {
  // ── Inputs ──────────────────────────────────────────────────────────

  /**
   * Fixed time to display. When omitted the clock auto-ticks every second.
   * Passing `null` or `undefined` also triggers live mode.
   */
  public readonly time = input<Date | null>(null);

  /** Diameter of the clock in CSS pixels. */
  public readonly size = input<number>(200);

  /** Whether to render the second hand. */
  public readonly showSeconds = input<boolean>(true);

  /** Whether to render hour numbers (1–12) on the face. */
  public readonly showNumbers = input<boolean>(true);

  /** Whether to render minute tick marks around the rim. */
  public readonly showTickMarks = input<boolean>(true);

  /** Accessible label for the clock region. */
  public readonly ariaLabel = input<string>("Analog clock");

  // ── Computed ─────────────────────────────────────────────────────────

  /** Whether the clock is ticking on its own (no fixed `time` provided). */
  protected readonly isLive = computed(() => this.time() === null);

  /**
   * Current clock-hand positions resolved from the `time` input or the
   * internal live signal.
   */
  protected readonly clockTime = computed<ClockTime>(() => {
    const t = this.time() ?? this.liveDate();
    return {
      hours: t.getHours(),
      minutes: t.getMinutes(),
      seconds: t.getSeconds(),
    };
  });

  /** Second-hand rotation in degrees (0–360). */
  protected readonly secondAngle = computed(() => this.clockTime().seconds * 6);

  /** Minute-hand rotation in degrees (0–360). */
  protected readonly minuteAngle = computed(
    () => this.clockTime().minutes * 6 + this.clockTime().seconds * 0.1,
  );

  /** Hour-hand rotation in degrees (0–360). */
  protected readonly hourAngle = computed(
    () => (this.clockTime().hours % 12) * 30 + this.clockTime().minutes * 0.5,
  );

  /** Array of hour-number descriptors for the template. */
  protected readonly hourNumbers = computed(() =>
    Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      const angle = (hour * 30 * Math.PI) / 180;
      const radius = 40;
      return {
        hour,
        x: 50 + radius * Math.sin(angle),
        y: 50 - radius * Math.cos(angle),
      };
    }),
  );

  /** Array of tick-mark descriptors for the template. */
  protected readonly tickMarks = computed(() =>
    Array.from({ length: 60 }, (_, i) => {
      const angle = (i * 6 * Math.PI) / 180;
      const isHour = i % 5 === 0;
      const outerR = 48;
      const innerR = isHour ? 43 : 45;
      return {
        x1: 50 + outerR * Math.sin(angle),
        y1: 50 - outerR * Math.cos(angle),
        x2: 50 + innerR * Math.sin(angle),
        y2: 50 - innerR * Math.cos(angle),
        isHour,
      };
    }),
  );

  // ── Private fields ──────────────────────────────────────────────────

  private readonly liveDate = signal<Date>(new Date());
  private readonly destroyRef = inject(DestroyRef);
  private readonly log = inject(LoggerFactory).createLogger("UIAnalogClock");
  private intervalId: ReturnType<typeof setInterval> | null = null;

  // ── Lifecycle ───────────────────────────────────────────────────────

  public ngOnInit(): void {
    this.startTicking();

    this.destroyRef.onDestroy(() => {
      this.stopTicking();
    });
  }

  // ── Private methods ─────────────────────────────────────────────────

  /** Start the one-second interval for live mode. */
  private startTicking(): void {
    if (this.intervalId !== null) {
      return;
    }
    this.intervalId = setInterval(() => {
      this.liveDate.set(new Date());
    }, 1000);
    this.log.log("Live ticking started");
  }

  /** Stop the interval timer. */
  private stopTicking(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.log.log("Live ticking stopped");
    }
  }
}
