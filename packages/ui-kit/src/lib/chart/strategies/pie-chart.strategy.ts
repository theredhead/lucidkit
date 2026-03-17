import type {
  ChartRenderOutput,
  ChartSeriesData,
  ChartSize,
} from "../chart.types";
import { createSvgRoot, svgEl } from "../chart.utils";
import { GraphPresentationStrategy } from "./graph-presentation-strategy";

/**
 * Renders data as a pie chart with optional donut hole.
 *
 * Pie charts represent parts of a whole and therefore only render the
 * **first series**. If multiple series are provided, all but the first
 * are silently ignored.
 *
 * Output kind: **svg**.
 */
export class PieChartStrategy extends GraphPresentationStrategy {
  public readonly name = "Pie";

  /** Inner radius ratio (0 = full pie, 0.5 = donut). */
  private readonly innerRadiusRatio: number;

  public constructor(options: { innerRadiusRatio?: number } = {}) {
    super();
    this.innerRadiusRatio = options.innerRadiusRatio ?? 0;
  }

  public render(
    series: readonly ChartSeriesData[],
    size: ChartSize,
  ): ChartRenderOutput {
    const svg = createSvgRoot(size);
    const points = series[0]?.points ?? [];
    if (points.length === 0) {
      return { kind: "svg", element: svg };
    }

    const cx = size.width / 2;
    const cy = size.height / 2;
    const outerRadius = Math.min(cx, cy) - 10;
    const innerRadius = outerRadius * this.innerRadiusRatio;

    const total = points.reduce((sum, p) => sum + Math.abs(p.value), 0);
    if (total === 0) {
      return { kind: "svg", element: svg };
    }

    let startAngle = -Math.PI / 2; // 12 o'clock

    for (const point of points) {
      const sliceAngle = (Math.abs(point.value) / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
      const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
      const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
      const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);

      let d: string;
      if (innerRadius > 0) {
        d = [
          `M ${outerStart.x} ${outerStart.y}`,
          `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
          `L ${innerEnd.x} ${innerEnd.y}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
          "Z",
        ].join(" ");
      } else {
        d = [
          `M ${cx} ${cy}`,
          `L ${outerStart.x} ${outerStart.y}`,
          `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
          "Z",
        ].join(" ");
      }

      svg.appendChild(
        svgEl("path", {
          d,
          fill: point.color,
          stroke: "var(--ui-chart-bg, #fff)",
          "stroke-width": 2,
        }),
      );

      startAngle = endAngle;
    }

    return { kind: "svg", element: svg };
  }
}

/** Convert polar (angle in radians) to Cartesian (x, y). */
function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}
