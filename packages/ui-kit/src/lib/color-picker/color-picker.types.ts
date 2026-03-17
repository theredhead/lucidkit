// ── Color Picker Types ─────────────────────────────────────────────

/**
 * Active mode/tab inside the colour-picker popover.
 *
 * - `'theme'`  — theme palette swatches in tonal luminosities
 * - `'grid'`   — classic colour grid
 * - `'rgba'`   — R / G / B / A sliders with live preview
 * - `'hsla'`   — H / S / L / A sliders with live preview
 */
export type ColorPickerMode = "theme" | "grid" | "rgba" | "hsla";

/**
 * An RGBA colour value with channels in 0–255 (rgb) and 0–1 (alpha).
 */
export interface RgbaColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

/**
 * An HSLA colour value with h in 0–360, s/l in 0–100, a in 0–1.
 */
export interface HslaColor {
  readonly h: number;
  readonly s: number;
  readonly l: number;
  readonly a: number;
}

/**
 * A theme palette swatch group.
 * Each group has a label (e.g. "Primary") and an array of hex
 * colour strings at different luminosity stops.
 */
export interface ThemePaletteGroup {
  /** Human-readable name for the swatch row. */
  readonly label: string;

  /** Array of hex colour strings from lightest to darkest. */
  readonly colors: readonly string[];
}

// ── Built-in palettes ──────────────────────────────────────────────

/**
 * Tonal luminosity stops used for theme palette generation.
 * Values are lightness percentages from lightest to darkest.
 */
export const THEME_LUMINOSITY_STOPS: readonly number[] = [
  95, 90, 80, 70, 60, 50, 40, 30, 20, 10,
];

/**
 * Base theme hues used to generate the theme palette swatches.
 * Each entry produces a row of colours at different luminosity stops.
 */
export const THEME_PALETTE_BASES: readonly ThemePaletteGroup[] = [
  {
    label: "Primary",
    colors: [
      "#e3f0ff",
      "#c6dfff",
      "#9ecaff",
      "#6bb4ff",
      "#3b9eff",
      "#0a84ff",
      "#0069cc",
      "#004f99",
      "#003566",
      "#001a33",
    ],
  },
  {
    label: "Secondary",
    colors: [
      "#f3eefb",
      "#e6ddf7",
      "#ccc2dc",
      "#b3a7c8",
      "#998cb3",
      "#80729e",
      "#665b7e",
      "#4d445f",
      "#332d41",
      "#1a1622",
    ],
  },
  {
    label: "Error",
    colors: [
      "#ffeee9",
      "#ffcfc7",
      "#ffb4ab",
      "#ff897d",
      "#ff5449",
      "#dd3730",
      "#ba1a1a",
      "#930012",
      "#690005",
      "#410003",
    ],
  },
  {
    label: "Success",
    colors: [
      "#e6f9e8",
      "#bbefc0",
      "#87e08e",
      "#53cf5f",
      "#28be3c",
      "#1a9c2d",
      "#147a23",
      "#0e5919",
      "#083910",
      "#031a07",
    ],
  },
  {
    label: "Warning",
    colors: [
      "#fff8e1",
      "#ffecb3",
      "#ffe082",
      "#ffd54f",
      "#ffca28",
      "#ffb300",
      "#ff8f00",
      "#ff6f00",
      "#e65100",
      "#bf3600",
    ],
  },
  {
    label: "Neutral",
    colors: [
      "#f5f5f5",
      "#e0e0e0",
      "#bdbdbd",
      "#9e9e9e",
      "#7e7e7e",
      "#616161",
      "#4a4a4a",
      "#353535",
      "#212121",
      "#121212",
    ],
  },
];

/**
 * Flat grid of 72 colours arranged in a 12 × 6 grid covering
 * the full hue spectrum at varying saturations and lightnesses.
 */
export const COLOR_GRID: readonly string[] = [
  // Row 1 — vivid
  "#ff0000",
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#adff2f",
  "#00ff00",
  "#00fa9a",
  "#00ced1",
  "#1e90ff",
  "#4169e1",
  "#8a2be2",
  "#ff1493",
  // Row 2 — medium
  "#e06666",
  "#e08866",
  "#e0aa66",
  "#e0d066",
  "#aad066",
  "#66d066",
  "#66d0a0",
  "#66c0d0",
  "#6690e0",
  "#7070e0",
  "#a066e0",
  "#e066b0",
  // Row 3 — light
  "#f4cccc",
  "#f4d4cc",
  "#f4ddcc",
  "#f4edcc",
  "#ddf4cc",
  "#ccf4cc",
  "#ccf4dd",
  "#ccecf4",
  "#ccd4f4",
  "#d4ccf4",
  "#e4ccf4",
  "#f4ccec",
  // Row 4 — dark
  "#990000",
  "#993300",
  "#996600",
  "#999900",
  "#669900",
  "#009900",
  "#009966",
  "#009999",
  "#003399",
  "#000099",
  "#660099",
  "#990066",
  // Row 5 — muted
  "#cc6666",
  "#cc8866",
  "#ccaa66",
  "#cccc66",
  "#aacc66",
  "#66cc66",
  "#66ccaa",
  "#66aacc",
  "#6688cc",
  "#6666cc",
  "#aa66cc",
  "#cc66aa",
  // Row 6 — grays
  "#ffffff",
  "#e8e8e8",
  "#d0d0d0",
  "#b0b0b0",
  "#909090",
  "#707070",
  "#585858",
  "#404040",
  "#282828",
  "#181818",
  "#080808",
  "#000000",
];
