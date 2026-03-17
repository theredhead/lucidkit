import type { HslaColor, RgbaColor } from "./color-picker.types";

// ── Hex ↔ RGBA ─────────────────────────────────────────────────────

/**
 * Parses a hex colour string to an {@link RgbaColor}.
 * Accepts `#rgb`, `#rgba`, `#rrggbb`, and `#rrggbbaa` formats.
 * Returns `null` if the string is not valid hex.
 */
export function hexToRgba(hex: string): RgbaColor | null {
  let h = hex.startsWith("#") ? hex.slice(1) : hex;

  // Expand shorthand: #rgb → #rrggbb, #rgba → #rrggbbaa
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  } else if (h.length === 4) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }

  if (h.length !== 6 && h.length !== 8) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;

  if (h.length === 8) {
    return {
      r: (n >>> 24) & 0xff,
      g: (n >>> 16) & 0xff,
      b: (n >>> 8) & 0xff,
      a: Math.round(((n & 0xff) / 255) * 100) / 100,
    };
  }

  return {
    r: (n >>> 16) & 0xff,
    g: (n >>> 8) & 0xff,
    b: n & 0xff,
    a: 1,
  };
}

/**
 * Converts an {@link RgbaColor} to a `#rrggbb` or `#rrggbbaa` hex
 * string.  Omits the alpha channel when `a === 1`.
 */
export function rgbaToHex(c: RgbaColor): string {
  const r = clamp(Math.round(c.r), 0, 255);
  const g = clamp(Math.round(c.g), 0, 255);
  const b = clamp(Math.round(c.b), 0, 255);
  const hex = `#${pad(r)}${pad(g)}${pad(b)}`;
  if (c.a >= 1) return hex;
  const a = clamp(Math.round(c.a * 255), 0, 255);
  return `${hex}${pad(a)}`;
}

// ── RGBA ↔ HSLA ────────────────────────────────────────────────────

/**
 * Converts an {@link RgbaColor} to an {@link HslaColor}.
 * RGB channels are expected in 0–255, alpha in 0–1.
 */
export function rgbaToHsla(c: RgbaColor): HslaColor {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: c.a,
  };
}

/**
 * Converts an {@link HslaColor} to an {@link RgbaColor}.
 * H is in 0–360, S/L in 0–100, alpha in 0–1.
 */
export function hslaToRgba(c: HslaColor): RgbaColor {
  const h = c.h / 360;
  const s = c.s / 100;
  const l = c.l / 100;

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: c.a,
  };
}

// ── Hex ↔ HSLA (convenience) ───────────────────────────────────────

/** Converts a hex string to {@link HslaColor}. */
export function hexToHsla(hex: string): HslaColor | null {
  const rgba = hexToRgba(hex);
  return rgba ? rgbaToHsla(rgba) : null;
}

/** Converts an {@link HslaColor} to a hex string. */
export function hslaToHex(c: HslaColor): string {
  return rgbaToHex(hslaToRgba(c));
}

// ── CSS string helpers ─────────────────────────────────────────────

/** Produces a CSS `rgba(…)` string from an {@link RgbaColor}. */
export function rgbaToCss(c: RgbaColor): string {
  return `rgba(${clamp(Math.round(c.r), 0, 255)}, ${clamp(Math.round(c.g), 0, 255)}, ${clamp(Math.round(c.b), 0, 255)}, ${c.a})`;
}

/** Produces a CSS `hsla(…)` string from an {@link HslaColor}. */
export function hslaToCss(c: HslaColor): string {
  return `hsla(${c.h}, ${c.s}%, ${c.l}%, ${c.a})`;
}

// ── Internal helpers ───────────────────────────────────────────────

/** @internal */
function hueToRgb(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

/** @internal */
function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** @internal */
function pad(n: number): string {
  return n.toString(16).padStart(2, "0");
}
