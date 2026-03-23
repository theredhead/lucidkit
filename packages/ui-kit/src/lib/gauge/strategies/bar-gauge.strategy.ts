import type { GaugeRenderContext, GaugeRenderOutput } from "../gauge.types";
import {
  createGaugeSvgRoot,
  gaugeSvgEl,
  gaugeSvgText,
  valueToRatio,
} from "../gauge.utils";
import { GaugePresentationStrategy } from "./gauge-presentation-strategy";

/**
 * Configuration options for the {@link BarGaugeStrategy}.
 */
export interface BarGaugeOptions {
  /**
   * Number of equally-spaced tick marks along the track.
   * Set to `0` to hide ticks entirely.
   *
   * @default 5
   */
  readonly ticks?: number;

  /**
   * Corner radius for the track and fill bar (CSS pixels).
   *
   * @default 4
   */
  readonly borderRadius?: number;

  /**
   * Height of the horizontal bar track (CSS pixels).
   * The remaining space is used for labels and ticks.
   *
   * @default 16
   */
  readonly trackHeight?: number;
}

/**
 * Horizontal bar gauge strategy.
 *
 * Renders a linear horizontal track with a filled region from `min`
 * to the current value. Supports coloured zones, optional tick marks,
 * and a numeric value readout.
 *
 * Ideal for progress-like KPIs: CPU load, battery level, tank fill,
 * task completion, etc.
 *
 * Output kind: **svg**.
 *
 * @example
 * ```ts
 * const strategy = new BarGaugeStrategy({ ticks: 10 });
 * ```
 */
export class BarGaugeStrategy extends GaugePresentationStrategy {
  public readonly name = "Bar";

  private readonly ticks: number;
  private readonly borderRadius: number;
  private readonly trackHeight: number;

  public constructor(options: BarGaugeOptions = {}) {
    super();
    this.ticks = options.ticks ?? 5;
    this.borderRadius = options.borderRadius ?? 4;
    this.trackHeight = options.trackHeight ?? 16;
  }

