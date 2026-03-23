import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from "@angular/core";
import { LoggerFactory } from "@theredhead/foundation";

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
 * />
 * ```
 */
@Component({
  selector: "ui-gauge",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./gauge.component.html",
  styleUrl: "./gauge.component.scss",
  host: {
    class: "ui-gauge",
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

  /** Accessible label for the gauge. */
  public readonly ariaLabel = input<string>("Gauge");

  /** Level of visual detail strategies should render. */
  public readonly detailLevel = input<GaugeDetailLevel>("high");

  // ── Queries ─────────────────────────────────────────────────────────

  private readonly containerRef =
    viewChild.required<ElementRef<HTMLDivElement>>("gaugeContainer");

  // ── Computed ────────────────────────────────────────────────────────

  /** Value clamped between min and max. */
  protected readonly clampedValue = computed(() =>
    Math.min(this.max(), Math.max(this.min(), this.value())),
  );

  /** Target render size. */
  protected readonly size = computed<GaugeSize>(() => ({
    width: this.width(),
    height: this.height(),
  }));

  // ── Private fields ──────────────────────────────────────────────────

  private readonly log = inject(LoggerFactory).createLogger("UIGauge");
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  // ── Constructor ─────────────────────────────────────────────────────

  public constructor() {
    effect(() => {
      this.renderGauge();
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

  /** Run the strategy and insert the output. */
  private renderGauge(): void {
    const strategy = this.strategy();
    const size = this.size();
    const container = this.containerRef().nativeElement;

    container.innerHTML = "";

    const ctx: GaugeRenderContext = {
      value: this.clampedValue(),
      min: this.min(),
      max: this.max(),
      unit: this.unit(),
      zones: this.zones(),
      size,
      tokens: this.resolveTokens(),
      detailLevel: this.detailLevel(),
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
}
