import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import type {
  CountdownFormat,
  CountdownMode,
  CountdownParts,
} from "./countdown.types";

export type { CountdownFormat, CountdownMode, CountdownParts };

/**
 * A live countdown or elapsed-time display that ticks every second.
 *
 * In `countdown` mode it counts down to a `target` date/timestamp and emits
 * `expired` when it reaches zero. In `elapsed` mode it counts up from the
 * target date.
 *
 * @example
 * ```html
 * <!-- Countdown to a specific date -->
 * <ui-countdown [target]="launchDate" (expired)="onLaunch()" />
 *
 * <!-- Elapsed time since event -->
 * <ui-countdown [target]="eventDate" mode="elapsed" format="hms" />
 * ```
 */
@Component({
  selector: "ui-countdown",
  standalone: true,
  templateUrl: "./countdown.component.html",
  styleUrl: "./countdown.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-countdown",
    "[class.expired]": "isExpired()",
    "[class.elapsed]": "mode() === 'elapsed'",
    "[attr.aria-label]": "ariaLabel()",
    "[attr.aria-live]": '"off"',
  },
})
export class UICountdown implements OnInit {

  /** Target date or Unix timestamp (ms). */
  public readonly target = input.required<Date | number>();

  /** `"countdown"` (default) counts down to target; `"elapsed"` counts up from target. */
  public readonly mode = input<CountdownMode>("countdown");

  /**
   * Controls which units are displayed.
   * - `"dhms"` — days / hours / minutes / seconds
   * - `"hms"` — hours / minutes / seconds (days overflow into hours)
   * - `"ms"` — minutes / seconds
   */
  public readonly format = input<CountdownFormat>("dhms");

  /** Accessible label for the timer region. */
  public readonly ariaLabel = input<string>("Countdown timer");

  /** Emitted once when the countdown reaches zero (countdown mode only). */
  public readonly expired = output<void>();

  /** @internal */
  protected readonly parts = signal<CountdownParts>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  /** @internal */
  protected readonly isExpired = signal(false);

  /** @internal */
  protected readonly showDays = computed(
    () => this.format() === "dhms" && this.parts().days > 0,
  );

  private readonly destroyRef = inject(DestroyRef);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  public ngOnInit(): void {
    this.tick();
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.destroyRef.onDestroy(() => {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
    });
  }

  private tick(): void {
    const targetMs =
      this.target() instanceof Date
        ? (this.target() as Date).getTime()
        : (this.target() as number);
    const now = Date.now();
    let diffMs: number;

    if (this.mode() === "countdown") {
      diffMs = Math.max(0, targetMs - now);
    } else {
      diffMs = Math.max(0, now - targetMs);
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const remainder = totalSeconds % 86400;
    const hours = Math.floor(remainder / 3600);
    const minutes = Math.floor((remainder % 3600) / 60);
    const seconds = remainder % 60;

    this.parts.set({ days, hours, minutes, seconds, totalSeconds });

    if (
      this.mode() === "countdown" &&
      totalSeconds === 0 &&
      !this.isExpired()
    ) {
      this.isExpired.set(true);
      this.expired.emit();
    }
  }

  /** @internal */
  protected pad(n: number): string {
    return n.toString().padStart(2, "0");
  }
}