  public render(ctx: GaugeRenderContext): GaugeRenderOutput {
    const { value, min, max, unit, zones, size, tokens, detailLevel } = ctx;
    const fmt = ctx.formatValue ?? formatLabel;
    const svg = createGaugeSvgRoot(size);

    const ratio = valueToRatio(value, min, max);

    const padding = { top: 10, bottom: 28, left: 10, right: 10 };

    // Extra space for tick labels below the track
    if (detailLevel === "high" && this.ticks > 0) {
      padding.bottom = 40;
    }

    const trackWidth = size.width - padding.left - padding.right;
    const trackY =
      (size.height - padding.bottom - padding.top - this.trackHeight) / 2 +
      padding.top;

    // ── Track background ──
    svg.appendChild(
      gaugeSvgEl("rect", {
        x: padding.left,
        y: trackY,
        width: trackWidth,
        height: this.trackHeight,
        rx: this.borderRadius,
        ry: this.borderRadius,
        fill: tokens.face,
      }),
    );

    // ── Zone backgrounds (drawn behind the fill) ──
    if (zones.length > 0) {
      // Clip to the track shape
      const clipId = "bar-clip";
      const defs = gaugeSvgEl("defs");
      const clipPath = gaugeSvgEl("clipPath", { id: clipId });
      clipPath.appendChild(
        gaugeSvgEl("rect", {
          x: padding.left,
          y: trackY,
          width: trackWidth,
          height: this.trackHeight,
          rx: this.borderRadius,
          ry: this.borderRadius,
        }),
      );
      defs.appendChild(clipPath);
      svg.appendChild(defs);

      const zoneGroup = gaugeSvgEl("g", { "clip-path": `url(#${clipId})` });

      for (const zone of zones) {
        const zoneStart = valueToRatio(Math.max(zone.from, min), min, max);
        const zoneEnd = valueToRatio(Math.min(zone.to, max), min, max);
        const x = padding.left + zoneStart * trackWidth;
        const w = (zoneEnd - zoneStart) * trackWidth;

        zoneGroup.appendChild(
          gaugeSvgEl("rect", {
            x,
            y: trackY,
            width: Math.max(w, 0),
            height: this.trackHeight,
            fill: zone.color,
            opacity: 0.25,
          }),
        );

        // Zone label centred above the zone segment (high detail only)
        if (zone.label && detailLevel === "high") {
          const labelX = x + w / 2;
          const labelY = trackY + this.trackHeight / 2;
          svg.appendChild(
            gaugeSvgText(zone.label, labelX, labelY, {
              fill: zone.color,
              "text-anchor": "middle",
              "dominant-baseline": "central",
              "font-size": 9,
              "font-weight": "600",
              class: "zone-label",
            }),
          );
        }
      }

      svg.appendChild(zoneGroup);
    }

    // ── Threshold markers ──
    if (ctx.thresholds && ctx.thresholds.length > 0) {
      for (const t of ctx.thresholds) {
        if (t < min || t > max) continue;
        const x = padding.left + valueToRatio(t, min, max) * trackWidth;
        svg.appendChild(
          gaugeSvgEl("line", {
            x1: x,
            y1: trackY - 2,
            x2: x,
            y2: trackY + this.trackHeight + 2,
            stroke: tokens.needle,
            "stroke-width": 2,
            "stroke-dasharray": "4,2",
            class: "threshold-marker",
          }),
        );
      }
    }

    // ── Fill bar ──
    const fillWidth = ratio * trackWidth;

    if (fillWidth > 0) {
      const fillColor = this.resolveColor(value, zones, tokens);

      // Clip the fill to rounded corners matching the track
      const fillClipId = "bar-fill-clip";
      let defs = svg.querySelector("defs");
      if (!defs) {
        defs = gaugeSvgEl("defs");
        svg.appendChild(defs);
      }
      const fillClip = gaugeSvgEl("clipPath", { id: fillClipId });
      fillClip.appendChild(
        gaugeSvgEl("rect", {
          x: padding.left,
          y: trackY,
          width: trackWidth,
          height: this.trackHeight,
          rx: this.borderRadius,
          ry: this.borderRadius,
        }),
      );
      defs.appendChild(fillClip);

      svg.appendChild(
        gaugeSvgEl("rect", {
          x: padding.left,
          y: trackY,
          width: fillWidth,
          height: this.trackHeight,
          fill: fillColor,
          "clip-path": `url(#${fillClipId})`,
        }),
      );
    }

    // ── Ticks ──
    if (this.ticks > 0 && detailLevel !== "low") {
      const tickY = trackY + this.trackHeight + 4;

      for (let i = 0; i <= this.ticks; i++) {
        const tickRatio = i / this.ticks;
        const x = padding.left + tickRatio * trackWidth;

        svg.appendChild(
          gaugeSvgEl("line", {
            x1: x,
            y1: tickY,
            x2: x,
            y2: tickY + 6,
            stroke: tokens.tick,
            "stroke-width": 1,
          }),
        );

        // Labels only at "high" detail
        if (detailLevel === "high") {
          const tickValue = min + tickRatio * (max - min);
          svg.appendChild(
            gaugeSvgText(fmt(tickValue), x, tickY + 16, {
              fill: tokens.text,
              "text-anchor": "middle",
              "font-size": 10,
            }),
          );
        }
      }
    }

    // ── Value readout ──
    if (detailLevel !== "low") {
      svg.appendChild(
        gaugeSvgText(
          `${fmt(value)}${unit ? ` ${unit}` : ""}`,
          size.width / 2,
          trackY - 6,
          {
            fill: tokens.text,
            "text-anchor": "middle",
            "font-size": 13,
            "font-weight": "bold",
          },
        ),
      );
    }

    return { kind: "svg", element: svg };
  }

  /**
   * Pick the fill colour — zone colour if the value falls inside a
   * zone, otherwise the accent token.
   */
  private resolveColor(
    value: number,
    zones: readonly {
      readonly from: number;
      readonly to: number;
      readonly color: string;
    }[],
    tokens: { readonly accent: string },
  ): string {
    for (const z of zones) {
      if (value >= z.from && value < z.to) return z.color;
    }
    return tokens.accent;
  }
}

function formatLabel(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
