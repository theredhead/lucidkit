import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";

import type { SliderMode, SliderTick, SliderValue } from "./slider.types";

/**
 * A range slider with single-thumb and dual-thumb (range) modes.
 *
 * In **single** mode, `value` is a number.
 * In **range** mode, `value` is a `[low, high]` tuple and two thumbs
 * are rendered.
 *
 * @example
 * ```html
 * <ui-slider [(value)]="volume" [min]="0" [max]="100" />
 * <ui-slider mode="range" [(value)]="priceRange" [min]="0" [max]="1000" [step]="10" />
 * ```
 */
@Component({
  selector: "ui-slider",
  standalone: true,
  templateUrl: "./slider.component.html",
  styleUrl: "./slider.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-slider",
    "[class.ui-slider--single]": "mode() === 'single'",
    "[class.ui-slider--range]": "mode() === 'range'",
    "[class.ui-slider--disabled]": "disabled()",
  },
})
export class UISlider {
  /** Slider mode: single thumb or range (two thumbs). */
  public readonly mode = input<SliderMode>("single");

  /** Current value. Number for single, [low, high] for range. */
  public readonly value = model<SliderValue>(0);

  /** Minimum value. */
  public readonly min = input(0);

  /** Maximum value. */
  public readonly max = input(100);

  /** Step increment. */
  public readonly step = input(1);

  /** Whether the slider is disabled. */
  public readonly disabled = input(false);

  /** Whether to show the current value label(s). */
  public readonly showValue = input(false);

  /** Accessible label. */
  public readonly ariaLabel = input<string>("Slider");

  /**
   * Whether to show tick marks along the track.
   *
   * When `true` and no explicit `ticks` array is provided, tick marks
   * are generated automatically at each `step` interval.
   */
  public readonly showTicks = input(false);

  /**
   * Explicit tick mark definitions.
   *
   * When provided, these override the auto-generated step-based ticks.
   * Each entry may include an optional `label` rendered below the mark.
   * Setting this implicitly enables tick display (even if `showTicks`
   * is `false`).
   */
  public readonly ticks = input<readonly SliderTick[]>([]);

  /** Emitted when the value changes. */
  public readonly valueChange = output<SliderValue>();

  /** @internal — single-mode value. */
  protected readonly singleValue = computed(() => {
    const v = this.value();
    return typeof v === "number" ? v : v[0];
  });

  /** @internal — range low value. */
  protected readonly rangeLow = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v[0] : this.min();
  });

  /** @internal — range high value. */
  protected readonly rangeHigh = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v[1] : this.max();
  });

  /** @internal — track fill percentage for single mode. */
  protected readonly fillPercent = computed(() => {
    const min = this.min();
    const max = this.max();
    const range = max - min;
    if (range === 0) {
      return 0;
    }
    return ((this.singleValue() - min) / range) * 100;
  });

  /** @internal — track fill start for range mode. */
  protected readonly fillStart = computed(() => {
    const min = this.min();
    const max = this.max();
    const range = max - min;
    if (range === 0) {
      return 0;
    }
    return ((this.rangeLow() - min) / range) * 100;
  });

  /** @internal — track fill end for range mode. */
  protected readonly fillEnd = computed(() => {
    const min = this.min();
    const max = this.max();
    const range = max - min;
    if (range === 0) {
      return 100;
    }
    return ((this.rangeHigh() - min) / range) * 100;
  });

  /**
   * @internal — resolved tick marks with percentage positions.
   *
   * If an explicit `ticks` array is provided it takes precedence.
   * Otherwise, if `showTicks` is `true`, ticks are auto-generated
   * at every `step` interval between `min` and `max` (inclusive).
   */
  protected readonly tickMarks = computed<
    readonly { percent: number; label?: string }[]
  >(() => {
    const explicit = this.ticks();
    const min = this.min();
    const max = this.max();
    const range = max - min;
    if (range <= 0) {
      return [];
    }

    // Explicit ticks provided — use them directly
    if (explicit.length > 0) {
      return explicit
        .filter((t) => t.value >= min && t.value <= max)
        .map((t) => ({
          percent: ((t.value - min) / range) * 100,
          label: t.label,
        }));
    }

    // Auto-generate from step if showTicks is on
    if (!this.showTicks()) {
      return [];
    }

    const step = this.step();
    if (step <= 0) {
      return [];
    }

    const marks: { percent: number }[] = [];
    for (let v = min; v <= max; v += step) {
      marks.push({ percent: ((v - min) / range) * 100 });
    }
    // Ensure the max endpoint is always included
    if (marks.length === 0 || marks[marks.length - 1].percent < 100) {
      marks.push({ percent: 100 });
    }
    return marks;
  });

  /** @internal — handle single input change. */
  protected onSingleInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.value.set(val);
    this.valueChange.emit(val);
  }

  /** @internal — handle range low input change. */
  protected onRangeLowInput(event: Event): void {
    const low = Number((event.target as HTMLInputElement).value);
    const high = this.rangeHigh();
    const clamped = Math.min(low, high);
    const tuple: readonly [number, number] = [clamped, high];
    this.value.set(tuple);
    this.valueChange.emit(tuple);
  }

  /** @internal — handle range high input change. */
  protected onRangeHighInput(event: Event): void {
    const high = Number((event.target as HTMLInputElement).value);
    const low = this.rangeLow();
    const clamped = Math.max(high, low);
    const tuple: readonly [number, number] = [low, clamped];
    this.value.set(tuple);
    this.valueChange.emit(tuple);
  }
}
