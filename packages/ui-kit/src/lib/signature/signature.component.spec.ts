import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UISignature } from "./signature.component";
import type {
  SignatureImageValue,
  SignatureStrokeValue,
} from "./signature.types";

// ── Canvas stub ───────────────────────────────────────────────────────────────

function createMockCtx(): Record<string, unknown> {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillStyle: "",
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    drawImage: vi.fn(),
    scale: vi.fn(),
    lineCap: "round",
    lineJoin: "round",
    lineWidth: 1,
    strokeStyle: "",
    toDataURL: vi.fn(() => "data:image/png;base64,"),
  };
}

const sampleStrokes: SignatureStrokeValue = {
  kind: "strokes",
  strokes: [
    {
      points: [
        { x: 10, y: 10, time: 1000, pressure: 0.5 },
        { x: 20, y: 20, time: 1016, pressure: 0.6 },
        { x: 30, y: 15, time: 1032, pressure: 0.4 },
      ],
    },
  ],
  bounds: { width: 400, height: 200 },
};

const sampleImage: SignatureImageValue = {
  kind: "image",
  image: {
    mimeType: "image/png",
    dataUrl: "data:image/png;base64,abc123",
    width: 200,
    height: 100,
  },
};

describe("UISignature", () => {
  let fixture: ComponentFixture<UISignature>;
  let component: UISignature;

  beforeEach(async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      createMockCtx() as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(
      HTMLCanvasElement.prototype,
      "getBoundingClientRect",
    ).mockReturnValue({
      width: 400,
      height: 200,
      top: 0,
      left: 0,
      right: 400,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    await TestBed.configureTestingModule({
      imports: [UISignature],
    }).compileComponents();

    fixture = TestBed.createComponent(UISignature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default value to null", () => {
      expect(component.value()).toBeNull();
    });

    it("should default isEmpty to true", () => {
      expect(component.isEmpty()).toBe(true);
    });

    it("should default isStrokeBased to false", () => {
      expect(component.isStrokeBased()).toBe(false);
    });

    it("should default isImageBased to false", () => {
      expect(component.isImageBased()).toBe(false);
    });

    it("should default allowDraw to true", () => {
      expect(component.allowDraw()).toBe(true);
    });

    it("should default allowPaste to false", () => {
      expect(component.allowPaste()).toBe(false);
    });

    it("should default allowDrop to false", () => {
      expect(component.allowDrop()).toBe(false);
    });

    it("should default allowBrowse to false", () => {
      expect(component.allowBrowse()).toBe(false);
    });

    it("should default pressureEnabled to false", () => {
      expect(component.pressureEnabled()).toBe(false);
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it("should default readOnly to false", () => {
      expect(component.readOnly()).toBe(false);
    });
  });

  describe("host classes", () => {
    it("should apply empty class when no value", () => {
      expect(fixture.nativeElement.classList).toContain("empty");
    });

    it("should apply has-strokes class when value is stroke-based", () => {
      fixture.componentRef.setInput("value", sampleStrokes);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("has-strokes");
    });

    it("should apply has-image class when value is image-based", () => {
      fixture.componentRef.setInput("value", sampleImage);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("has-image");
    });

    it("should apply disabled class when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("disabled");
    });

    it("should apply readonly class when readOnly", () => {
      fixture.componentRef.setInput("readOnly", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("readonly");
    });
  });

  describe("value signals", () => {
    it("isEmpty should be false once value is set", () => {
      fixture.componentRef.setInput("value", sampleStrokes);
      fixture.detectChanges();
      expect(component.isEmpty()).toBe(false);
    });

    it("isStrokeBased should return true for stroke value", () => {
      fixture.componentRef.setInput("value", sampleStrokes);
      fixture.detectChanges();
      expect(component.isStrokeBased()).toBe(true);
    });

    it("isImageBased should return true for image value", () => {
      fixture.componentRef.setInput("value", sampleImage);
      fixture.detectChanges();
      expect(component.isImageBased()).toBe(true);
    });
  });

  describe("ControlValueAccessor", () => {
    it("writeValue should update the value signal", () => {
      component.writeValue(sampleStrokes);
      expect(component.value()).toEqual(sampleStrokes);
    });

    it("writeValue with null should clear the value", () => {
      component.writeValue(sampleStrokes);
      component.writeValue(null);
      expect(component.value()).toBeNull();
    });

    it("registerOnChange should store the callback", () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      // Trigger a clear which internally calls emitChange
      component.writeValue(sampleStrokes);
      component.clear();
      expect(fn).toHaveBeenCalledWith(null);
    });

    it("setDisabledState should update disabled state", () => {
      expect(component.disabled()).toBe(false);
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("disabled");
    });
  });

  describe("clear", () => {
    it("should set value to null", () => {
      component.writeValue(sampleStrokes);
      component.clear();
      expect(component.value()).toBeNull();
    });

    it("should emit cleared output", () => {
      const spy = vi.fn();
      component.cleared.subscribe(spy);
      component.writeValue(sampleStrokes);
      component.clear();
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should not clear when disabled", () => {
      component.writeValue(sampleStrokes);
      component.setDisabledState(true);
      component.clear();
      expect(component.value()).toEqual(sampleStrokes);
    });
  });

  describe("export", () => {
    it("canExport png should return true for stroke value", () => {
      component.writeValue(sampleStrokes);
      expect(component.canExport("png")).toBe(true);
    });

    it("canExport png should return true for image value", () => {
      component.writeValue(sampleImage);
      expect(component.canExport("png")).toBe(true);
    });

    it("canExport svg should return true for stroke value", () => {
      component.writeValue(sampleStrokes);
      expect(component.canExport("svg")).toBe(true);
    });

    it("canExport svg should return false for image value", () => {
      component.writeValue(sampleImage);
      expect(component.canExport("svg")).toBe(false);
    });

    it("canExport should return false when empty", () => {
      expect(component.canExport("png")).toBe(false);
      expect(component.canExport("svg")).toBe(false);
    });

    it("exportSvg should return null for image value", () => {
      component.writeValue(sampleImage);
      expect(component.exportSvg()).toBeNull();
    });

    it("exportSvg should return null when empty", () => {
      expect(component.exportSvg()).toBeNull();
    });

    it("exportSvg should return an SVG string for stroke value", () => {
      component.writeValue(sampleStrokes);
      const svg = component.exportSvg();
      expect(svg).not.toBeNull();
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
    });
  });

  describe("replay", () => {
    it("replay should not throw when called with stroke value", () => {
      component.writeValue(sampleStrokes);
      expect(() => component.replay()).not.toThrow();
    });

    it("replay should do nothing when value is image-based", () => {
      component.writeValue(sampleImage);
      expect(() => component.replay()).not.toThrow();
      // isReplaying is protected; verify via public isEmpty which stays false
      expect(component.isEmpty()).toBe(false);
    });

    it("replay should do nothing when field is empty", () => {
      expect(() => component.replay()).not.toThrow();
    });
  });
});
