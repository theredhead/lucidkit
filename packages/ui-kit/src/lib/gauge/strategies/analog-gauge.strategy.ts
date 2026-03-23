import type { GaugeRenderContext, GaugeRenderOutput } from "../gauge.types";
import {
  createGaugeSvgRoot,
  describeArc,
  gaugeSvgEl,
  gaugeSvgText,
  polarToCartesian,
  valueToRatio,
} from "../gauge.utils";
import { GaugePresentationStrategy } from "./gauge-presentation-strategy";

/**
 * Classic circular speedometer-style gauge.
 *
 * Renders a 270° arc with optional coloured zones, major / minor
 * tick marks, numeric labels, a needle, and a centred value readout.
 *
 * Output kind: **svg**.
 */
export class AnalogGaugeStrategy extends GaugePresentationStrategy {
  public readonly name = "Analog";

  /** Number of major (labelled) ticks. */
  private readonly majorTicks: number;

  /** Number of minor (unlabelled) ticks between each major pair. */
  private readonly minorTicks: number;

  public constructor(
    options: { majorTicks?: number; minorTicks?: number } = {},
  ) {
    super();
    this.majorTicks = options.majorTicks ?? 10;
    this.minorTicks = options.minorTicks ?? 4;
  }

  public render(ctx: GaugeRenderContext): GaugeRenderOutput {
    const { value, min, max, unit, zones, size, tokens, detailLevel } = ctx;
    const svg = createGaugeSvgRoot(size);

    const cx = size.width / 2;
    const cy = size.height * 0.55;
    const outerRadius = Math.min(cx, cy) - 12;
    const innerRadius = outerRadius * 0.82;

    // Sweep: 270° centred at bottom → start at 135° (lower-left), end at 405° (lower-right)
    const startAngle = (135 * Math.PI) / 180;
    const endAngle = (405 * Math.PI) / 180;
    const sweep = endAngle - startAngle;

    // ── Face background arc ──
    svg.appendChild(
      gaugeSvgEl("path", {
        d: describeArc(cx, cy, outerRadius, startAngle, endAngle),
        fill: "none",
        stroke: tokens.face,
        "stroke-width": outerRadius - innerRadius,
        "stroke-linecap": "round",
      }),
    );

    // ── Coloured zones ──
    for (const zone of zones) {
      const zoneStart = startAngle + valueToRatio(zone.from, min, max) * sweep;
      const zoneEnd = startAngle + valueToRatio(zone.to, min, max) * sweep;
      svg.appendChild(
        gaugeSvgEl("path", {
          d: describeArc(cx, cy, outerRadius, zoneStart, zoneEnd),
          fill: "none",
          stroke: zone.color,
          "stroke-opacity": 0.35,
          "stroke-width": outerRadius - innerRadius,
        }),
      );
    }

    // ── Ticks (skipped at 'low' detail) ──
    if (detailLevel !== "low") {
      const totalMinor = this.majorTicks * this.minorTicks;
      for (let i = 0; i <= totalMinor; i++) {
        const ratio = i / totalMinor;
        const angle = startAngle + ratio * sweep;
        const isMajor = i % this.minorTicks === 0;
        const tickInner = isMajor ? outerRadius - 14 : outerRadius - 8;
        const tickOuter = outerRadius + 2;

        const p1 = polarToCartesian(cx, cy, tickInner, angle);
        const p2 = polarToCartesian(cx, cy, tickOuter, angle);
        svg.appendChild(
          gaugeSvgEl("line", {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            stroke: tokens.tick,
            "stroke-width": isMajor ? 2 : 1,
          }),
        );

        // Numeric labels only at 'high' detail
        if (isMajor && detailLevel === "high") {
          const labelRadius = outerRadius + 16;
          const lp = polarToCartesian(cx, cy, labelRadius, angle);
          const tickValue = min + ratio * (max - min);
          svg.appendChild(
            gaugeSvgText(formatLabel(tickValue), lp.x, lp.y, {
              fill: tokens.text,
              "text-anchor": "middle",
              "dominant-baseline": "central",
              "font-size": Math.max(9, Math.round(outerRadius / 10)),
            }),
          );
        }
      }
    }

    // ── Needle ──
    const needleAngle = startAngle + valueToRatio(value, min, max) * sweep;
    const needleLen = outerRadius - 6;
    const tip = polarToCartesian(cx, cy, needleLen, needleAngle);
    const baseL = polarToCartesian(cx, cy, 5, needleAngle - Math.PI / 2);
    const baseR = polarToCartesian(cx, cy, 5, needleAngle + Math.PI / 2);

    svg.appendChild(
      gaugeSvgEl("polygon", {
        points: `${tip.x},${tip.y} ${baseL.x},${baseL.y} ${baseR.x},${baseR.y}`,
        fill: tokens.needle,
      }),
    );

    // Centre cap
    svg.appendChild(
      gaugeSvgEl("circle", {
        cx,
        cy,
        r: 6,
        fill: tokens.needle,
      }),
    );

    // ── Value readout ──
    svg.appendChild(
      gaugeSvgText(formatLabel(value), cx, cy + outerRadius * 0.42, {
        fill: tokens.text,
        "text-anchor": "middle",
        "font-size": Math.max(14, Math.round(outerRadius / 5)),
        "font-weight": "bold",
      }),
    );

    if (unit) {
      svg.appendChild(
        gaugeSvgText(unit, cx, cy + outerRadius * 0.55, {
          fill: tokens.text,
          "text-anchor": "middle",
          "font-size": Math.max(10, Math.round(outerRadius / 8)),
          opacity: 0.7,
        }),
      );
    }

    return { kind: "svg", element: svg };
  }
}

/** Format a number for display — drop decimals if integer. */
function formatLabel(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
