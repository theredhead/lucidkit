import { describe, expect, it } from "vitest";

import type { RgbaColor } from "./color-picker.types";
import {
  hexToHsla,
  hexToRgba,
  hslaToHex,
  hslaToRgba,
  hslaToCss,
  rgbaToHex,
  rgbaToHsla,
  rgbaToCss,
} from "./color-picker.utils";

// ── hexToRgba ──────────────────────────────────────────────────────

describe("hexToRgba", () => {
  it("should parse #rrggbb", () => {
    expect(hexToRgba("#ff8000")).toEqual({ r: 255, g: 128, b: 0, a: 1 });
  });

  it("should parse #rrggbbaa", () => {
    expect(hexToRgba("#ff800080")).toEqual({ r: 255, g: 128, b: 0, a: 0.5 });
  });

  it("should parse shorthand #rgb", () => {
    expect(hexToRgba("#f80")).toEqual({ r: 255, g: 136, b: 0, a: 1 });
  });

  it("should parse shorthand #rgba", () => {
    const result = hexToRgba("#f808");
    expect(result).not.toBeNull();
    expect(result!.r).toBe(255);
    expect(result!.g).toBe(136);
    expect(result!.b).toBe(0);
    expect(result!.a).toBeCloseTo(0.53, 1);
  });

  it("should return null for invalid hex", () => {
    expect(hexToRgba("not-a-color")).toBeNull();
    expect(hexToRgba("#gg0000")).toBeNull();
    expect(hexToRgba("#12")).toBeNull();
  });

  it("should work without leading #", () => {
    expect(hexToRgba("ff8000")).toEqual({ r: 255, g: 128, b: 0, a: 1 });
  });

  it("should parse pure black", () => {
    expect(hexToRgba("#000000")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it("should parse pure white", () => {
    expect(hexToRgba("#ffffff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });
});

// ── rgbaToHex ──────────────────────────────────────────────────────

describe("rgbaToHex", () => {
  it("should produce #rrggbb when alpha is 1", () => {
    expect(rgbaToHex({ r: 255, g: 128, b: 0, a: 1 })).toBe("#ff8000");
  });

  it("should produce #rrggbbaa when alpha < 1", () => {
    const hex = rgbaToHex({ r: 255, g: 128, b: 0, a: 0.5 });
    expect(hex).toBe("#ff800080");
  });

  it("should clamp out-of-range values", () => {
    expect(rgbaToHex({ r: 300, g: -10, b: 128, a: 1 })).toBe("#ff0080");
  });

  it("should produce #000000 for black", () => {
    expect(rgbaToHex({ r: 0, g: 0, b: 0, a: 1 })).toBe("#000000");
  });
});

// ── rgbaToHsla / hslaToRgba round-trip ─────────────────────────────

describe("rgbaToHsla", () => {
  it("should convert red", () => {
    const hsla = rgbaToHsla({ r: 255, g: 0, b: 0, a: 1 });
    expect(hsla.h).toBe(0);
    expect(hsla.s).toBe(100);
    expect(hsla.l).toBe(50);
    expect(hsla.a).toBe(1);
  });

  it("should convert green", () => {
    const hsla = rgbaToHsla({ r: 0, g: 128, b: 0, a: 1 });
    expect(hsla.h).toBe(120);
    expect(hsla.s).toBe(100);
    expect(hsla.l).toBe(25);
    expect(hsla.a).toBe(1);
  });

  it("should convert grey (no saturation)", () => {
    const hsla = rgbaToHsla({ r: 128, g: 128, b: 128, a: 1 });
    expect(hsla.s).toBe(0);
    expect(hsla.l).toBe(50);
  });

  it("should preserve alpha", () => {
    const hsla = rgbaToHsla({ r: 255, g: 0, b: 0, a: 0.42 });
    expect(hsla.a).toBe(0.42);
  });
});

describe("hslaToRgba", () => {
  it("should convert pure red", () => {
    const rgba = hslaToRgba({ h: 0, s: 100, l: 50, a: 1 });
    expect(rgba).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("should convert grey (s = 0)", () => {
    const rgba = hslaToRgba({ h: 0, s: 0, l: 50, a: 1 });
    expect(rgba).toEqual({ r: 128, g: 128, b: 128, a: 1 });
  });

  it("should preserve alpha", () => {
    const rgba = hslaToRgba({ h: 0, s: 100, l: 50, a: 0.3 });
    expect(rgba.a).toBe(0.3);
  });
});

describe("RGBA ↔ HSLA round-trip", () => {
  const testColors: RgbaColor[] = [
    { r: 255, g: 0, b: 0, a: 1 },
    { r: 0, g: 255, b: 0, a: 1 },
    { r: 0, g: 0, b: 255, a: 1 },
    { r: 128, g: 64, b: 192, a: 0.75 },
    { r: 0, g: 0, b: 0, a: 1 },
    { r: 255, g: 255, b: 255, a: 1 },
  ];

  for (const original of testColors) {
    it(`should round-trip rgba(${original.r},${original.g},${original.b},${original.a})`, () => {
      const hsla = rgbaToHsla(original);
      const roundTrip = hslaToRgba(hsla);

      // Allow ±1 due to rounding through integer H/S/L
      expect(Math.abs(roundTrip.r - original.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(roundTrip.g - original.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(roundTrip.b - original.b)).toBeLessThanOrEqual(1);
      expect(roundTrip.a).toBe(original.a);
    });
  }
});

// ── Hex ↔ HSLA convenience ─────────────────────────────────────────

describe("hexToHsla", () => {
  it("should convert a hex string to HSLA", () => {
    const hsla = hexToHsla("#ff0000");
    expect(hsla).not.toBeNull();
    expect(hsla!.h).toBe(0);
    expect(hsla!.s).toBe(100);
    expect(hsla!.l).toBe(50);
  });

  it("should return null for invalid hex", () => {
    expect(hexToHsla("xyz")).toBeNull();
  });
});

describe("hslaToHex", () => {
  it("should convert HSLA to hex", () => {
    expect(hslaToHex({ h: 0, s: 100, l: 50, a: 1 })).toBe("#ff0000");
  });

  it("should include alpha in hex when < 1", () => {
    const hex = hslaToHex({ h: 0, s: 100, l: 50, a: 0.5 });
    expect(hex).toBe("#ff000080");
  });
});

// ── CSS helpers ────────────────────────────────────────────────────

describe("rgbaToCss", () => {
  it("should produce an rgba() string", () => {
    expect(rgbaToCss({ r: 255, g: 128, b: 0, a: 0.5 })).toBe(
      "rgba(255, 128, 0, 0.5)",
    );
  });
});

describe("hslaToCss", () => {
  it("should produce an hsla() string", () => {
    expect(hslaToCss({ h: 120, s: 50, l: 75, a: 1 })).toBe(
      "hsla(120, 50%, 75%, 1)",
    );
  });
});
