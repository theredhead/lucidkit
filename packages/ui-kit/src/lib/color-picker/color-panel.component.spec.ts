import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, expect, it, beforeEach } from "vitest";

import { UIColorPanel } from "./color-panel.component";

describe("UIColorPanel", () => {
  let component: UIColorPanel;
  let fixture: ComponentFixture<UIColorPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIColorPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(UIColorPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // ── Defaults ────────────────────────────────────────────────

  describe("defaults", () => {
    it("should default currentValue to #0061a4", () => {
      expect(component.currentValue()).toBe("#0061a4");
    });

    it("should default initialMode to grid", () => {
      expect(component.initialMode()).toBe("grid");
    });

    it("should default activeMode to grid", () => {
      expect(component["activeMode"]()).toBe("grid");
    });
  });

  // ── Constructor initialization (deferred via microtask) ─────

  describe("constructor initialization", () => {
    it("should parse currentValue and set rgba after microtask", async () => {
      // Need a fresh fixture where the input is set before microtask fires
      const f2 = TestBed.createComponent(UIColorPanel);
      f2.componentRef.setInput("currentValue", "#ff0000");
      f2.detectChanges();
      // Wait for the constructor's queueMicrotask
      await new Promise((r) => setTimeout(r, 10));

      const rgba = f2.componentInstance["rgba"]();
      expect(rgba.r).toBe(255);
      expect(rgba.g).toBe(0);
      expect(rgba.b).toBe(0);
    });

    it("should set activeMode from initialMode after microtask", async () => {
      const f2 = TestBed.createComponent(UIColorPanel);
      f2.componentRef.setInput("initialMode", "rgba");
      f2.detectChanges();
      await new Promise((r) => setTimeout(r, 10));

      expect(f2.componentInstance["activeMode"]()).toBe("rgba");
    });
  });

  // ── Computed signals ────────────────────────────────────────

  describe("computed signals", () => {
    it("should compute hexValue from rgba", () => {
      component["rgba"].set({ r: 255, g: 0, b: 0, a: 1 });
      expect(component["hexValue"]()).toBe("#ff0000");
    });

    it("should compute previewCss from rgba", () => {
      component["rgba"].set({ r: 100, g: 200, b: 50, a: 0.5 });
      expect(component["previewCss"]()).toBe("rgba(100, 200, 50, 0.5)");
    });

    it("should compute hsla from rgba", () => {
      component["rgba"].set({ r: 255, g: 0, b: 0, a: 1 });
      const hsla = component["hsla"]();
      expect(hsla.h).toBe(0);
      expect(hsla.s).toBe(100);
      expect(hsla.l).toBe(50);
    });
  });

  // ── setMode ─────────────────────────────────────────────────

  describe("setMode", () => {
    it("should switch to specified mode", () => {
      component["setMode"]("named");
      expect(component["activeMode"]()).toBe("named");
    });

    it("should switch to hsla mode", () => {
      component["setMode"]("hsla");
      expect(component["activeMode"]()).toBe("hsla");
    });
  });

  // ── selectHex ───────────────────────────────────────────────

  describe("selectHex", () => {
    it("should update rgba from valid hex", () => {
      component["selectHex"]("#00ff00");
      const rgba = component["rgba"]();
      expect(rgba.r).toBe(0);
      expect(rgba.g).toBe(255);
      expect(rgba.b).toBe(0);
    });

    it("should update hexInput from valid hex", () => {
      component["selectHex"]("#abcdef");
      expect(component["hexInput"]()).toBe("#abcdef");
    });

    it("should not update rgba for invalid hex", () => {
      const before = component["rgba"]();
      component["selectHex"]("not-a-hex");
      expect(component["rgba"]()).toEqual(before);
    });
  });

  // ── apply / cancel ─────────────────────────────────────────

  describe("apply", () => {
    it("should emit the current hex value", () => {
      let emitted: string | undefined;
      component.valueSelected.subscribe((v) => (emitted = v));
      component["rgba"].set({ r: 255, g: 128, b: 0, a: 1 });
      component["apply"]();
      expect(emitted).toBe(component["hexValue"]());
    });
  });

  describe("cancel", () => {
    it("should emit closeRequested", () => {
      let closed = false;
      component.closeRequested.subscribe(() => (closed = true));
      component["cancel"]();
      expect(closed).toBe(true);
    });
  });

  // ── RGBA slider handlers ───────────────────────────────────

  describe("setRgbaChannel", () => {
    it("should update the red channel", () => {
      const event = { target: { value: "200" } } as unknown as Event;
      component["setRgbaChannel"]("r", event);
      expect(component["rgba"]().r).toBe(200);
    });

    it("should update the green channel", () => {
      const event = { target: { value: "128" } } as unknown as Event;
      component["setRgbaChannel"]("g", event);
      expect(component["rgba"]().g).toBe(128);
    });

    it("should update the blue channel", () => {
      const event = { target: { value: "50" } } as unknown as Event;
      component["setRgbaChannel"]("b", event);
      expect(component["rgba"]().b).toBe(50);
    });

    it("should sync hexInput after channel change", () => {
      component["rgba"].set({ r: 0, g: 0, b: 0, a: 1 });
      const event = { target: { value: "255" } } as unknown as Event;
      component["setRgbaChannel"]("r", event);
      expect(component["hexInput"]()).toBe("#ff0000");
    });
  });

  describe("setAlpha", () => {
    it("should set alpha as percentage / 100", () => {
      const event = { target: { value: "50" } } as unknown as Event;
      component["setAlpha"](event);
      expect(component["rgba"]().a).toBe(0.5);
    });
  });

  // ── HSLA slider handlers ───────────────────────────────────

  describe("setHslaChannel", () => {
    it("should update hue and convert back to rgba", () => {
      component["rgba"].set({ r: 255, g: 0, b: 0, a: 1 });
      const event = { target: { value: "120" } } as unknown as Event;
      component["setHslaChannel"]("h", event);
      // Hue 120 = green
      expect(component["rgba"]().g).toBeGreaterThan(0);
    });

    it("should update saturation", () => {
      component["rgba"].set({ r: 255, g: 0, b: 0, a: 1 });
      const event = { target: { value: "50" } } as unknown as Event;
      component["setHslaChannel"]("s", event);
      expect(component["hsla"]().s).toBe(50);
    });
  });

  describe("setHslaAlpha", () => {
    it("should set alpha from percentage", () => {
      const event = { target: { value: "75" } } as unknown as Event;
      component["setHslaAlpha"](event);
      expect(component["rgba"]().a).toBeCloseTo(0.75, 1);
    });
  });

  // ── Hex input handler ──────────────────────────────────────

  describe("onHexInput", () => {
    it("should update hexInput signal from input value", () => {
      const event = { target: { value: "#123abc" } } as unknown as Event;
      component["onHexInput"](event);
      expect(component["hexInput"]()).toBe("#123abc");
    });

    it("should update rgba for valid hex", () => {
      const event = { target: { value: "#00ff00" } } as unknown as Event;
      component["onHexInput"](event);
      expect(component["rgba"]().g).toBe(255);
    });

    it("should not update rgba for invalid hex", () => {
      const before = { ...component["rgba"]() };
      const event = { target: { value: "xyz" } } as unknown as Event;
      component["onHexInput"](event);
      expect(component["rgba"]().r).toBe(before.r);
    });
  });

  // ── Named color filter ─────────────────────────────────────

  describe("filteredNamedColors", () => {
    it("should return all named colors when filter is empty", () => {
      component["namedFilter"].set("");
      const all = component["filteredNamedColors"]();
      expect(all.length).toBeGreaterThan(0);
      expect(all).toBe(component["namedColors"]);
    });

    it("should filter by name", () => {
      component["namedFilter"].set("red");
      const filtered = component["filteredNamedColors"]();
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((c) => c.name.toLowerCase().includes("red") || c.hex.includes("red"))).toBe(true);
    });

    it("should filter by hex", () => {
      component["namedFilter"].set("#ff0000");
      const filtered = component["filteredNamedColors"]();
      expect(filtered.length).toBeGreaterThan(0);
    });
  });

  describe("onNamedFilterInput", () => {
    it("should update namedFilter signal", () => {
      const event = { target: { value: "blue" } } as unknown as Event;
      component["onNamedFilterInput"](event);
      expect(component["namedFilter"]()).toBe("blue");
    });
  });

  // ── Gradient helpers ───────────────────────────────────────

  describe("gradient helpers", () => {
    it("should return a red gradient string", () => {
      expect(component["rgbaRedGradient"]()).toContain("linear-gradient");
    });

    it("should return a green gradient string", () => {
      expect(component["rgbaGreenGradient"]()).toContain("linear-gradient");
    });

    it("should return a blue gradient string", () => {
      expect(component["rgbaBlueGradient"]()).toContain("linear-gradient");
    });

    it("should return an alpha gradient string", () => {
      expect(component["rgbaAlphaGradient"]()).toContain("linear-gradient");
    });

    it("should return a hue gradient string", () => {
      expect(component["hslaHueGradient"]()).toContain("linear-gradient");
    });

    it("should return a saturation gradient string", () => {
      expect(component["hslaSatGradient"]()).toContain("linear-gradient");
    });

    it("should return a lightness gradient string", () => {
      expect(component["hslaLightGradient"]()).toContain("linear-gradient");
    });

    it("should return an hsla alpha gradient string", () => {
      expect(component["hslaAlphaGradient"]()).toContain("linear-gradient");
    });
  });

  // ── Track-by helpers ───────────────────────────────────────

  describe("track-by helpers", () => {
    it("should return label for trackByLabel", () => {
      expect(component["trackByLabel"](0, { label: "foo" })).toBe("foo");
    });

    it("should return index for trackByIndex", () => {
      expect(component["trackByIndex"](5)).toBe(5);
    });
  });
});
