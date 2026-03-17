import type {
  ChartRenderOutput,
  ChartSeriesData,
  ChartSize,
} from "../chart.types";
import {
  computeChartArea,
  computeYScale,
  createSvgRoot,
  drawYAxis,
  svgEl,
  svgText,
} from "../chart.utils";
import { GraphPresentationStrategy } from "./graph-presentation-strategy";

/**
 * Renders data as a scatter plot — one circle per data point,
 * positioned along evenly-spaced X positions with Y mapped to value.
 *
 * Supports multiple series — each series is rendered as a separate
 * group of markers in its own colour, sharing the same Y-axis scale.
 *
 * Output kind: **svg**.
 *
 * @example
 * ```ts
 * const strategy = new ScatterPlotStrategy({ markerRadius: 6 });
 * const output = strategy.render(seriesData, { width: 500, height: 320 });
 * ```
 */
export class ScatterPlotStrategy extends GraphPresentationStrategy {
  public readonly name = "Scatter";

  /** Radius of each data-point circle. */
  private readonly markerRadius: number;

  /** Opacity of each marker (0–1). */
  private readonly markerOpacity: number;

  public constructor(
    options: { markerRadius?: number; markerOpacity?: number } = {},
  ) {
    super();
    this.markerRadius = options.markerRadius ?? 5;
    this.markerOpacity = options.markerOpacity ?? 0.85;
  }

  public render(
    series: readonly ChartSeriesData[],
    size: ChartSize,
  ): ChartRenderOutput {
    const svg = createSvgRoot(size);
    const allPoints = series.flatMap((s) => s.points);
    if (allPoints.length === 0) {
      return { kind: "svg", element: svg };
    }

    const area = computeChartArea(size);
    const { min, max, ticks } = computeYScale(allPoints);
    const range = max - min || 1;

    const textColor = "var(--ui-chart-text, #555)";
    const gridColor = "var(--ui-chart-grid, #e0e0e0)";

    drawYAxis(svg, ticks, area, max, min, textColor, gridColor);

    // Draw each series
    for (const s of series) {
      const pts = s.points;
      if (pts.length === 0) continue;

      const xStep =
        pts.length > 1 ? area.width / (pts.length - 1) : area.width / 2;

      for (let i = 0; i < pts.length; i++) {
        const x = area.x + (pts.length > 1 ? i * xStep : area.width / 2);
        const y =
          area.y + area.height - ((pts[i].value - min) / range) * area.height;

        svg.appendChild(
          svgEl("circle", {
            cx: x,
            cy: y,
            r: this.markerRadius,
            fill: pts[i].color,
            opacity: this.markerOpacity,
          }),
        );
      }
    }

    // X-axis labels — from the series with the most points
    const longest = series.reduce(
      (a, b) => (b.points.length > a.points.length ? b : a),
      series[0],
    );
    const xStepLabel =
      longest.points.length > 1
        ? area.width / (longest.points.length - 1)
        : area.width / 2;
    for (let i = 0; i < longest.points.length; i++) {
      const x =
        area.x + (longest.points.length > 1 ? i * xStepLabel : area.width / 2);
      svg.appendChild(
        svgText(longest.points[i].label, x, area.y + area.height + 18, {
          fill: textColor,
          "text-anchor": "middle",
          "font-size": 11,
        }),
      );
    }

    return { kind: "svg", element: svg };
  }
}
