import type {
  ChartRenderOutput,
  ChartSeriesData,
  ChartSize,
} from "../chart.types";

/**
 * Abstract base for chart presentation strategies.
 *
 * A strategy receives an array of {@link ChartSeriesData} (one or more
 * named data series) and a target size, and must return a
 * {@link ChartRenderOutput} — either an `SVGSVGElement` (`kind: 'svg'`)
 * or an `ImageData` (`kind: 'imagedata'`).
 *
 * When the array contains a single series the chart looks identical to a
 * classic single-dataset chart. Multiple series are overlaid on the same
 * axes (e.g. grouped bars, multiple lines, different-coloured scatter
 * groups).
 *
 * Built-in implementations:
 * - {@link LineGraphStrategy} — line chart (SVG)
 * - {@link BarGraphStrategy} — vertical bar chart (SVG)
 * - {@link PieChartStrategy} — pie / donut chart (SVG)
 * - {@link ScatterPlotStrategy} — scatter plot (SVG)
 *
 * @example
 * ```ts
 * const strategy = new BarGraphStrategy();
 * const output = strategy.render(seriesData, { width: 400, height: 300 });
 * // output.kind === 'svg'
 * ```
 */
export abstract class GraphPresentationStrategy {
  /**
   * Human-readable name shown in legends / tooltips when identifying
   * the active strategy.
   */
  public abstract readonly name: string;

  /**
   * Render one or more data series into a chart.
   *
   * @param series  Array of named, colour-assigned data series.
   * @param size    Target dimensions in CSS pixels.
   * @returns       An SVG element or raw `ImageData`.
   */
  public abstract render(
    series: readonly ChartSeriesData[],
    size: ChartSize,
  ): ChartRenderOutput;
}
