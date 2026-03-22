// ── Color Picker Types ─────────────────────────────────────────────

/**
 * Active mode/tab inside the colour-picker popover.
 *
 * - `'theme'`  — theme palette swatches in tonal luminosities
 * - `'grid'`   — classic colour grid
 * - `'rgba'`   — R / G / B / A sliders with live preview
 * - `'hsla'`   — H / S / L / A sliders with live preview
 */
export type ColorPickerMode = "theme" | "grid" | "rgba" | "hsla" | "named";

/**
 * A named CSS colour with a human-readable label and hex value.
 */
export interface NamedColor {
  /** Human-readable colour name (e.g. "Coral"). */
  readonly name: string;
  /** Hex value (`#rrggbb`). */
  readonly hex: string;
}

/**
 * A curated list of named CSS colours for the "named" picker mode.
 * Sorted roughly by hue family for easy visual scanning.
 */
export const NAMED_COLORS: readonly NamedColor[] = [
  // ── Reds ──
  { name: "Indian Red", hex: "#cd5c5c" },
  { name: "Light Coral", hex: "#f08080" },
  { name: "Salmon", hex: "#fa8072" },
  { name: "Crimson", hex: "#dc143c" },
  { name: "Red", hex: "#ff0000" },
  { name: "Fire Brick", hex: "#b22222" },
  { name: "Dark Red", hex: "#8b0000" },
  // ── Oranges ──
  { name: "Coral", hex: "#ff7f50" },
  { name: "Tomato", hex: "#ff6347" },
  { name: "Orange Red", hex: "#ff4500" },
  { name: "Orange", hex: "#ffa500" },
  { name: "Dark Orange", hex: "#ff8c00" },
  // ── Yellows ──
  { name: "Gold", hex: "#ffd700" },
  { name: "Yellow", hex: "#ffff00" },
  { name: "Khaki", hex: "#f0e68c" },
  { name: "Dark Khaki", hex: "#bdb76b" },
  // ── Greens ──
  { name: "Lawn Green", hex: "#7cfc00" },
  { name: "Lime Green", hex: "#32cd32" },
  { name: "Lime", hex: "#00ff00" },
  { name: "Green", hex: "#008000" },
  { name: "Forest Green", hex: "#228b22" },
  { name: "Dark Green", hex: "#006400" },
  { name: "Sea Green", hex: "#2e8b57" },
  { name: "Medium Spring Green", hex: "#00fa9a" },
  { name: "Spring Green", hex: "#00ff7f" },
  { name: "Olive", hex: "#808000" },
  { name: "Dark Olive Green", hex: "#556b2f" },
  { name: "Olive Drab", hex: "#6b8e23" },
  // ── Cyans ──
  { name: "Aqua", hex: "#00ffff" },
  { name: "Dark Cyan", hex: "#008b8b" },
  { name: "Teal", hex: "#008080" },
  { name: "Light Sea Green", hex: "#20b2aa" },
  { name: "Cadet Blue", hex: "#5f9ea0" },
  // ── Blues ──
  { name: "Steel Blue", hex: "#4682b4" },
  { name: "Cornflower Blue", hex: "#6495ed" },
  { name: "Deep Sky Blue", hex: "#00bfff" },
  { name: "Dodger Blue", hex: "#1e90ff" },
  { name: "Royal Blue", hex: "#4169e1" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Medium Blue", hex: "#0000cd" },
  { name: "Dark Blue", hex: "#00008b" },
  { name: "Navy", hex: "#000080" },
  { name: "Midnight Blue", hex: "#191970" },
  // ── Purples ──
  { name: "Lavender", hex: "#e6e6fa" },
  { name: "Plum", hex: "#dda0dd" },
  { name: "Violet", hex: "#ee82ee" },
  { name: "Orchid", hex: "#da70d6" },
  { name: "Medium Orchid", hex: "#ba55d3" },
  { name: "Medium Purple", hex: "#9370db" },
  { name: "Blue Violet", hex: "#8a2be2" },
  { name: "Dark Violet", hex: "#9400d3" },
  { name: "Dark Orchid", hex: "#9932cc" },
  { name: "Dark Magenta", hex: "#8b008b" },
  { name: "Purple", hex: "#800080" },
  { name: "Indigo", hex: "#4b0082" },
  // ── Pinks ──
  { name: "Pink", hex: "#ffc0cb" },
  { name: "Light Pink", hex: "#ffb6c1" },
  { name: "Hot Pink", hex: "#ff69b4" },
  { name: "Deep Pink", hex: "#ff1493" },
  { name: "Medium Violet Red", hex: "#c71585" },
  { name: "Pale Violet Red", hex: "#db7093" },
  // ── Browns ──
  { name: "Saddle Brown", hex: "#8b4513" },
  { name: "Sienna", hex: "#a0522d" },
  { name: "Chocolate", hex: "#d2691e" },
  { name: "Peru", hex: "#cd853f" },
  { name: "Sandy Brown", hex: "#f4a460" },
  { name: "Burlywood", hex: "#deb887" },
  { name: "Tan", hex: "#d2b48c" },
  { name: "Rosy Brown", hex: "#bc8f8f" },
  { name: "Maroon", hex: "#800000" },
  // ── Neutrals ──
  { name: "White", hex: "#ffffff" },
  { name: "Snow", hex: "#fffafa" },
  { name: "Ivory", hex: "#fffff0" },
  { name: "Floral White", hex: "#fffaf0" },
  { name: "Linen", hex: "#faf0e6" },
  { name: "Antique White", hex: "#faebd7" },
  { name: "Beige", hex: "#f5f5dc" },
  { name: "Gainsboro", hex: "#dcdcdc" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "Dark Gray", hex: "#a9a9a9" },
  { name: "Gray", hex: "#808080" },
  { name: "Dim Gray", hex: "#696969" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Dark Slate Gray", hex: "#2f4f4f" },
  { name: "Black", hex: "#000000" },
];

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
