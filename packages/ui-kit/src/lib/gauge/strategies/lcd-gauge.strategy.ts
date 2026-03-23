import type { GaugeRenderContext, GaugeRenderOutput } from "../gauge.types";
import { createGaugeSvgRoot, gaugeSvgEl, gaugeSvgText } from "../gauge.utils";
import { GaugePresentationStrategy } from "./gauge-presentation-strategy";

// ── Seven-segment geometry ─────────────────────────────────────────

/**
 * Segment identifiers for one digit cell.
 *
 * ```
 *  ─a─
 * |   |
 * f   b
 * |   |
 *  ─g─
 * |   |
 * e   c
 * |   |
 *  ─d─
 * ```
 */
type Segment = "a" | "b" | "c" | "d" | "e" | "f" | "g";

/** Which segments are active for each displayable glyph. */
const GLYPH_MAP: Record<string, readonly Segment[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "d", "e", "g"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["b", "c", "f", "g"],
  "5": ["a", "c", "d", "f", "g"],
  "6": ["a", "c", "d", "e", "f", "g"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
  "-": ["g"],
};

const ALL_SEGMENTS: readonly Segment[] = ["a", "b", "c", "d", "e", "f", "g"];

/**
 * Return the polygon points for a single segment within a cell
 * of the given `cellWidth` × `cellHeight`, offset by `(ox, oy)`.
 *
 * Segments are drawn as thin hexagonal slivers matching the classic
 * LCD aesthetic.
 */
function segmentPoints(
  seg: Segment,
  ox: number,
  oy: number,
  cellWidth: number,
  cellHeight: number,
): string {
  const t = Math.max(2, Math.round(cellWidth * 0.1)); // segment thickness
  const g = Math.round(t * 0.35); // gap at corners
  const hw = cellWidth; // full cell width
  const hh = cellHeight / 2; // half cell height

  // prettier-ignore
  switch (seg) {
    // ── horizontal segments ──
    case "a": return pts(ox, oy, [
      [g + t, 0], [hw - g - t, 0], [hw - g, t], [hw - g - t, t * 2], [g + t, t * 2], [g, t],
    ]);
    case "g": return pts(ox, oy, [
      [g + t, hh - t], [hw - g - t, hh - t], [hw - g, hh], [hw - g - t, hh + t], [g + t, hh + t], [g, hh],
    ]);
    case "d": return pts(ox, oy, [
      [g + t, cellHeight - t * 2], [hw - g - t, cellHeight - t * 2], [hw - g, cellHeight - t], [hw - g - t, cellHeight], [g + t, cellHeight], [g, cellHeight - t],
    ]);
    // ── vertical segments ──
    case "f": return pts(ox, oy, [
      [0, g + t], [t, g], [t * 2, g + t], [t * 2, hh - g - t], [t, hh - g], [0, hh - g - t],
    ]);
    case "b": return pts(ox, oy, [
      [hw - t * 2, g + t], [hw - t, g], [hw, g + t], [hw, hh - g - t], [hw - t, hh - g], [hw - t * 2, hh - g - t],
    ]);
    case "e": return pts(ox, oy, [
      [0, hh + g + t], [t, hh + g], [t * 2, hh + g + t], [t * 2, cellHeight - g - t], [t, cellHeight - g], [0, cellHeight - g - t],
    ]);
    case "c": return pts(ox, oy, [
      [hw - t * 2, hh + g + t], [hw - t, hh + g], [hw, hh + g + t], [hw, cellHeight - g - t], [hw - t, cellHeight - g], [hw - t * 2, cellHeight - g - t],
    ]);
  }
}

/** Format polygon point pairs as an SVG points string. */
function pts(
  ox: number,
  oy: number,
  coords: readonly (readonly [number, number])[],
): string {
  return coords.map(([x, y]) => `${ox + x},${oy + y}`).join(" ");
}

// ── Strategy ───────────────────────────────────────────────────────

/**
 * Segmented LCD gauge strategy.
 *
 * Renders the current value using seven-segment digit geometry,
 * emulating a hardware LCD panel. Each digit cell draws all seven
 * segments — active segments use the accent colour while inactive
 * segments are rendered as faint ghosts, faithfully reproducing the
 * look of a real liquid-crystal display.
 *
 * Output kind: **svg**.
 */
export class LcdGaugeStrategy extends GaugePresentationStrategy {
  public readonly name = "LCD";

  /** Number of decimal places to display. */
  private readonly decimals: number;

  /** Total number of digit cells (including sign and decimal point). */
  private readonly digitCount: number;

  public constructor(options: { decimals?: number; digitCount?: number } = {}) {
    super();
    this.decimals = options.decimals ?? 1;
    this.digitCount = options.digitCount ?? 5;
  }

  public render(ctx: GaugeRenderContext): GaugeRenderOutput {
    const { value, min, max, unit, size, tokens, detailLevel } = ctx;
    const fmt = ctx.formatValue ?? formatLabel;
    const svg = createGaugeSvgRoot(size);

    const panelPad = 8;

    // ── Background panel ──
    svg.appendChild(
      gaugeSvgEl("rect", {
        x: panelPad,
        y: panelPad,
        width: size.width - panelPad * 2,
        height: size.height - panelPad * 2,
        rx: 6,
        ry: 6,
        fill: tokens.face,
      }),
    );

    // ── Digit layout ──
    const formatted = ctx.formatValue
      ? ctx.formatValue(value)
      : value.toFixed(this.decimals);
    const padded = formatted.padStart(this.digitCount + 1, " "); // +1 for possible decimal point

    // Filter out glyphs to render: each is either a digit, '-', '.', or ' ' (blank)
    const glyphs: { char: string; hasDot: boolean }[] = [];
    for (const ch of padded) {
      if (ch === ".") {
        // Attach decimal point to previous glyph
        if (glyphs.length > 0) {
          glyphs[glyphs.length - 1].hasDot = true;
        }
      } else {
        glyphs.push({ char: ch, hasDot: false });
      }
    }

    // Ensure we only render digitCount cells
    while (glyphs.length > this.digitCount) {
      glyphs.shift();
    }

    // Available area for digits
    const digitAreaTop = panelPad + 8;
    const digitAreaBottom =
      detailLevel === "high"
        ? size.height - panelPad - 32
        : detailLevel === "medium"
          ? size.height - panelPad - 18
          : size.height - panelPad - 8;
    const availableWidth = size.width - panelPad * 2 - 16; // horizontal padding inside panel
    const dotCount = glyphs.filter((g) => g.hasDot).length;

    // Start from the height-derived cell size
    let cellHeight = Math.max(20, digitAreaBottom - digitAreaTop);
    let cellWidth = Math.max(12, Math.round(cellHeight * 0.55));
    let cellGap = Math.max(4, Math.round(cellWidth * 0.25));
    let dotWidth = Math.max(3, Math.round(cellWidth * 0.15));

    // Shrink until digits fit the available width
    const calcTotalWidth = (): number =>
      glyphs.length * cellWidth +
      (glyphs.length - 1) * cellGap +
      dotCount * (dotWidth + 2);

    if (calcTotalWidth() > availableWidth && glyphs.length > 0) {
      // Derive cell width from the horizontal budget instead
      const dotSpace = dotCount * 2; // minimal dot overhead
      // cellWidth + cellGap per cell ≈ cellWidth * 1.25, solve for cellWidth
      const maxCellWidth = Math.floor(
        (availableWidth - dotSpace) /
          (glyphs.length + (glyphs.length - 1) * 0.25 + dotCount * 0.15),
      );
      cellWidth = Math.max(8, maxCellWidth);
      cellHeight = Math.round(cellWidth / 0.55);
      cellGap = Math.max(2, Math.round(cellWidth * 0.25));
      dotWidth = Math.max(2, Math.round(cellWidth * 0.15));
    }

    // Total width of all cells
    const totalWidth = calcTotalWidth();

    let cursorX = (size.width - totalWidth) / 2;
    const cursorY = digitAreaTop;

    const activeColor = tokens.accent;
    const ghostColor = tokens.accent;
    const ghostOpacity = 0.08;

    for (const glyph of glyphs) {
      if (glyph.char !== " ") {
        const activeSegs = GLYPH_MAP[glyph.char] ?? [];

        // Draw all ghost segments first, then active ones on top
        for (const seg of ALL_SEGMENTS) {
          const isActive = activeSegs.includes(seg);
          svg.appendChild(
            gaugeSvgEl("polygon", {
              points: segmentPoints(
                seg,
                cursorX,
                cursorY,
                cellWidth,
                cellHeight,
              ),
              fill: isActive ? activeColor : ghostColor,
              opacity: isActive ? 1 : ghostOpacity,
            }),
          );
        }
      }

      cursorX += cellWidth;

      // Decimal point
      if (glyph.hasDot) {
        cursorX += 2;
        const dotSize = Math.max(3, Math.round(cellWidth * 0.15));
        svg.appendChild(
          gaugeSvgEl("rect", {
            x: cursorX,
            y: cursorY + cellHeight - dotSize,
            width: dotSize,
            height: dotSize,
            rx: 1,
            ry: 1,
            fill: activeColor,
          }),
        );
        cursorX += dotWidth;
      }

      cursorX += cellGap;
    }

    // ── Unit label — skipped at 'low' ──
    if (unit && detailLevel !== "low") {
      svg.appendChild(
        gaugeSvgText(unit, size.width / 2, digitAreaBottom + 14, {
          fill: tokens.text,
          "text-anchor": "middle",
          "font-size": Math.max(9, Math.round(cellHeight / 6)),
          opacity: 0.7,
        }),
      );
    }

    // ── Min / Max range labels — only at 'high' ──
    if (detailLevel === "high") {
      const labelY = size.height - panelPad - 6;
      svg.appendChild(
        gaugeSvgText(fmt(min), panelPad + 12, labelY, {
          fill: tokens.text,
          "text-anchor": "start",
          "font-size": 9,
          opacity: 0.5,
        }),
      );
      svg.appendChild(
        gaugeSvgText(fmt(max), size.width - panelPad - 12, labelY, {
          fill: tokens.text,
          "text-anchor": "end",
          "font-size": 9,
          opacity: 0.5,
        }),
      );
    }

    return { kind: "svg", element: svg };
  }
}

function formatLabel(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
