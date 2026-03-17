import type {
  ChartArea,
  ChartDataPoint,
  ChartLayer,
  ChartLegendEntry,
  ChartSeriesData,
  ChartSize,
} from "./chart.types";
import { DEFAULT_CHART_PALETTE } from "./chart.types";

// ── Data extraction ───────────────────────────────────────────────────

/**
 * Extract typed data into render-ready {@link ChartDataPoint} array,
 * assigning palette colours.
 */
export function extractDataPoints<T>(
  data: readonly T[],
  labelProperty: keyof T,
  valueProperty: keyof T,
  palette: readonly string[] = DEFAULT_CHART_PALETTE,
): ChartDataPoint[] {
  return data.map((item, index) => ({
    label: String(item[labelProperty]),
    value: Number(item[valueProperty]),
    color: palette[index % palette.length],
  }));
}

/**
 * Build legend entries from the extracted data points.
 */
export function buildLegendEntries(
  points: readonly ChartDataPoint[],
): ChartLegendEntry[] {
  return points.map((p) => ({
    label: p.label,
    color: p.color,
    value: p.value,
  }));
}

/**
 * Build {@link ChartSeriesData} array from {@link ChartLayer} descriptors.
 *
 * Each layer is resolved against the component-level `defaultData` and
 * `defaultValueProperty`, then colour-assigned from the palette. In
 * multi-series mode every point within a series receives the same
 * colour (the series colour).
 */
export function extractSeriesData<T>(
  layers: readonly ChartLayer<T>[],
  defaultData: readonly T[],
  labelProperty: keyof T,
  defaultValueProperty: keyof T,
  palette: readonly string[] = DEFAULT_CHART_PALETTE,
): ChartSeriesData[] {
  return layers.map((layer, i) => {
    const layerData = layer.data ?? defaultData;
    const valueProp = layer.valueProperty ?? defaultValueProperty;
    const seriesColor = palette[i % palette.length];
    // All points within a multi-series layer share the series colour.
    const points = extractDataPoints(layerData, labelProperty, valueProp, [
      seriesColor,
    ]);
    return { name: layer.name, color: seriesColor, points };
  });
}

/**
 * Build legend entries for multi-series charts — one entry per series
 * showing the series name, colour, and summed value.
 */
export function buildSeriesLegendEntries(
  series: readonly ChartSeriesData[],
): ChartLegendEntry[] {
  return series.map((s) => ({
    label: s.name,
    color: s.color,
    value: s.points.reduce((sum, p) => sum + p.value, 0),
  }));
}

// ── Scale computation ─────────────────────────────────────────────────

/**
 * Compute a nice Y-axis scale range and step count.
 *
 * Returns `{ min, max, step, ticks }` where `ticks` is an array of
 * evenly-spaced values from `min` to `max`.
 */
export function computeYScale(
  points: readonly ChartDataPoint[],
  tickTarget = 5,
): { min: number; max: number; step: number; ticks: number[] } {
  if (points.length === 0) {
    return { min: 0, max: 1, step: 1, ticks: [0, 1] };
  }

  const rawMin = Math.min(...points.map((p) => p.value));
  const rawMax = Math.max(...points.map((p) => p.value));

  // All values identical (including all-zero) — return a fixed range.
  if (rawMin === rawMax) {
    const v = rawMin;
    const lo = Math.min(0, v);
    const hi = v === 0 ? 1 : v * 1.2;
    return { min: lo, max: hi, step: hi - lo, ticks: [lo, hi] };
  }

  const min = Math.min(0, rawMin);
  const range = (rawMax === min ? 1 : rawMax - min) * 1.1; // 10% headroom
  const roughStep = range / tickTarget;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const residual = roughStep / magnitude;

  let niceStep: number;
  if (residual <= 1.5) {
    niceStep = magnitude;
  } else if (residual <= 3) {
    niceStep = 2 * magnitude;
  } else if (residual <= 7) {
    niceStep = 5 * magnitude;
  } else {
    niceStep = 10 * magnitude;
  }

  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(rawMax / niceStep) * niceStep;

  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + niceStep * 0.001; v += niceStep) {
    ticks.push(Math.round(v * 1e10) / 1e10); // avoid float noise
  }

  return { min: niceMin, max: niceMax, step: niceStep, ticks };
}

/**
 * Compute the drawing area within a given chart size, subtracting padding.
 */
export function computeChartArea(
  size: ChartSize,
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = { top: 20, right: 20, bottom: 40, left: 50 },
): ChartArea {
  return {
    x: padding.left,
    y: padding.top,
    width: Math.max(0, size.width - padding.left - padding.right),
    height: Math.max(0, size.height - padding.top - padding.bottom),
  };
}

// ── SVG element helpers ───────────────────────────────────────────────

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Create an SVG element within the SVG namespace.
 */
export function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag) as SVGElementTagNameMap[K];
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

/**
 * Create the root `<svg>` element with a viewBox matching the given size.
 */
export function createSvgRoot(size: ChartSize): SVGSVGElement {
  return svgEl("svg", {
    xmlns: SVG_NS,
    width: size.width,
    height: size.height,
    viewBox: `0 0 ${size.width} ${size.height}`,
  });
}

/**
 * Create a text element positioned at (x, y).
 */
export function svgText(
  text: string,
  x: number,
  y: number,
  attrs: Record<string, string | number> = {},
): SVGTextElement {
  const el = svgEl("text", { x, y, ...attrs });
  el.textContent = text;
  return el;
}

/**
 * Draw horizontal grid lines and Y-axis labels.
 */
export function drawYAxis(
  svg: SVGSVGElement,
  ticks: readonly number[],
  area: ChartArea,
  scaleMax: number,
  scaleMin: number,
  textColor: string,
  gridColor: string,
): void {
  const range = scaleMax - scaleMin;
  for (const tick of ticks) {
    const ratio = range === 0 ? 0 : (tick - scaleMin) / range;
    const yPos = area.y + area.height - ratio * area.height;

    // grid line
    svg.appendChild(
      svgEl("line", {
        x1: area.x,
        y1: yPos,
        x2: area.x + area.width,
        y2: yPos,
        stroke: gridColor,
        "stroke-width": 1,
        "stroke-dasharray": "3,3",
      }),
    );

    // label
    svg.appendChild(
      svgText(formatTickLabel(tick), area.x - 6, yPos + 4, {
        fill: textColor,
        "text-anchor": "end",
        "font-size": 11,
      }),
    );
  }
}

/**
 * Format a numeric tick label in a compact way.
 */
export function formatTickLabel(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

// ── ImageData helpers ─────────────────────────────────────────────────

/**
 * Render an SVG element to ImageData via a temporary canvas.
 *
 * Serialises the SVG to an image, draws it on a canvas, then extracts
 * the pixel data. Useful for strategies that want to produce ImageData
 * output from an SVG intermediate.
 */
export function svgToImageData(
  svgElement: SVGSVGElement,
  width: number,
  height: number,
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get 2d context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(ctx.getImageData(0, 0, width, height));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG as image"));
    };
    img.src = url;
  });
}
