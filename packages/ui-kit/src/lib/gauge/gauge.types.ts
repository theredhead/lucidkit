/**
 * Level of visual detail rendered by a gauge strategy.
 *
 * - `'high'`   — full detail: all ticks, numeric labels, value readout, unit
 * - `'medium'` — reduced: ticks drawn but numeric labels omitted
 * - `'low'`    — minimal: no ticks, no labels — only the core indicator
 */
export type GaugeDetailLevel = "high" | "medium" | "low";

/**
 * Target dimensions for gauge rendering (CSS pixels).
 */
export interface GaugeSize {
  /** Width in CSS pixels. */
  readonly width: number;
  /** Height in CSS pixels. */
  readonly height: number;
}

/**
 * Discriminated union representing a gauge strategy's render output.
 *
 * Strategies must return one of these variants and are not allowed to
 * render directly to the DOM.
 */
export type GaugeRenderOutput =
  | { readonly kind: "svg"; readonly element: SVGSVGElement }
  | { readonly kind: "imagedata"; readonly data: ImageData };

/**
 * Describes a single zone on the gauge face.
 *
 * Zones are rendered as coloured arcs or regions behind the needle /
 * indicator so the user can see at a glance whether the value is
 * within a safe, warning, or danger range.
 *
 * @example
 * ```ts
 * const zones: GaugeZone[] = [
 *   { from: 0,   to: 60,  color: '#34a853' },
 *   { from: 60,  to: 80,  color: '#fbbc04' },
 *   { from: 80,  to: 100, color: '#ea4335' },
 * ];
 * ```
 */
export interface GaugeZone {
  /** Start of this zone (inclusive), in the same unit as `min` / `max`. */
  readonly from: number;
  /** End of this zone (exclusive), in the same unit as `min` / `max`. */
  readonly to: number;
  /** Fill colour for this zone arc. */
  readonly color: string;
}

/**
 * Configuration snapshot passed to every
 * {@link GaugePresentationStrategy.render} call.
 *
 * All values are pre-clamped and validated by the `UIGauge` component.
 */
export interface GaugeRenderContext {
  /** Current value (clamped between `min` and `max`). */
  readonly value: number;
  /** Scale minimum. */
  readonly min: number;
  /** Scale maximum. */
  readonly max: number;
  /** Unit label displayed beside the value (e.g. `"km/h"`, `"dB"`). */
  readonly unit: string;
  /** Optional coloured zones. */
  readonly zones: readonly GaugeZone[];
  /** Target render size. */
  readonly size: GaugeSize;
  /** CSS custom-property tokens resolved from the host element. */
  readonly tokens: GaugeTokens;
  /** Level of visual detail the strategy should render. */
  readonly detailLevel: GaugeDetailLevel;
  /**
   * Optional consumer-supplied formatter for numeric values.
   *
   * When provided, strategies use this for **all** numeric labels
   * (value readout, tick labels, min/max). When `undefined`,
   * each strategy falls back to its own default formatting.
   */
  readonly formatValue?: (value: number) => string;
}

/**
 * CSS design-token values resolved at render time.
 *
 * Strategies should use these instead of hard-coding colours so that
 * the gauge respects light / dark themes.
 */
export interface GaugeTokens {
  /** Foreground text colour. */
  readonly text: string;
  /** Background / face colour. */
  readonly face: string;
  /** Needle / indicator colour. */
  readonly needle: string;
  /** Tick-mark colour. */
  readonly tick: string;
  /** Brand / accent colour. */
  readonly accent: string;
}
