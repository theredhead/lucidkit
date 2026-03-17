import { describe, expect, it } from "vitest";
import type { CropRegion, ImageFit } from "./image-cropper.types";
import {
  HANDLE_THRESHOLD,
  MIN_CROP_SIZE,
  canvasToImage,
  computeImageFit,
  computeInitialCrop,
  constrainToAspectRatio,
  cursorForHandle,
  hitTestHandle,
  regionToCanvas,
  updateCrop,
} from "./image-cropper.utils";

describe("image-cropper utils", () => {
  // ── computeImageFit ─────────────────────────────────────────────

  describe("computeImageFit", () => {
    it("should scale a landscape image into a square canvas", () => {
      const fit = computeImageFit(800, 400, 400, 400);
      expect(fit.scale).toBe(0.5);
      expect(fit.width).toBe(400);
      expect(fit.height).toBe(200);
      expect(fit.x).toBe(0);
      expect(fit.y).toBe(100);
    });

    it("should scale a portrait image into a landscape canvas", () => {
      const fit = computeImageFit(400, 800, 600, 400);
      expect(fit.scale).toBe(0.5);
      expect(fit.width).toBe(200);
      expect(fit.height).toBe(400);
      expect(fit.x).toBe(200);
      expect(fit.y).toBe(0);
    });

    it("should handle a perfect fit (1:1 scale)", () => {
      const fit = computeImageFit(400, 300, 400, 300);
      expect(fit.scale).toBe(1);
      expect(fit.x).toBe(0);
      expect(fit.y).toBe(0);
      expect(fit.width).toBe(400);
      expect(fit.height).toBe(300);
    });

    it("should scale up a small image to fill the canvas", () => {
      const fit = computeImageFit(100, 100, 400, 400);
      expect(fit.scale).toBe(4);
      expect(fit.width).toBe(400);
      expect(fit.height).toBe(400);
      expect(fit.x).toBe(0);
      expect(fit.y).toBe(0);
    });

    it("should center the image vertically when width-limited", () => {
      const fit = computeImageFit(200, 100, 200, 200);
      expect(fit.scale).toBe(1);
      expect(fit.y).toBe(50);
      expect(fit.x).toBe(0);
    });

    it("should center the image horizontally when height-limited", () => {
      const fit = computeImageFit(100, 200, 200, 200);
      expect(fit.scale).toBe(1);
      expect(fit.x).toBe(50);
      expect(fit.y).toBe(0);
    });
  });

  // ── computeInitialCrop ──────────────────────────────────────────

  describe("computeInitialCrop", () => {
    it("should cover the full image when aspectRatio is null", () => {
      const crop = computeInitialCrop(800, 600, null);
      expect(crop).toEqual({ x: 0, y: 0, width: 800, height: 600 });
    });

    it("should cover the full image when aspectRatio is 0", () => {
      const crop = computeInitialCrop(800, 600, 0);
      expect(crop).toEqual({ x: 0, y: 0, width: 800, height: 600 });
    });

    it("should constrain to 16:9 on a 4:3 image", () => {
      const crop = computeInitialCrop(800, 600, 16 / 9);
      expect(crop.width).toBe(800);
      expect(crop.height).toBe(Math.round(800 / (16 / 9)));
      expect(crop.x).toBe(0);
      expect(crop.y).toBe(Math.round((600 - crop.height) / 2));
    });

    it("should constrain to 1:1 on a landscape image", () => {
      const crop = computeInitialCrop(800, 600, 1);
      expect(crop.width).toBe(600);
      expect(crop.height).toBe(600);
      expect(crop.x).toBe(100);
      expect(crop.y).toBe(0);
    });

    it("should constrain to 1:1 on a portrait image", () => {
      const crop = computeInitialCrop(400, 800, 1);
      expect(crop.width).toBe(400);
      expect(crop.height).toBe(400);
      expect(crop.x).toBe(0);
      expect(crop.y).toBe(200);
    });

    it("should return the full image for its native ratio", () => {
      const crop = computeInitialCrop(800, 400, 2);
      expect(crop.width).toBe(800);
      expect(crop.height).toBe(400);
      expect(crop.x).toBe(0);
      expect(crop.y).toBe(0);
    });
  });

  // ── regionToCanvas / canvasToImage ──────────────────────────────

  describe("coordinate conversions", () => {
    const fit: ImageFit = {
      x: 50,
      y: 25,
      width: 400,
      height: 200,
      scale: 0.5,
    };

    it("regionToCanvas should map image coords to canvas coords", () => {
      const region: CropRegion = { x: 100, y: 50, width: 200, height: 100 };
      const canvas = regionToCanvas(region, fit);
      expect(canvas.x).toBe(100 * 0.5 + 50); // 100
      expect(canvas.y).toBe(50 * 0.5 + 25); // 50
      expect(canvas.width).toBe(100); // 200 * 0.5
      expect(canvas.height).toBe(50); // 100 * 0.5
    });

    it("canvasToImage should invert regionToCanvas", () => {
      const pt = canvasToImage(100, 50, fit);
      expect(pt.x).toBe((100 - 50) / 0.5); // 100
      expect(pt.y).toBe((50 - 25) / 0.5); // 50
    });

    it("should round-trip correctly", () => {
      const orig = { x: 200, y: 150 };
      const canvasX = orig.x * fit.scale + fit.x;
      const canvasY = orig.y * fit.scale + fit.y;
      const result = canvasToImage(canvasX, canvasY, fit);
      expect(result.x).toBeCloseTo(orig.x);
      expect(result.y).toBeCloseTo(orig.y);
    });
  });

  // ── hitTestHandle ───────────────────────────────────────────────

  describe("hitTestHandle", () => {
    const crop: CropRegion = { x: 100, y: 100, width: 200, height: 200 };

    describe("corners", () => {
      it("should detect NW corner", () => {
        expect(hitTestHandle(100, 100, crop)).toBe("nw");
      });

      it("should detect NE corner", () => {
        expect(hitTestHandle(300, 100, crop)).toBe("ne");
      });

      it("should detect SW corner", () => {
        expect(hitTestHandle(100, 300, crop)).toBe("sw");
      });

      it("should detect SE corner", () => {
        expect(hitTestHandle(300, 300, crop)).toBe("se");
      });

      it("should detect corner within threshold", () => {
        expect(hitTestHandle(100 + HANDLE_THRESHOLD, 100, crop)).toBe("nw");
        expect(hitTestHandle(100, 100 + HANDLE_THRESHOLD, crop)).toBe("nw");
      });
    });

    describe("edges", () => {
      it("should detect N edge", () => {
        expect(hitTestHandle(200, 100, crop)).toBe("n");
      });

      it("should detect S edge", () => {
        expect(hitTestHandle(200, 300, crop)).toBe("s");
      });

      it("should detect W edge", () => {
        expect(hitTestHandle(100, 200, crop)).toBe("w");
      });

      it("should detect E edge", () => {
        expect(hitTestHandle(300, 200, crop)).toBe("e");
      });

      it("should detect edge within threshold", () => {
        expect(hitTestHandle(200, 100 + HANDLE_THRESHOLD, crop)).toBe("n");
      });
    });

    describe("interior and exterior", () => {
      it("should detect interior as move", () => {
        expect(hitTestHandle(200, 200, crop)).toBe("move");
      });

      it("should return null for exterior", () => {
        expect(hitTestHandle(50, 50, crop)).toBeNull();
        expect(hitTestHandle(400, 400, crop)).toBeNull();
      });
    });
  });

  // ── cursorForHandle ─────────────────────────────────────────────

  describe("cursorForHandle", () => {
    it("should return nwse-resize for nw and se", () => {
      expect(cursorForHandle("nw")).toBe("nwse-resize");
      expect(cursorForHandle("se")).toBe("nwse-resize");
    });

    it("should return nesw-resize for ne and sw", () => {
      expect(cursorForHandle("ne")).toBe("nesw-resize");
      expect(cursorForHandle("sw")).toBe("nesw-resize");
    });

    it("should return ns-resize for n and s", () => {
      expect(cursorForHandle("n")).toBe("ns-resize");
      expect(cursorForHandle("s")).toBe("ns-resize");
    });

    it("should return ew-resize for e and w", () => {
      expect(cursorForHandle("e")).toBe("ew-resize");
      expect(cursorForHandle("w")).toBe("ew-resize");
    });

    it("should return move for interior", () => {
      expect(cursorForHandle("move")).toBe("move");
    });

    it("should return crosshair for null", () => {
      expect(cursorForHandle(null)).toBe("crosshair");
    });
  });

  // ── updateCrop ──────────────────────────────────────────────────

  describe("updateCrop", () => {
    const start: CropRegion = { x: 100, y: 100, width: 200, height: 200 };
    const imgW = 800;
    const imgH = 600;

    describe("move", () => {
      it("should translate the region by the delta", () => {
        const result = updateCrop("move", 50, 30, start, imgW, imgH, null);
        expect(result.x).toBe(150);
        expect(result.y).toBe(130);
        expect(result.width).toBe(200);
        expect(result.height).toBe(200);
      });

      it("should clamp move to image bounds (right/bottom)", () => {
        const result = updateCrop("move", 700, 500, start, imgW, imgH, null);
        expect(result.x).toBe(imgW - 200);
        expect(result.y).toBe(imgH - 200);
      });

      it("should clamp move to image bounds (left/top)", () => {
        const result = updateCrop("move", -200, -200, start, imgW, imgH, null);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
      });
    });

    describe("se corner (free)", () => {
      it("should resize width and height", () => {
        const result = updateCrop("se", 50, 30, start, imgW, imgH, null);
        expect(result.width).toBe(250);
        expect(result.height).toBe(230);
        expect(result.x).toBe(100);
        expect(result.y).toBe(100);
      });

      it("should enforce minimum size", () => {
        const result = updateCrop("se", -250, -250, start, imgW, imgH, null);
        expect(result.width).toBeGreaterThanOrEqual(MIN_CROP_SIZE);
        expect(result.height).toBeGreaterThanOrEqual(MIN_CROP_SIZE);
      });
    });

    describe("se corner (aspect ratio)", () => {
      it("should maintain 1:1 ratio", () => {
        const result = updateCrop("se", 100, 50, start, imgW, imgH, 1);
        expect(result.width).toBe(result.height);
      });

      it("should maintain 16:9 ratio", () => {
        const ratio = 16 / 9;
        const result = updateCrop("se", 100, 50, start, imgW, imgH, ratio);
        expect(Math.abs(result.width / result.height - ratio)).toBeLessThan(1);
      });
    });

    describe("nw corner", () => {
      it("should resize and reposition (free)", () => {
        const result = updateCrop("nw", -50, -30, start, imgW, imgH, null);
        expect(result.x).toBe(50);
        expect(result.y).toBe(70);
        expect(result.width).toBe(250);
        expect(result.height).toBe(230);
      });

      it("should clamp to image bounds", () => {
        const result = updateCrop("nw", -200, -200, start, imgW, imgH, null);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
      });
    });

    describe("edges", () => {
      it("should resize only height for s edge", () => {
        const result = updateCrop("s", 0, 50, start, imgW, imgH, null);
        expect(result.height).toBe(250);
        expect(result.width).toBe(200);
      });

      it("should resize only width for e edge", () => {
        const result = updateCrop("e", 50, 0, start, imgW, imgH, null);
        expect(result.width).toBe(250);
        expect(result.height).toBe(200);
      });

      it("should adjust both dimensions for n edge with aspect ratio", () => {
        const result = updateCrop("n", 0, -50, start, imgW, imgH, 1);
        expect(result.width).toBe(result.height);
      });
    });
  });

  // ── constrainToAspectRatio ──────────────────────────────────────

  describe("constrainToAspectRatio", () => {
    it("should narrow a wide region to match a portrait ratio", () => {
      const region: CropRegion = { x: 0, y: 0, width: 400, height: 200 };
      const result = constrainToAspectRatio(region, 1, 800, 600);
      expect(result.width).toBe(200);
      expect(result.height).toBe(200);
      expect(result.x).toBe(100); // centered
    });

    it("should shorten a tall region to match a landscape ratio", () => {
      const region: CropRegion = { x: 0, y: 0, width: 200, height: 400 };
      const result = constrainToAspectRatio(region, 2, 800, 600);
      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
      expect(result.y).toBe(150); // centered
    });

    it("should return the same region when already matching", () => {
      const region: CropRegion = { x: 100, y: 100, width: 200, height: 200 };
      const result = constrainToAspectRatio(region, 1, 800, 600);
      expect(result).toEqual(region);
    });

    it("should clamp to image bounds", () => {
      const region: CropRegion = { x: 700, y: 0, width: 100, height: 100 };
      const result = constrainToAspectRatio(region, 2, 800, 600);
      expect(result.x + result.width).toBeLessThanOrEqual(800);
    });
  });
});
