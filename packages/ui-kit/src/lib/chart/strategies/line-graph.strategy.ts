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
 * Renders data as a connected line chart with circular data-point markers.
 *
 * Supports multiple series — each series is drawn as a separate line
 * in its own colour, sharing the same Y-axis scale.
 *
 * Output kind: **svg**.
 */
export class LineGraphStrategy extends GraphPresentationStrategy {
  public readonly name = "Line";

  /** Stroke width of the line path. */
  private readonly strokeWidth: number;

  /** Radius of each data-point circle marker. */
  private readonly markerRadius: number;

  public constructor(
    options: { strokeWidth?: number; markerRadius?: number } = {},
  ) {
    super();
    this.strokeWidth = options.strokeWidth ?? 2;
    this.markerRadius = options.markerRadius ?? 4;
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

    // Draw each series as a separate line
    for (const s of series) {
      const pts = s.points;
      if (pts.length === 0) continue;

      const xStep =
        pts.length > 1 ? area.width / (pts.length - 1) : area.width / 2;

      const pathParts: string[] = [];
      const coords: { x: number; y: number }[] = [];

      for (let i = 0; i < pts.length; i++) {
        const x = area.x + (pts.length > 1 ? i * xStep : area.width / 2);
        const y =
          area.y + area.height - ((pts[i].value - min) / range) * area.height;
        coords.push({ x, y });
        pathParts.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
      }

      // Line path — uses the series colour
      svg.appendChild(
        svgEl("path", {
          d: pathParts.join(" "),
          fill: "none",
          stroke: s.color,
          "stroke-width": this.strokeWidth,
          "stroke-linejoin": "round",
          "stroke-linecap": "round",
        }),
      );

      // Markers — use per-point colour (same as series colour in multi-series)
      for (let i = 0; i < coords.length; i++) {
        svg.appendChild(
          svgEl("circle", {
            cx: coords[i].x,
            cy: coords[i].y,
            r: this.markerRadius,
            fill: pts[i].color,
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
