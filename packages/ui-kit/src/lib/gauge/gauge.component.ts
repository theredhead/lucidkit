import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { LoggerFactory, UISurface } from "@theredhead/lucid-foundation";

import type {
  GaugeDetailLevel,
  GaugeRenderContext,
  GaugeSize,
  GaugeTokens,
  GaugeZone,
} from "./gauge.types";
import type { GaugePresentationStrategy } from "./strategies/gauge-presentation-strategy";

/**
 * Configurable gauge component that delegates rendering to a
 * {@link GaugePresentationStrategy}.
 *
 * The component clamps the `value` between `min` and `max`, resolves
 * design tokens from the host element's CSS context, and passes
 * everything to the active strategy. The strategy returns either an
 * `SVGSVGElement` or raw `ImageData`, which the component inserts
 * into the DOM.
 *
 * Built-in strategies:
 * - `AnalogGaugeStrategy` — circular speedometer
 * - `VuMeterStrategy` — vertical LED bar
 * - `DigitalGaugeStrategy` — seven-segment numeric readout
 *
 * Custom strategies: extend `GaugePresentationStrategy` and implement
 * `render()` to produce your own SVG or bitmap output.
 *
 * @example
 * ```html
 * <ui-gauge
 *   [value]="speed"
 *   [min]="0"
 *   [max]="220"
 *   unit="km/h"
 *   [strategy]="analogStrategy"
 *   [zones]="speedZones"
 *   [animated]="true"
 * />
 * ```
 */
@Component({
  selector: "ui-gauge",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  templateUrl: "./gauge.component.html",
  styleUrl: "./gauge.component.scss",
  host: {
    class: "ui-gauge",
    "[class.fit]": "fit()",
  },
})
export class UIGauge {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Current gauge value. Clamped to `[min, max]`. */
  public readonly value = input.required<number>();

  /** Scale minimum (default `0`). */
  public readonly min = input<number>(0);

  /** Scale maximum (default `100`). */
  public readonly max = input<number>(100);

  /** Unit label displayed beside the value (e.g. `"km/h"`, `"dB"`). */
  public readonly unit = input<string>("");

  /** Presentation strategy that renders the gauge. */
  public readonly strategy = input.required<GaugePresentationStrategy>();

  /** Width in CSS pixels. */
  public readonly width = input<number>(200);

  /** Height in CSS pixels. */
  public readonly height = input<number>(200);

  /** Coloured zones overlaid on the gauge face. */
  public readonly zones = input<readonly GaugeZone[]>([]);

  /**
   * Whether the gauge fills its parent container.
   *
   * When `true`, the gauge uses a `ResizeObserver` to track the host
   * element's dimensions and re-renders automatically on resize.
   * The `width` and `height` inputs are used as fallbacks only.
   *
   * @example
   * ```html
   * <div style="width: 100%; height: 300px">
   *   <ui-gauge [fit]="true" [value]="speed" [strategy]="strategy" />
   * </div>
   * ```
   */
  public readonly fit = input<boolean>(false);

  /** Accessible label for the gauge. */
  public readonly ariaLabel = input<string>("Gauge");

  /** Level of visual detail strategies should render. */
  public readonly detailLevel = input<GaugeDetailLevel>("high");

  /**
   * Whether value changes are animated.
   * When `true`, the gauge smoothly interpolates between old and new values.
   */
  public readonly animated = input<boolean>(false);

  /**
   * Duration of the value animation in milliseconds.
   * Only applies when `animated` is `true`.
   */
  public readonly animationDuration = input<number>(300);

  /**
   * Optional formatter for numeric values displayed by the strategy.
   *
   * When provided, strategies use this callback for all numeric labels
   * (value readout, tick marks, min/max). This lets consumers control
   * locale, precision, currency symbols, etc.
   *
   * @example
   * ```html
   * <ui-gauge [formatValue]="formatCurrency" />
   * ```
   * ```ts
   * formatCurrency = (n: number) => '$' + n.toFixed(2);
   * ```
   */
  public readonly formatValue = input<((value: number) => string) | undefined>(
    undefined,
  );

  /**
   * Optional reference values rendered as marker lines on the gauge.
   *
   * Strategies draw a thin reference line at each threshold position.
   * Useful for target set-points, limits, or alarm values.
   *
   * @example
   * ```html
   * <ui-gauge [thresholds]="[75, 90]" />
   * ```
   */
  public readonly thresholds = input<readonly number[]>([]);

  // ── Queries ─────────────────────────────────────────────────────────

  private readonly containerRef =
    viewChild.required<ElementRef<HTMLDivElement>>("gaugeContainer");

  // ── Computed ────────────────────────────────────────────────────────

