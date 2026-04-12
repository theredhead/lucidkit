import type {
  ChartRenderOutput,
  ChartSeriesData,
  ChartSize,
} from "../chart.types";
import {
  computeChartArea,
  createSvgRoot,
  drawYAxis,
  svgEl,
  svgText,
} from "../chart.utils";
import { GraphPresentationStrategy } from "./graph-presentation-strategy";

/**
 * Options for the {@link StackedBarGraphStrategy}.
 */
export interface StackedBarGraphOptions {

  /**
   * Fraction of the column width used by the bar (0–1).
   * @default 0.6
   */
  readonly barWidthRatio?: number;

  /**
   * Corner radius for the topmost segment of each stack.
   * @default 3
   */
  readonly borderRadius?: number;

  /**
   * When `true`, each stack is normalised to 100 % so all bars
   * reach the top — useful for comparing proportions.
   * @default false
   */
  readonly normalised?: boolean;
}

/**
 * Renders data as a stacked (cumulative) vertical bar chart.
 *
 * Each X position gets one bar whose segments are stacked vertically,
 * one segment per series. The total bar height is the cumulative sum
 * of all series values at that position. Enable `normalised` to
 * display 100 % stacked bars.
 *
 * Output kind: **svg**.
 *
 * @example
 * ```ts
 * const strategy = new StackedBarGraphStrategy();
 * ```
 */
export class StackedBarGraphStrategy extends GraphPresentationStrategy {
  public readonly name = "Stacked Bar";

  /** Fraction of the column width used by the bar (0–1). */
  private readonly barWidthRatio: number;

  /** Corner radius for the topmost segment. */
  private readonly borderRadius: number;

  /** Whether stacks are normalised to 100 %. */
  private readonly normalised: boolean;

  public constructor(options: StackedBarGraphOptions = {}) {
    super();
    this.barWidthRatio = options.barWidthRatio ?? 0.6;
    this.borderRadius = options.borderRadius ?? 3;
    this.normalised = options.normalised ?? false;
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
    const maxLen = Math.max(...series.map((s) => s.points.length));

    // Compute cumulative totals per X position
    const totals = new Array<number>(maxLen).fill(0);
    for (const s of series) {
      for (let i = 0; i < s.points.length; i++) {
        totals[i] += Math.max(0, s.points[i].value);
      }
    }

    // Y-axis scale
    const scaleMax = this.normalised ? 100 : niceMax(Math.max(...totals, 1));
    const ticks = buildTicks(0, scaleMax);

    const textColor = "var(--ui-chart-text, #555)";
    const gridColor = "var(--ui-chart-grid, #e0e0e0)";

    drawYAxis(svg, ticks, area, scaleMax, 0, textColor, gridColor);

    const columnWidth = area.width / maxLen;
    const barWidth = columnWidth * this.barWidthRatio;

    // Draw segments bottom-up for each X position
    const runningY = new Array<number>(maxLen).fill(0);

    for (let si = 0; si < series.length; si++) {
      const s = series[si];
      for (let i = 0; i < s.points.length; i++) {
        const raw = Math.max(0, s.points[i].value);
        const total = totals[i];

        let segmentHeight: number;
        if (this.normalised) {
          segmentHeight = total > 0 ? (raw / total) * area.height : 0;
        } else {
          segmentHeight = (raw / scaleMax) * area.height;
        }

        const x = area.x + i * columnWidth + (columnWidth - barWidth) / 2;
        const y = area.y + area.height - runningY[i] - segmentHeight;

        // Only round corners on the topmost visible segment
        const isTopSegment =
          si === series.length - 1 || isLastNonZeroSegment(series, i, si);

        svg.appendChild(
          svgEl("rect", {
            x,
            y,
            width: barWidth,
            height: Math.max(segmentHeight, 0),
            rx: isTopSegment ? this.borderRadius : 0,
            ry: isTopSegment ? this.borderRadius : 0,
            fill: s.points[i].color,
            class: "stacked-segment",
          }),
        );

        runningY[i] += segmentHeight;
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

/**
 * Check whether series index `si` at point `i` is the last segment
 * with a nonzero value (so it gets the rounded corners).
 */
function isLastNonZeroSegment(
  series: readonly ChartSeriesData[],
  i: number,
  si: number,
): boolean {
  for (let j = si + 1; j < series.length; j++) {
    if (
      j < series.length &&
      i < series[j].points.length &&
      series[j].points[i].value > 0
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Round a maximum value up to a "nice" number for the Y-axis.
 */
function niceMax(raw: number): number {
  if (raw <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const residual = raw / magnitude;

  let nice: number;
  if (residual <= 1) nice = magnitude;
  else if (residual <= 2) nice = 2 * magnitude;
  else if (residual <= 5) nice = 5 * magnitude;
  else nice = 10 * magnitude;

  return nice;
}

/**
 * Build evenly spaced tick values from 0 to max.
 */
function buildTicks(min: number, max: number, count = 5): number[] {
  const step = (max - min) / count;
  const ticks: number[] = [];
  for (let i = 0; i <= count; i++) {
    ticks.push(Math.round((min + i * step) * 1e10) / 1e10);
  }
  return ticks;
}
