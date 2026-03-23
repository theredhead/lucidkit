import type { GaugeSize } from "./gauge.types";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Create an SVG element within the SVG namespace.
 * @internal
 */
export function gaugeSvgEl<K extends keyof SVGElementTagNameMap>(
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
 * @internal
 */
export function createGaugeSvgRoot(size: GaugeSize): SVGSVGElement {
  return gaugeSvgEl("svg", {
    xmlns: SVG_NS,
    width: size.width,
    height: size.height,
    viewBox: `0 0 ${size.width} ${size.height}`,
  });
}

/**
 * Create an SVG text element.
 * @internal
 */
export function gaugeSvgText(
  text: string,
  x: number,
  y: number,
  attrs: Record<string, string | number> = {},
): SVGTextElement {
  const el = gaugeSvgEl("text", { x, y, ...attrs });
  el.textContent = text;
  return el;
}

/**
 * Convert polar coordinates (angle in radians) to Cartesian.
 * @internal
 */
export function polarToCartesian(
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

/**
 * Build an SVG arc path descriptor.
 * @internal
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
  ].join(" ");
}

/**
 * Map a value to a ratio within a range.
 * @internal
 */
export function valueToRatio(value: number, min: number, max: number): number {
  const range = max - min;
  if (range === 0) return 0;
  return (value - min) / range;
}
