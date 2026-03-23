import type { GaugeRenderContext, GaugeRenderOutput } from "../gauge.types";

/**
 * Abstract base for gauge presentation strategies.
 *
 * A strategy receives a {@link GaugeRenderContext} and must return a
 * {@link GaugeRenderOutput} — either an `SVGSVGElement`
 * (`kind: 'svg'`) or raw `ImageData` (`kind: 'imagedata'`).
 *
 * Built-in implementations:
 * - {@link AnalogGaugeStrategy}  — classic circular speedometer
 * - {@link VuMeterStrategy}      — vertical LED-style VU meter
 * - {@link DigitalGaugeStrategy} — numeric seven-segment display
 * - {@link LcdGaugeStrategy}     — segmented LCD panel display
 *
 * @example
 * ```ts
 * class MyCustomStrategy extends GaugePresentationStrategy {
 *   public readonly name = 'Custom';
 *   public render(ctx: GaugeRenderContext): GaugeRenderOutput {
 *     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 *     // … draw your gauge …
 *     return { kind: 'svg', element: svg };
 *   }
 * }
 * ```
 */
export abstract class GaugePresentationStrategy {
  /**
   * Human-readable name for this strategy (e.g. `"Analog"`, `"VU Meter"`).
   */
  public abstract readonly name: string;

  /**
   * Render the gauge into an SVG element or raw `ImageData`.
   *
   * @param ctx  Pre-validated render context.
   * @returns    An SVG element or raw `ImageData`.
   */
  public abstract render(ctx: GaugeRenderContext): GaugeRenderOutput;
}
