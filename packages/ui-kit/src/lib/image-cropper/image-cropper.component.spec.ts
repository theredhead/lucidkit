import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UIImageCropper } from "./image-cropper.component";

// jsdom lacks ImageData — provide a minimal polyfill.
if (typeof globalThis.ImageData === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any)["ImageData"] = class ImageData {
    public readonly width: number;
    public readonly height: number;
    public readonly data: Uint8ClampedArray;
    public constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
    }
  } as unknown as typeof globalThis.ImageData;
}

/**
 * Minimal CanvasRenderingContext2D stub for jsdom (which lacks Canvas).
 */
function createMockCtx(): Record<string, unknown> {
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setLineDash: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    putImageData: vi.fn(),
    getImageData: vi.fn(
      (_x: number, _y: number, w: number, h: number) => new ImageData(w, h),
    ),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    globalAlpha: 1,
    font: "",
    textAlign: "",
    fillText: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  };
}

describe("UIImageCropper", () => {
  let fixture: ComponentFixture<UIImageCropper>;
  let component: UIImageCropper;

  beforeEach(async () => {
    // Mock canvas context since jsdom does not support it.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      createMockCtx() as unknown as CanvasRenderingContext2D,
    );

    await TestBed.configureTestingModule({
      imports: [UIImageCropper],
    }).compileComponents();

    fixture = TestBed.createComponent(UIImageCropper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default src to null", () => {
      expect(component.src()).toBeNull();
    });

    it("should default aspectRatio to null (free crop)", () => {
      expect(component.aspectRatio()).toBeNull();
    });

    it("should default outputFormat to image/png", () => {
      expect(component.outputFormat()).toBe("image/png");
    });

    it("should default outputQuality to 0.92", () => {
      expect(component.outputQuality()).toBe(0.92);
    });

    it('should default ariaLabel to "Image cropper"', () => {
      expect(component.ariaLabel()).toBe("Image cropper");
    });
  });

  describe("host element", () => {
    it("should have the ui-image-cropper class", () => {
      expect(fixture.nativeElement.classList).toContain("ui-image-cropper");
    });
  });

  describe("public API", () => {
    it("should expose a crop() method", () => {
      expect(typeof component.crop).toBe("function");
    });

    it("should expose a reset() method", () => {
      expect(typeof component.reset).toBe("function");
    });

    it("should expose a loadImageData() method", () => {
      expect(typeof component.loadImageData).toBe("function");
    });

    it("should expose a cropToImageData() method", () => {
      expect(typeof component.cropToImageData).toBe("function");
    });
  });

  describe("loadImageData", () => {
    it("should accept an ImageData instance without throwing", () => {
      const data = new ImageData(100, 80);
      expect(() => component.loadImageData(data)).not.toThrow();
    });

    it("should emit imageLoaded with the ImageData dimensions", () => {
      const spy = vi.fn();
      component.imageLoaded.subscribe(spy);
      const data = new ImageData(200, 150);
      component.loadImageData(data);
      expect(spy).toHaveBeenCalledWith({ width: 200, height: 150 });
    });

    it("should emit regionChange after loading", () => {
      const spy = vi.fn();
      component.regionChange.subscribe(spy);
      component.loadImageData(new ImageData(50, 50));
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("cropToImageData", () => {
    it("should throw when no source is loaded", () => {
      expect(() => component.cropToImageData()).toThrow("No image loaded");
    });

    it("should return an ImageData instance after loading", () => {
      component.loadImageData(new ImageData(100, 80));
      const result = component.cropToImageData();
      expect(result).toBeInstanceOf(ImageData);
    });
  });

  describe("canvas element", () => {
    it("should render a canvas in the template", () => {
      const canvas = fixture.nativeElement.querySelector("canvas");
      expect(canvas).toBeTruthy();
    });

    it("should set aria-label on the canvas", () => {
      const canvas = fixture.nativeElement.querySelector("canvas");
      expect(canvas.getAttribute("aria-label")).toBe("Image cropper");
    });

    it("should set role=img on the canvas", () => {
      const canvas = fixture.nativeElement.querySelector("canvas");
      expect(canvas.getAttribute("role")).toBe("img");
    });
  });
});
