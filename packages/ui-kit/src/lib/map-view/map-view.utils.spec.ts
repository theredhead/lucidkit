import {
  computeTiles,
  latLngToPixel,
  latLngToViewport,
  pointsToPolygonPath,
  pointsToPolylinePath,
  TILE_SIZE,
} from "./map-view.utils";

describe("map-view utils", () => {
  // ── latLngToPixel ───────────────────────────────────────────────────

  describe("latLngToPixel", () => {
    it("should return { 128, 128 } for (0, 0) at zoom 0", () => {
      const p = latLngToPixel(0, 0, 0);
      expect(p.x).toBeCloseTo(128, 0);
      expect(p.y).toBeCloseTo(128, 0);
    });

    it("should place (0, -180) at x = 0 at zoom 0", () => {
      const p = latLngToPixel(0, -180, 0);
      expect(p.x).toBeCloseTo(0, 0);
    });

    it("should place (0, 180) at x = 256 at zoom 0", () => {
      const p = latLngToPixel(0, 180, 0);
      expect(p.x).toBeCloseTo(256, 0);
    });

    it("should double pixel values when zoom increases by 1", () => {
      const z0 = latLngToPixel(48.8566, 2.3522, 0);
      const z1 = latLngToPixel(48.8566, 2.3522, 1);
      expect(z1.x).toBeCloseTo(z0.x * 2, 1);
      expect(z1.y).toBeCloseTo(z0.y * 2, 1);
    });

    it("should place northern latitudes above the equator (lower y)", () => {
      const equator = latLngToPixel(0, 0, 5);
      const north = latLngToPixel(52.37, 0, 5);
      expect(north.y).toBeLessThan(equator.y);
    });

    it("should place southern latitudes below the equator (higher y)", () => {
      const equator = latLngToPixel(0, 0, 5);
      const south = latLngToPixel(-33.87, 0, 5);
      expect(south.y).toBeGreaterThan(equator.y);
    });
  });

  // ── latLngToViewport ────────────────────────────────────────────────

  describe("latLngToViewport", () => {
    it("should return viewport centre for the centre coordinate", () => {
      const vp = latLngToViewport(52.37, 4.89, 10, 52.37, 4.89, 800, 400);
      expect(vp.x).toBeCloseTo(400, 0);
      expect(vp.y).toBeCloseTo(200, 0);
    });

    it("should offset points east of centre to the right", () => {
      const vp = latLngToViewport(52.37, 5.0, 10, 52.37, 4.89, 800, 400);
      expect(vp.x).toBeGreaterThan(400);
    });

    it("should offset points north of centre upward (lower y)", () => {
      const vp = latLngToViewport(52.5, 4.89, 10, 52.37, 4.89, 800, 400);
      expect(vp.y).toBeLessThan(200);
    });
  });

  // ── computeTiles ────────────────────────────────────────────────────

  describe("computeTiles", () => {
    it("should return an empty array for zero-size viewport", () => {
      expect(computeTiles(0, 0, 5, 0, 0, "")).toEqual([]);
      expect(computeTiles(0, 0, 5, 0, 100, "")).toEqual([]);
      expect(computeTiles(0, 0, 5, 100, 0, "")).toEqual([]);
    });

    it("should return at least one tile for a non-zero viewport", () => {
      const tiles = computeTiles(0, 0, 0, 100, 100, "{z}/{x}/{y}");
      expect(tiles.length).toBeGreaterThanOrEqual(1);
    });

    it("should produce tile URLs with substituted {z}/{x}/{y}", () => {
      const tiles = computeTiles(
        0,
        0,
        2,
        256,
        256,
        "https://tile/{z}/{x}/{y}.png",
      );
      for (const t of tiles) {
        expect(t.url).not.toContain("{z}");
        expect(t.url).not.toContain("{x}");
        expect(t.url).not.toContain("{y}");
        expect(t.url).toContain("https://tile/2/");
      }
    });

    it("should tile a viewport larger than a single tile", () => {
      // At zoom 0 the world is a single 256×256 tile. A 512px viewport
      // extends beyond it, so wrapping produces extra columns.
      const tiles = computeTiles(0, 0, 0, 512, 512, "{z}/{x}/{y}");
      expect(tiles.length).toBeGreaterThanOrEqual(1);
      // All tiles at zoom 0 resolve to (0, 0) after wrapping
      for (const t of tiles) {
        expect(t.url).toBe("0/0/0");
      }
    });

    it("should produce multiple tiles at higher zoom for wide viewports", () => {
      const tiles = computeTiles(52.37, 4.89, 10, 800, 400, "{z}/{x}/{y}");
      expect(tiles.length).toBeGreaterThan(1);
    });

    it("should give each tile a unique key", () => {
      const tiles = computeTiles(52.37, 4.89, 10, 800, 400, "{z}/{x}/{y}");
      const keys = tiles.map((t) => t.key);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it("should position tiles with TILE_SIZE spacing", () => {
      const tiles = computeTiles(52.37, 4.89, 10, 800, 400, "{z}/{x}/{y}");
      // Group by row (same top value)
      const byRow = new Map<number, typeof tiles>();
      for (const t of tiles) {
        const row = Math.round(t.top);
        if (!byRow.has(row)) byRow.set(row, []);
        byRow.get(row)!.push(t);
      }
      for (const [, row] of byRow) {
        if (row.length < 2) continue;
        const sorted = [...row].sort((a, b) => a.left - b.left);
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i].left - sorted[i - 1].left).toBeCloseTo(TILE_SIZE, 0);
        }
      }
    });

    it("should wrap tile X coordinates for horizontal world repetition", () => {
      // At zoom 2 there are 4 tiles across. Centre at lng = -170 (near date line).
      const tiles = computeTiles(0, -170, 2, 600, 256, "{z}/{x}/{y}");
      for (const t of tiles) {
        // Wrapped X should be 0..(2^z - 1)
        const parts = t.url.split("/");
        const x = parseInt(parts[1], 10);
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThan(4);
      }
    });
  });

  // ── SVG path helpers ────────────────────────────────────────────────

  describe("pointsToPolylinePath", () => {
    it("should return empty string for empty array", () => {
      expect(pointsToPolylinePath([])).toBe("");
    });

    it("should start with M for single point", () => {
      const path = pointsToPolylinePath([{ x: 10, y: 20 }]);
      expect(path).toBe("M10.0 20.0");
    });

    it("should use M for first point and L for subsequent", () => {
      const path = pointsToPolylinePath([
        { x: 0, y: 0 },
        { x: 100, y: 50 },
        { x: 200, y: 25 },
      ]);
      expect(path).toBe("M0.0 0.0 L100.0 50.0 L200.0 25.0");
    });
  });

  describe("pointsToPolygonPath", () => {
    it("should return empty string for empty array", () => {
      expect(pointsToPolygonPath([])).toBe("");
    });

    it("should close the path with Z", () => {
      const path = pointsToPolygonPath([
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 80 },
      ]);
      expect(path).toBe("M0.0 0.0 L100.0 0.0 L50.0 80.0 Z");
    });
  });
});
