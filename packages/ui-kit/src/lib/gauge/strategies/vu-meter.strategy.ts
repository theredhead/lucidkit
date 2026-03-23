import type { GaugeRenderContext, GaugeRenderOutput } from "../gauge.types";
import {
  createGaugeSvgRoot,
  gaugeSvgEl,
  gaugeSvgText,
  valueToRatio,
} from "../gauge.utils";
import { GaugePresentationStrategy } from "./gauge-presentation-strategy";

/**
 * Vertical LED-bar VU meter gauge.
 *
 * Renders a stack of rectangular LED segments. Segments below the
 * current value are lit, segments above are dim. Coloured zones
 * determine each segment's colour; without zones the meter defaults
 * to a green → yellow → red gradient.
 *
 * Output kind: **svg**.
 */
export class VuMeterStrategy extends GaugePresentationStrategy {
  public readonly name = "VU Meter";

  /** Total number of LED segments. */
  private readonly segments: number;

  /** Gap between segments in CSS pixels. */
  private readonly gap: number;

  public constructor(options: { segments?: number; gap?: number } = {}) {
    super();
    this.segments = options.segments ?? 20;
    this.gap = options.gap ?? 2;
  }

  public render(ctx: GaugeRenderContext): GaugeRenderOutput {
    const { value, min, max, unit, zones, size, tokens, detailLevel } = ctx;
    const fmt = ctx.formatValue ?? formatLabel;
    const svg = createGaugeSvgRoot(size);

    const ratio = valueToRatio(value, min, max);
    const litCount = Math.round(ratio * this.segments);

    const padding = { top: 10, bottom: 30, left: 40, right: 10 };
    const barWidth = size.width - padding.left - padding.right;
    const barHeight = size.height - padding.top - padding.bottom;
    const segHeight =
      (barHeight - this.gap * (this.segments - 1)) / this.segments;

    const hasZones = zones.length > 0;

    for (let i = 0; i < this.segments; i++) {
      // Segment 0 = top (max), segment N-1 = bottom (min)
      const segIndex = this.segments - 1 - i;
      const segRatio = segIndex / this.segments;
      const isLit = segIndex < litCount;

      let color: string;
      if (hasZones) {
        const segValue = min + segRatio * (max - min);
        color = zoneColorAt(segValue, zones, defaultSegmentColor(segRatio));
      } else {
        color = defaultSegmentColor(segRatio);
      }

      const y = padding.top + i * (segHeight + this.gap);

      svg.appendChild(
        gaugeSvgEl("rect", {
          x: padding.left,
          y,
          width: barWidth,
          height: segHeight,
          rx: 2,
          ry: 2,
          fill: color,
          opacity: isLit ? 1 : 0.15,
        }),
      );
    }

    // ── Scale labels (min at bottom, max at top) — skipped at 'low' and 'medium' ──
    if (detailLevel === "high") {
      const labelCount = 5;
      for (let i = 0; i <= labelCount; i++) {
        const labelRatio = i / labelCount;
        const labelValue = min + labelRatio * (max - min);
        const y = padding.top + (1 - labelRatio) * barHeight;

        svg.appendChild(
          gaugeSvgText(
            fmt(labelValue),
            padding.left - 6,
            y + segHeight / 2,
            {
              fill: tokens.text,
              "text-anchor": "end",
              "dominant-baseline": "central",
              "font-size": 10,
            },
          ),
        );
      }
    }

    // ── Value readout — skipped at 'low' ──
    if (detailLevel !== "low") {
      svg.appendChild(
        gaugeSvgText(
          `${fmt(value)}${unit ? ` ${unit}` : ""}`,
          size.width / 2,
          size.height - 6,
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
}

/** Default green → yellow → red by ratio. */
function defaultSegmentColor(ratio: number): string {
  if (ratio < 0.6) return "#34a853";
  if (ratio < 0.8) return "#fbbc04";
  return "#ea4335";
}

/** Find the zone colour for a given value. */
function zoneColorAt(
  value: number,
  zones: readonly {
    readonly from: number;
    readonly to: number;
    readonly color: string;
  }[],
  fallback: string,
): string {
  for (const z of zones) {
    if (value >= z.from && value < z.to) return z.color;
  }
  return fallback;
}

function formatLabel(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
