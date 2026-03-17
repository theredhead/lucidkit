/**
 * A single data point extracted from the source data, ready for rendering.
 */
export interface ChartDataPoint {
  /** Display label for this data point. */
  readonly label: string;
  /** Numeric value for this data point. */
  readonly value: number;
  /** Color assigned from the palette. */
  readonly color: string;
}

/**
 * Descriptor for a single legend entry.
 */
export interface ChartLegendEntry {
  /** Display label. */
  readonly label: string;
  /** Swatch color. */
  readonly color: string;
  /** Numeric value. */
  readonly value: number;
}

/**
 * Chart dimensions in CSS pixels.
 */
export interface ChartSize {
  /** Width in CSS pixels. */
  readonly width: number;
  /** Height in CSS pixels. */
  readonly height: number;
}

/**
 * Discriminated union representing a strategy's render output.
 *
 * Every {@link GraphPresentationStrategy} must return one of these two
 * variants — strategies are not allowed to render directly to the DOM.
 */
export type ChartRenderOutput =
  | { readonly kind: "svg"; readonly element: SVGSVGElement }
  | { readonly kind: "imagedata"; readonly data: ImageData };

/**
 * Layout area available for the actual chart drawing (excluding padding).
 */
export interface ChartArea {
  /** Left offset. */
  readonly x: number;
  /** Top offset. */
  readonly y: number;
  /** Drawable width. */
  readonly width: number;
  /** Drawable height. */
  readonly height: number;
}

/**
 * A single data layer for multi-series charts.
 *
 * Each layer represents one data series rendered on the same chart.
 * Layers share the component-level `labelProperty` for the X-axis;
 * each layer can optionally override `valueProperty` and provide
 * its own `data` array (falling back to the component-level `data`).
 *
 * @example
 * ```ts
 * // Same data array, different value columns
 * const layers: ChartLayer<SalesRow>[] = [
 *   { name: 'Revenue', valueProperty: 'revenue' },
 *   { name: 'Cost',    valueProperty: 'cost' },
 * ];
 *
 * // Different data arrays (e.g. year-over-year)
 * const layers: ChartLayer<SalesRow>[] = [
 *   { name: '2024', data: sales2024 },
 *   { name: '2025', data: sales2025 },
 * ];
 * ```
 */
export interface ChartLayer<T> {
  /** Display name for this series (shown in the legend). */
  readonly name: string;
  /** Data array for this layer. Falls back to the component-level `data` if omitted. */
  readonly data?: readonly T[];
  /** Override the component-level `valueProperty` for this layer. */
  readonly valueProperty?: keyof T;
}

/**
 * A processed data series ready for strategy rendering.
 *
 * Each entry groups a set of {@link ChartDataPoint}s under a named
 * series with a primary colour. Strategies receive an array of these
 * and render all series on the same chart.
 */
export interface ChartSeriesData {
  /** Display name of this series. */
  readonly name: string;
  /** Primary colour assigned to this series from the palette. */
  readonly color: string;
  /** Extracted data points for this series. */
  readonly points: readonly ChartDataPoint[];
}

/**
 * Default colour palette — 12 distinct hues with good contrast
 * in both light and dark themes.
 */
export const DEFAULT_CHART_PALETTE: readonly string[] = [
  "#4285f4", // blue
  "#ea4335", // red
  "#fbbc04", // yellow
  "#34a853", // green
  "#ff6d01", // orange
  "#46bdc6", // teal
  "#7b1fa2", // purple
  "#c2185b", // pink
  "#0d47a1", // dark blue
  "#2e7d32", // dark green
  "#f57f17", // amber
  "#6d4c41", // brown
];
