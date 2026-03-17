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
 * Renders data as a vertical bar chart.
 *
 * Supports multiple series — bars are grouped side-by-side at each
 * X position, each series in its own colour.
 *
 * Output kind: **svg**.
 */
export class BarGraphStrategy extends GraphPresentationStrategy {
  public readonly name = "Bar";

  /** Fraction of the column width used by the bar group (0–1). */
  private readonly barWidthRatio: number;

  /** Corner radius for the top of each bar. */
  private readonly borderRadius: number;

  public constructor(
    options: { barWidthRatio?: number; borderRadius?: number } = {},
  ) {
    super();
    this.barWidthRatio = options.barWidthRatio ?? 0.6;
    this.borderRadius = options.borderRadius ?? 3;
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

    // Baseline Y (value = 0)
    const zeroRatio = (0 - min) / range;
    const baselineY = area.y + area.height - zeroRatio * area.height;

    const maxLen = Math.max(...series.map((s) => s.points.length));
    const columnWidth = area.width / maxLen;
    const barGroupWidth = columnWidth * this.barWidthRatio;
    const seriesCount = series.length;
    const singleBarWidth = barGroupWidth / seriesCount;

    for (let si = 0; si < series.length; si++) {
      const s = series[si];
      for (let i = 0; i < s.points.length; i++) {
        const p = s.points[i];
        const ratio = (p.value - min) / range;
        const barHeight = ratio * area.height - zeroRatio * area.height;
        const groupX =
          area.x + i * columnWidth + (columnWidth - barGroupWidth) / 2;
        const x = groupX + si * singleBarWidth;
        const y = baselineY - barHeight;

        svg.appendChild(
          svgEl("rect", {
            x,
            y: Math.min(y, baselineY),
            width: singleBarWidth,
            height: Math.abs(barHeight),
            rx: this.borderRadius,
            ry: this.borderRadius,
            fill: p.color,
          }),
        );
      }
    }

    // X-axis labels — from the series with the most points
    const longest = series.reduce(
      (a, b) => (b.points.length > a.points.length ? b : a),
      series[0],
    );
    for (let i = 0; i < longest.points.length; i++) {
      svg.appendChild(
        svgText(
          longest.points[i].label,
          area.x + i * columnWidth + columnWidth / 2,
          area.y + area.height + 18,
          {
            fill: textColor,
            "text-anchor": "middle",
            "font-size": 11,
          },
        ),
      );
    }

    return { kind: "svg", element: svg };
  }
}
