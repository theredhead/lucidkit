import type { GaugeRenderContext, GaugeRenderOutput } from "../gauge.types";
import { createGaugeSvgRoot, gaugeSvgEl, gaugeSvgText } from "../gauge.utils";
import { GaugePresentationStrategy } from "./gauge-presentation-strategy";

/**
 * Seven-segment digital display gauge.
 *
 * Renders the current value as large seven-segment–style numerals
 * with a smaller unit label beneath. A thin horizontal progress bar
 * at the bottom provides a proportional visual.
 *
 * Output kind: **svg**.
 */
export class DigitalGaugeStrategy extends GaugePresentationStrategy {
  public readonly name = "Digital";

  /** Number of decimal places to display. */
  private readonly decimals: number;

  public constructor(options: { decimals?: number } = {}) {
    super();
    this.decimals = options.decimals ?? 1;
  }

  public render(ctx: GaugeRenderContext): GaugeRenderOutput {
    const { value, min, max, unit, size, tokens, detailLevel } = ctx;
    const svg = createGaugeSvgRoot(size);

    const cx = size.width / 2;
    const cy = size.height / 2;

    // ── Background panel ──
    svg.appendChild(
      gaugeSvgEl("rect", {
        x: 8,
        y: 8,
        width: size.width - 16,
        height: size.height - 16,
        rx: 8,
        ry: 8,
        fill: tokens.face,
      }),
    );

    // ── Formatted value ──
    const formatted = value.toFixed(this.decimals);
    const fontSize = Math.max(
      20,
      Math.round(Math.min(size.width, size.height) / 3),
    );

    svg.appendChild(
      gaugeSvgText(formatted, cx, cy - 4, {
        fill: tokens.accent,
        "text-anchor": "middle",
        "dominant-baseline": "central",
        "font-size": fontSize,
        "font-weight": "bold",
        "font-family": "'Courier New', Courier, monospace",
        "letter-spacing": 4,
      }),
    );

    // ── Unit label — skipped at 'low' ──
    if (unit && detailLevel !== "low") {
      svg.appendChild(
        gaugeSvgText(unit, cx, cy + fontSize / 2 + 10, {
          fill: tokens.text,
          "text-anchor": "middle",
          "font-size": Math.max(10, Math.round(fontSize / 3)),
          opacity: 0.7,
        }),
      );
    }

    // ── Progress bar — skipped at 'medium' and 'low' ──
    if (detailLevel === "high") {
      const barY = size.height - 24;
      const barX = 20;
      const barW = size.width - 40;
      const barH = 6;
      const range = max - min;
      const fillRatio = range === 0 ? 0 : (value - min) / range;

      // Track
      svg.appendChild(
        gaugeSvgEl("rect", {
          x: barX,
          y: barY,
          width: barW,
          height: barH,
          rx: 3,
          ry: 3,
          fill: tokens.tick,
          opacity: 0.3,
        }),
      );

      // Fill
      if (fillRatio > 0) {
        svg.appendChild(
          gaugeSvgEl("rect", {
            x: barX,
            y: barY,
            width: barW * fillRatio,
            height: barH,
            rx: 3,
            ry: 3,
            fill: tokens.accent,
          }),
        );
      }

      // ── Min / Max labels ──
      svg.appendChild(
        gaugeSvgText(formatLabel(min), barX, barY - 4, {
          fill: tokens.text,
          "text-anchor": "start",
          "font-size": 9,
          opacity: 0.6,
        }),
      );

      svg.appendChild(
        gaugeSvgText(formatLabel(max), barX + barW, barY - 4, {
          fill: tokens.text,
          "text-anchor": "end",
          "font-size": 9,
          opacity: 0.6,
        }),
      );
    }

    return { kind: "svg", element: svg };
  }
}

function formatLabel(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