  /** Value clamped between min and max. */
  protected readonly clampedValue = computed(() =>
    Math.min(this.max(), Math.max(this.min(), this.value())),
  );

  /** Target render size — observed dimensions when `fit`, else explicit inputs. */
  protected readonly size = computed<GaugeSize>(() => {
    if (this.fit()) {
      const observed = this.observedSize();
      if (observed) return observed;
    }
    return { width: this.width(), height: this.height() };
  });

  // ── Private fields ──────────────────────────────────────────────────

  private readonly log = inject(LoggerFactory).createLogger("UIGauge");
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** Dimensions detected by the ResizeObserver (fit mode). */
  private readonly observedSize = signal<GaugeSize | null>(null);

  /**
   * The value currently being displayed (may be mid-animation).
   * Plain field — not a signal — to avoid circular effect deps.
   */
  private currentVisualValue: number | undefined;

  /** Handle for the running `requestAnimationFrame` chain. */
  private animationFrameId = 0;

  /** Active ResizeObserver (fit mode). */
  private resizeObserver: ResizeObserver | null = null;

  // ── Constructor ─────────────────────────────────────────────────────

  public constructor() {
    effect(() => {
      const targetValue = this.clampedValue();
      const isAnimated = this.animated();
      const duration = this.animationDuration();

      if (!isAnimated || this.currentVisualValue === undefined) {
        this.cancelAnimation();
        this.currentVisualValue = targetValue;
        this.renderGauge(targetValue);
        return;
      }

      const fromValue = this.currentVisualValue;
      if (fromValue === targetValue) {
        this.renderGauge(targetValue);
        return;
      }

      this.animateTo(fromValue, targetValue, duration);
    });

    // ── ResizeObserver for fit mode ──
    effect(() => {
      const shouldFit = this.fit();

      this.resizeObserver?.disconnect();
      this.resizeObserver = null;

      if (shouldFit && typeof ResizeObserver !== "undefined") {
        const el = this.elRef.nativeElement;
        this.resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (entry) {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
              this.observedSize.set({
                width: Math.round(width),
                height: Math.round(height),
              });
            }
          }
        });
        this.resizeObserver.observe(el);
      } else {
        this.observedSize.set(null);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.cancelAnimation();
      this.resizeObserver?.disconnect();
    });
  }

  // ── Private methods ─────────────────────────────────────────────────

  /** Resolve CSS custom-property tokens from the host element. */
  private resolveTokens(): GaugeTokens {
    const cs = getComputedStyle(this.elRef.nativeElement);
    return {
      text: cs.getPropertyValue("--ui-gauge-text").trim() || "#555",
      face: cs.getPropertyValue("--ui-gauge-face").trim() || "#e8eaed",
      needle: cs.getPropertyValue("--ui-gauge-needle").trim() || "#ea4335",
      tick: cs.getPropertyValue("--ui-gauge-tick").trim() || "#888",
      accent:
        cs.getPropertyValue("--ui-gauge-accent").trim() ||
        cs.getPropertyValue("--ui-brand").trim() ||
        "#4285f4",
    };
  }

  /** Run the strategy and insert the output into the DOM. */
  private renderGauge(displayValue: number): void {
    const strategy = this.strategy();
    const size = this.size();
    const container = this.containerRef().nativeElement;

    container.innerHTML = "";

    const ctx: GaugeRenderContext = {
      value: displayValue,
      min: this.min(),
      max: this.max(),
      unit: this.unit(),
      zones: this.zones(),
      size,
      tokens: this.resolveTokens(),
      detailLevel: this.detailLevel(),
      formatValue: this.formatValue(),
      thresholds: this.thresholds(),
    };

    const output = strategy.render(ctx);

    switch (output.kind) {
      case "svg":
        container.appendChild(output.element);
        break;

      case "imagedata": {
        const canvas = document.createElement("canvas");
        canvas.width = output.data.width;
        canvas.height = output.data.height;
        canvas.style.width = `${size.width}px`;
        canvas.style.height = `${size.height}px`;
        const c2d = canvas.getContext("2d");
        if (c2d) {
          c2d.putImageData(output.data, 0, 0);
        } else {
          this.log.error("Failed to get 2d context for ImageData render");
        }
        container.appendChild(canvas);
        break;
      }
    }
  }

  /** Animate from one value to another over the given duration. */
  private animateTo(from: number, to: number, duration: number): void {
    this.cancelAnimation();

    const startTime = performance.now();

    const step = (now: number): void => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a natural deceleration feel
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;

      this.currentVisualValue = current;
      this.renderGauge(current);

      if (t < 1) {
        this.animationFrameId = requestAnimationFrame(step);
      } else {
        this.animationFrameId = 0;
      }
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  /** Cancel any running animation frame chain. */
  private cancelAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }
}
