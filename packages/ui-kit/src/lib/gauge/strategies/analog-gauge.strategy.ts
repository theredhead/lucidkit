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
 * Configuration options for the {@link AnalogGaugeStrategy}.
 */
export interface AnalogGaugeOptions {

  /**
   * Number of major (labelled) ticks around the arc.
   * @default 10
   */
  readonly majorTicks?: number;

  /**
   * Number of minor (unlabelled) ticks between each major pair.
   * @default 4
   */
  readonly minorTicks?: number;

  /**
   * Total arc sweep in degrees.
   *
   * - `270` — classic three-quarter gauge (default)
   * - `180` — semicircle / half-gauge
   * - Any value between `30` and `360` is accepted
   *
   * @default 270
   */
  readonly sweepDegrees?: number;
}

/**
 * Classic circular speedometer-style gauge.
 *
 * Renders a configurable arc with optional coloured zones, major /
 * minor tick marks, numeric labels, a needle, and a centred value
 * readout.
 *
 * Use `sweepDegrees: 180` for a semicircle / half-gauge variant
 * suitable for fuel and temperature dashboards.
 *
 * Output kind: **svg**.
 */
export class AnalogGaugeStrategy extends GaugePresentationStrategy {
  public readonly name = "Analog";

  /** Number of major (labelled) ticks. */
  private readonly majorTicks: number;

  /** Number of minor (unlabelled) ticks between each major pair. */
  private readonly minorTicks: number;

  /** Total arc sweep in radians. */
  private readonly sweepRad: number;

  /** Start angle in radians. */
  private readonly startAngleRad: number;

  public constructor(options: AnalogGaugeOptions = {}) {
    super();
    this.majorTicks = options.majorTicks ?? 10;
    this.minorTicks = options.minorTicks ?? 4;

    const deg = Math.max(30, Math.min(360, options.sweepDegrees ?? 270));
    this.sweepRad = (deg * Math.PI) / 180;
    // Centre the gap at the bottom (270° in SVG coords).
    // Start = 270° − sweep/2, converted to radians.
    // For 270°: start = 135°, for 180°: start = 180°.
    this.startAngleRad = ((270 - deg / 2) * Math.PI) / 180;
  }

  public render(ctx: GaugeRenderContext): GaugeRenderOutput {
    const { value, min, max, unit, zones, size, tokens, detailLevel } = ctx;
    const fmt = ctx.formatValue ?? formatLabel;
    const svg = createGaugeSvgRoot(size);

    const cx = size.width / 2;
    // Push centre down for wide sweeps, keep it low for semicircle
    const isSemicircle = this.sweepRad <= Math.PI;
    const cy = isSemicircle ? size.height * 0.8 : size.height * 0.55;
    const outerRadius =
      Math.min(cx, isSemicircle ? size.height * 0.7 : cy) - 12;
    const innerRadius = outerRadius * 0.82;

    const startAngle = this.startAngleRad;
    const sweep = this.sweepRad;

    // ── Face background arc ──
    svg.appendChild(
      gaugeSvgEl("path", {
        d: describeArc(cx, cy, outerRadius, startAngle, startAngle + sweep),
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

      // Zone label at arc midpoint (high detail only)
      if (zone.label && detailLevel === "high") {
        const midAngle = (zoneStart + zoneEnd) / 2;
        const labelRadius = innerRadius - 10;
        const lp = polarToCartesian(cx, cy, labelRadius, midAngle);
        svg.appendChild(
          gaugeSvgText(zone.label, lp.x, lp.y, {
            fill: zone.color,
            "text-anchor": "middle",
            "dominant-baseline": "central",
            "font-size": Math.max(8, Math.round(outerRadius / 12)),
            "font-weight": "600",
            class: "zone-label",
          }),
        );
      }
    }

    // ── Threshold markers ──
    if (ctx.thresholds && ctx.thresholds.length > 0) {
      for (const t of ctx.thresholds) {
        if (t < min || t > max) continue;
        const tAngle = startAngle + valueToRatio(t, min, max) * sweep;
        const p1 = polarToCartesian(cx, cy, innerRadius - 4, tAngle);
        const p2 = polarToCartesian(cx, cy, outerRadius + 4, tAngle);
        svg.appendChild(
          gaugeSvgEl("line", {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            stroke: tokens.needle,
            "stroke-width": 2,
            "stroke-dasharray": "4,2",
            class: "threshold-marker",
          }),
        );
      }
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
            gaugeSvgText(fmt(tickValue), lp.x, lp.y, {
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
    const readoutY = isSemicircle
      ? cy - outerRadius * 0.15
      : cy + outerRadius * 0.42;
    svg.appendChild(
      gaugeSvgText(fmt(value), cx, readoutY, {
        fill: tokens.text,
        "text-anchor": "middle",
        "font-size": Math.max(14, Math.round(outerRadius / 5)),
        "font-weight": "bold",
      }),
    );

    if (unit) {
      svg.appendChild(
        gaugeSvgText(
          unit,
          cx,
          readoutY + Math.max(14, Math.round(outerRadius / 5)) * 0.8,
          {
            fill: tokens.text,
            "text-anchor": "middle",
            "font-size": Math.max(10, Math.round(outerRadius / 8)),
            opacity: 0.7,
          },
        ),
      );
    }

    return { kind: "svg", element: svg };
  }
}

/** Format a number for display — drop decimals if integer. */
function formatLabel(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
