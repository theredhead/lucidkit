import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";

import { UIGauge } from "./gauge.component";
import type {
  GaugeRenderContext,
  GaugeRenderOutput,
  GaugeZone,
} from "./gauge.types";
import { GaugePresentationStrategy } from "./strategies/gauge-presentation-strategy";
import { AnalogGaugeStrategy } from "./strategies/analog-gauge.strategy";
import { VuMeterStrategy } from "./strategies/vu-meter.strategy";
import { DigitalGaugeStrategy } from "./strategies/digital-gauge.strategy";
import { LcdGaugeStrategy } from "./strategies/lcd-gauge.strategy";
import { BarGaugeStrategy } from "./strategies/bar-gauge.strategy";

/** Narrow a render output to SVG kind and return the element. */
function asSvg(output: GaugeRenderOutput): SVGSVGElement {
  if (output.kind !== "svg") {
    throw new Error(`Expected SVG output, got ${output.kind}`);
  }
  return output.element;
}

// ── Stub strategy ──────────────────────────────────────────────────

class StubStrategy extends GaugePresentationStrategy {
  public readonly name = "Stub";
  public lastCtx: GaugeRenderContext | undefined;
  public renderCount = 0;

  public render(ctx: GaugeRenderContext): GaugeRenderOutput {
    this.lastCtx = ctx;
    this.renderCount++;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    return { kind: "svg", element: svg };
  }
}

// ── UIGauge ────────────────────────────────────────────────────────

describe("UIGauge", () => {
  let fixture: ComponentFixture<UIGauge>;
  let component: UIGauge;
  let strategy: StubStrategy;

  beforeEach(async () => {
    strategy = new StubStrategy();

    await TestBed.configureTestingModule({
      imports: [UIGauge],
    }).compileComponents();

    fixture = TestBed.createComponent(UIGauge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("value", 50);
    fixture.componentRef.setInput("strategy", strategy);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have the ui-gauge host class", () => {
    expect(fixture.nativeElement.classList).toContain("ui-gauge");
  });

  describe("defaults", () => {
    it("should default min to 0", () => {
      expect(component.min()).toBe(0);
    });

    it("should default max to 100", () => {
      expect(component.max()).toBe(100);
    });

    it("should default unit to empty string", () => {
      expect(component.unit()).toBe("");
    });

    it("should default width to 200", () => {
      expect(component.width()).toBe(200);
    });

    it("should default height to 200", () => {
      expect(component.height()).toBe(200);
    });

    it("should default zones to empty array", () => {
      expect(component.zones()).toEqual([]);
    });

    it("should default ariaLabel to 'Gauge'", () => {
      expect(component.ariaLabel()).toBe("Gauge");
    });

    it("should default detailLevel to 'high'", () => {
      expect(component.detailLevel()).toBe("high");
    });

    it("should default thresholds to empty array", () => {
      expect(component.thresholds()).toEqual([]);
    });
  });

  describe("value clamping", () => {
    it("should clamp value above max", () => {
      fixture.componentRef.setInput("value", 150);
      fixture.detectChanges();
      expect(strategy.lastCtx!.value).toBe(100);
    });

    it("should clamp value below min", () => {
      fixture.componentRef.setInput("value", -10);
      fixture.detectChanges();
      expect(strategy.lastCtx!.value).toBe(0);
    });

    it("should pass through a value within range", () => {
      fixture.componentRef.setInput("value", 42);
      fixture.detectChanges();
      expect(strategy.lastCtx!.value).toBe(42);
    });
  });

  describe("rendering", () => {
    it("should insert an SVG into the container", () => {
      const container = fixture.nativeElement.querySelector(".viewport");
      expect(container.querySelector("svg")).toBeTruthy();
    });

    it("should pass zones to the strategy", () => {
      const zones: GaugeZone[] = [
        { from: 0, to: 60, color: "green" },
        { from: 60, to: 100, color: "red" },
      ];
      fixture.componentRef.setInput("zones", zones);
      fixture.detectChanges();
      expect(strategy.lastCtx!.zones).toEqual(zones);
    });

    it("should pass unit to the strategy", () => {
      fixture.componentRef.setInput("unit", "rpm");
      fixture.detectChanges();
      expect(strategy.lastCtx!.unit).toBe("rpm");
    });

    it("should pass detailLevel to the strategy", () => {
      fixture.componentRef.setInput("detailLevel", "low");
      fixture.detectChanges();
      expect(strategy.lastCtx!.detailLevel).toBe("low");
    });

    it("should pass size to the strategy", () => {
      fixture.componentRef.setInput("width", 300);
      fixture.componentRef.setInput("height", 250);
      fixture.detectChanges();
      expect(strategy.lastCtx!.size).toEqual({ width: 300, height: 250 });
    });

    it("should pass thresholds to the strategy", () => {
      fixture.componentRef.setInput("thresholds", [25, 75]);
      fixture.detectChanges();
      expect(strategy.lastCtx!.thresholds).toEqual([25, 75]);
    });
  });

  describe("accessibility", () => {
    it("should have role=meter on the viewport", () => {
      const el = fixture.nativeElement.querySelector(".viewport");
      expect(el.getAttribute("role")).toBe("meter");
    });

    it("should set aria-valuenow", () => {
      fixture.componentRef.setInput("value", 75);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(".viewport");
      expect(el.getAttribute("aria-valuenow")).toBe("75");
    });

    it("should set aria-valuemin and aria-valuemax", () => {
      const el = fixture.nativeElement.querySelector(".viewport");
      expect(el.getAttribute("aria-valuemin")).toBe("0");
      expect(el.getAttribute("aria-valuemax")).toBe("100");
    });
  });

  describe("animation inputs", () => {
    it("should default animated to false", () => {
      expect(component.animated()).toBe(false);
    });

    it("should default animationDuration to 300", () => {
      expect(component.animationDuration()).toBe(300);
    });

    it("should pass value immediately when not animated", () => {
      fixture.componentRef.setInput("value", 75);
      fixture.detectChanges();
      expect(strategy.lastCtx!.value).toBe(75);
    });
  });

  describe("formatValue", () => {
    it("should default formatValue to undefined", () => {
      expect(component.formatValue()).toBeUndefined();
    });

    it("should pass formatValue through the render context", () => {
      const fmt = (n: number): string => `$${n.toFixed(2)}`;
      fixture.componentRef.setInput("formatValue", fmt);
      fixture.detectChanges();
      expect(strategy.lastCtx!.formatValue).toBe(fmt);
    });

    it("should pass undefined formatValue when not set", () => {
      fixture.detectChanges();
      expect(strategy.lastCtx!.formatValue).toBeUndefined();
    });
  });

  describe("fit mode", () => {
    it("should default fit to false", () => {
      expect(component.fit()).toBe(false);
    });

    it("should not add fit class when fit is false", () => {
      expect(fixture.nativeElement.classList).not.toContain("fit");
    });

    it("should add fit host class when fit is true", () => {
      fixture.componentRef.setInput("fit", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("fit");
    });

    it("should remove inline width/height on viewport when fit is true", () => {
      fixture.componentRef.setInput("fit", true);
      fixture.detectChanges();
      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.style.width).toBe("");
      expect(viewport.style.height).toBe("");
    });

    it("should set inline width/height on viewport when fit is false", () => {
      fixture.componentRef.setInput("fit", false);
      fixture.componentRef.setInput("width", 300);
      fixture.componentRef.setInput("height", 250);
      fixture.detectChanges();
      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.style.width).toBe("300px");
      expect(viewport.style.height).toBe("250px");
    });

    it("should fall back to width/height inputs when fit is true but no observation yet", () => {
      fixture.componentRef.setInput("fit", true);
      fixture.componentRef.setInput("width", 400);
      fixture.componentRef.setInput("height", 300);
      fixture.detectChanges();
      // No ResizeObserver callback yet → uses input fallback
      expect(strategy.lastCtx!.size).toEqual({ width: 400, height: 300 });
    });
  });

  describe("animation", () => {
    it("should call requestAnimationFrame when animated value changes", () => {
      const rafSpy = vi.spyOn(globalThis, "requestAnimationFrame");

      fixture.componentRef.setInput("animated", true);
      fixture.componentRef.setInput("value", 20);
      fixture.detectChanges();

      rafSpy.mockClear();

      // Change value — should trigger animation
      fixture.componentRef.setInput("value", 80);
      fixture.detectChanges();

      expect(rafSpy).toHaveBeenCalled();

      rafSpy.mockRestore();
    });

    it("should not animate when fromValue equals targetValue", () => {
      const rafSpy = vi.spyOn(globalThis, "requestAnimationFrame");

      fixture.componentRef.setInput("animated", true);
      fixture.componentRef.setInput("value", 50);
      fixture.detectChanges();

      rafSpy.mockClear();

      // Same value — should NOT trigger animation
      fixture.componentRef.setInput("value", 50);
      fixture.detectChanges();

      expect(rafSpy).not.toHaveBeenCalled();
      expect(strategy.lastCtx!.value).toBe(50);

      rafSpy.mockRestore();
    });

    it("should cancel running animation when value changes again", () => {
      const cancelSpy = vi.spyOn(globalThis, "cancelAnimationFrame");

      fixture.componentRef.setInput("animated", true);
      fixture.componentRef.setInput("value", 20);
      fixture.detectChanges();

      cancelSpy.mockClear();

      fixture.componentRef.setInput("value", 80);
      fixture.detectChanges();

      // cancelAnimationFrame is called to cancel prior animation
      expect(cancelSpy).toHaveBeenCalled();

      cancelSpy.mockRestore();
    });
  });

  describe("imagedata rendering", () => {
    it("should render imagedata output to a canvas", () => {
      // Mock canvas.getContext to provide putImageData
      const putSpy = vi.fn();
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
        putImageData: putSpy,
      }) as never;

      const imageStrategy = new ImageDataStubStrategy();
      fixture.componentRef.setInput("strategy", imageStrategy);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(".viewport");
      const canvas = container?.querySelector("canvas");
      expect(canvas).toBeTruthy();
      expect(canvas?.width).toBe(100);
      expect(canvas?.height).toBe(100);
      expect(putSpy).toHaveBeenCalled();

      HTMLCanvasElement.prototype.getContext = origGetContext;
    });
  });

  describe("resolveTokens", () => {
    it("should provide fallback token values when CSS vars are empty", () => {
      fixture.componentRef.setInput("value", 42);
      fixture.detectChanges();

      // jsdom doesn't resolve CSS vars, so fallbacks kick in
      const tokens = strategy.lastCtx!.tokens;
      expect(tokens.text).toBe("#555");
      expect(tokens.face).toBe("#e8eaed");
      expect(tokens.needle).toBe("#ea4335");
      expect(tokens.tick).toBe("#888");
      expect(tokens.accent).toBe("#4285f4");
    });
  });
});

/** Strategy that returns ImageData output for testing the imagedata branch. */
class ImageDataStubStrategy extends GaugePresentationStrategy {
  public readonly name = "ImageDataStub";

  public render(_ctx: GaugeRenderContext): GaugeRenderOutput {
    // jsdom doesn't have ImageData — create a minimal duck-typed stand-in
    const data = {
      width: 100,
      height: 100,
      data: new Uint8ClampedArray(100 * 100 * 4),
    } as unknown as ImageData;
    return { kind: "imagedata", data };
  }
}

// ── AnalogGaugeStrategy ────────────────────────────────────────────

describe("AnalogGaugeStrategy", () => {
  it("should produce an SVG output", () => {
    const strategy = new AnalogGaugeStrategy();
    const output = strategy.render(createCtx(60));
    expect(output.kind).toBe("svg");
    expect(asSvg(output)).toBeInstanceOf(SVGSVGElement);
  });

  it("should have name 'Analog'", () => {
    expect(new AnalogGaugeStrategy().name).toBe("Analog");
  });

  it("should render tick marks", () => {
    const strategy = new AnalogGaugeStrategy({ majorTicks: 5, minorTicks: 2 });
    const svg = asSvg(strategy.render(createCtx(50)));
    const lines = svg.querySelectorAll("line");
    expect(lines.length).toBeGreaterThan(0);
  });

  it("should render the needle", () => {
    const svg = asSvg(new AnalogGaugeStrategy().render(createCtx(75)));
    const polygons = svg.querySelectorAll("polygon");
    expect(polygons.length).toBe(1);
  });

  it("should render zone arcs when zones are provided", () => {
    const ctx = createCtx(50, {
      zones: [
        { from: 0, to: 50, color: "green" },
        { from: 50, to: 100, color: "red" },
      ],
    });
    const svg = asSvg(new AnalogGaugeStrategy().render(ctx));
    const paths = svg.querySelectorAll("path");
    // 1 background arc + 2 zone arcs
    expect(paths.length).toBe(3);
  });

  describe("zone labels", () => {
    it("should render zone labels at high detail when label is set", () => {
      const ctx = createCtx(50, {
        zones: [
          { from: 0, to: 50, color: "green", label: "Safe" },
          { from: 50, to: 100, color: "red", label: "Danger" },
        ],
        detailLevel: "high",
      });
      const svg = asSvg(new AnalogGaugeStrategy().render(ctx));
      const labels = Array.from(svg.querySelectorAll(".zone-label"));
      expect(labels.length).toBe(2);
      expect(labels[0].textContent).toBe("Safe");
      expect(labels[1].textContent).toBe("Danger");
    });

    it("should not render zone labels at medium detail", () => {
      const ctx = createCtx(50, {
        zones: [{ from: 0, to: 50, color: "green", label: "Safe" }],
        detailLevel: "medium",
      });
      const svg = asSvg(new AnalogGaugeStrategy().render(ctx));
      expect(svg.querySelectorAll(".zone-label").length).toBe(0);
    });

    it("should skip zones without a label", () => {
      const ctx = createCtx(50, {
        zones: [
          { from: 0, to: 50, color: "green", label: "Safe" },
          { from: 50, to: 100, color: "red" },
        ],
        detailLevel: "high",
      });
      const svg = asSvg(new AnalogGaugeStrategy().render(ctx));
      expect(svg.querySelectorAll(".zone-label").length).toBe(1);
    });
  });

  describe("threshold markers", () => {
    it("should render threshold marker lines", () => {
      const ctx = createCtx(50, {
        thresholds: [25, 75],
      });
      const svg = asSvg(new AnalogGaugeStrategy().render(ctx));
      const markers = svg.querySelectorAll(".threshold-marker");
      expect(markers.length).toBe(2);
    });

    it("should skip thresholds outside min/max range", () => {
      const ctx = createCtx(50, {
        thresholds: [-10, 50, 200],
      });
      const svg = asSvg(new AnalogGaugeStrategy().render(ctx));
      const markers = svg.querySelectorAll(".threshold-marker");
      expect(markers.length).toBe(1);
    });

    it("should use dashed stroke for threshold markers", () => {
      const ctx = createCtx(50, {
        thresholds: [50],
      });
      const svg = asSvg(new AnalogGaugeStrategy().render(ctx));
      const marker = svg.querySelector(".threshold-marker") as SVGLineElement;
      expect(marker.getAttribute("stroke-dasharray")).toBe("4,2");
    });

    it("should render no markers when thresholds is empty", () => {
      const ctx = createCtx(50, { thresholds: [] });
      const svg = asSvg(new AnalogGaugeStrategy().render(ctx));
      expect(svg.querySelectorAll(".threshold-marker").length).toBe(0);
    });
  });

  describe("detailLevel", () => {
    it("should omit tick marks at low detail", () => {
      const svg = asSvg(
        new AnalogGaugeStrategy().render(createCtx(50, { detailLevel: "low" })),
      );
      expect(svg.querySelectorAll("line").length).toBe(0);
    });

    it("should render ticks but omit numeric labels at medium detail", () => {
      const strategy = new AnalogGaugeStrategy({
        majorTicks: 5,
        minorTicks: 2,
      });
      const svgHigh = asSvg(
        strategy.render(createCtx(50, { detailLevel: "high" })),
      );
      const svgMed = asSvg(
        strategy.render(createCtx(50, { detailLevel: "medium" })),
      );
      // Both should have ticks
      expect(svgMed.querySelectorAll("line").length).toBeGreaterThan(0);
      // Medium should have fewer text elements (no tick labels)
      expect(svgMed.querySelectorAll("text").length).toBeLessThan(
        svgHigh.querySelectorAll("text").length,
      );
    });
  });

  describe("formatValue", () => {
    it("should use custom formatter for value readout", () => {
      const fmt = (n: number): string => `$${n.toFixed(2)}`;
      const svg = asSvg(
        new AnalogGaugeStrategy().render(createCtx(72.5, { formatValue: fmt })),
      );
      const texts = Array.from(svg.querySelectorAll("text")).map(
        (t: SVGTextElement) => t.textContent,
      );
      expect(texts).toContain("$72.50");
    });

    it("should use custom formatter for tick labels", () => {
      const fmt = (n: number): string => `${n}%`;
      const svg = asSvg(
        new AnalogGaugeStrategy({ majorTicks: 5 }).render(
          createCtx(50, { formatValue: fmt }),
        ),
      );
      const texts = Array.from(svg.querySelectorAll("text")).map(
        (t: SVGTextElement) => t.textContent,
      );
      expect(texts).toContain("0%");
      expect(texts).toContain("100%");
    });
  });

  describe("sweepDegrees", () => {
    it("should render a 180° semicircle gauge", () => {
      const strategy = new AnalogGaugeStrategy({ sweepDegrees: 180 });
      const svg = asSvg(strategy.render(createCtx(50)));
      expect(svg).toBeInstanceOf(SVGSVGElement);
      // Should still have needle and background arc
      expect(svg.querySelectorAll("polygon").length).toBe(1);
      expect(svg.querySelectorAll("path").length).toBeGreaterThanOrEqual(1);
    });

    it("should render tick marks on a semicircle", () => {
      const strategy = new AnalogGaugeStrategy({
        sweepDegrees: 180,
        majorTicks: 5,
        minorTicks: 2,
      });
      const svg = asSvg(strategy.render(createCtx(50)));
      expect(svg.querySelectorAll("line").length).toBeGreaterThan(0);
    });

    it("should clamp sweep to 30..360 range", () => {
      const tooSmall = new AnalogGaugeStrategy({ sweepDegrees: 10 });
      const tooLarge = new AnalogGaugeStrategy({ sweepDegrees: 400 });
      // Both should render without error
      expect(asSvg(tooSmall.render(createCtx(50)))).toBeInstanceOf(
        SVGSVGElement,
      );
      expect(asSvg(tooLarge.render(createCtx(50)))).toBeInstanceOf(
        SVGSVGElement,
      );
    });

    it("should default to 270° sweep", () => {
      const defaultStrategy = new AnalogGaugeStrategy();
      const explicit270 = new AnalogGaugeStrategy({ sweepDegrees: 270 });
      const svgDefault = asSvg(defaultStrategy.render(createCtx(50)));
      const svg270 = asSvg(explicit270.render(createCtx(50)));
      // Both should produce the same number of elements
      expect(svgDefault.querySelectorAll("*").length).toBe(
        svg270.querySelectorAll("*").length,
      );
    });
  });
});

// ── VuMeterStrategy ────────────────────────────────────────────────

describe("VuMeterStrategy", () => {
  it("should produce an SVG output", () => {
    const strategy = new VuMeterStrategy();
    const output = strategy.render(createCtx(40));
    expect(output.kind).toBe("svg");
  });

  it("should have name 'VU Meter'", () => {
    expect(new VuMeterStrategy().name).toBe("VU Meter");
  });

  it("should render the correct number of segments", () => {
    const strategy = new VuMeterStrategy({ segments: 15 });
    const svg = asSvg(strategy.render(createCtx(50)));
    const rects = svg.querySelectorAll("rect");
    expect(rects.length).toBe(15);
  });

  it("should render lit and dim segments", () => {
    const strategy = new VuMeterStrategy({ segments: 10 });
    const svg = asSvg(strategy.render(createCtx(50)));
    const rects = svg.querySelectorAll("rect");
    const opacities = Array.from(rects).map((r: SVGRectElement) =>
      parseFloat(r.getAttribute("opacity") ?? "1"),
    );
    const litCount = opacities.filter((o) => o === 1).length;
    const dimCount = opacities.filter((o) => o < 1).length;
    expect(litCount).toBeGreaterThan(0);
    expect(dimCount).toBeGreaterThan(0);
  });

  describe("detailLevel", () => {
    it("should omit scale labels and value readout at low detail", () => {
      const svg = asSvg(
        new VuMeterStrategy().render(createCtx(50, { detailLevel: "low" })),
      );
      expect(svg.querySelectorAll("text").length).toBe(0);
    });

    it("should show value readout but omit scale labels at medium detail", () => {
      const svgHigh = asSvg(
        new VuMeterStrategy().render(createCtx(50, { detailLevel: "high" })),
      );
      const svgMed = asSvg(
        new VuMeterStrategy().render(createCtx(50, { detailLevel: "medium" })),
      );
      // Medium has value readout only (1 text), high has scale labels + readout
      expect(svgMed.querySelectorAll("text").length).toBeLessThan(
        svgHigh.querySelectorAll("text").length,
      );
    });
  });

  describe("formatValue", () => {
    it("should use custom formatter for value readout", () => {
      const fmt = (n: number): string => `${n.toFixed(0)} dB`;
      const svg = asSvg(
        new VuMeterStrategy().render(
          createCtx(65, { formatValue: fmt, unit: "" }),
        ),
      );
      const texts = Array.from(svg.querySelectorAll("text")).map(
        (t: SVGTextElement) => t.textContent,
      );
      expect(texts).toContain("65 dB");
    });
  });
});

// ── DigitalGaugeStrategy ───────────────────────────────────────────

describe("DigitalGaugeStrategy", () => {
  it("should produce an SVG output", () => {
    const strategy = new DigitalGaugeStrategy();
    const output = strategy.render(createCtx(88.5));
    expect(output.kind).toBe("svg");
  });

  it("should have name 'Digital'", () => {
    expect(new DigitalGaugeStrategy().name).toBe("Digital");
  });

  it("should display the value as text", () => {
    const svg = asSvg(
      new DigitalGaugeStrategy({ decimals: 1 }).render(createCtx(42.3)),
    );
    const texts = svg.querySelectorAll("text");
    const values = Array.from(texts).map((t: SVGTextElement) => t.textContent);
    expect(values).toContain("42.3");
  });

  it("should display the unit label", () => {
    const ctx = createCtx(55, { unit: "dB" });
    const svg = asSvg(new DigitalGaugeStrategy().render(ctx));
    const texts = Array.from(svg.querySelectorAll("text")).map(
      (t: SVGTextElement) => t.textContent,
    );
    expect(texts).toContain("dB");
  });

  it("should render the progress bar", () => {
    const svg = asSvg(new DigitalGaugeStrategy().render(createCtx(75)));
    // 1 background panel + 1 track + 1 fill = 3 rects
    const rects = svg.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThanOrEqual(3);
  });

  describe("detailLevel", () => {
    it("should omit unit and progress bar at low detail", () => {
      const svg = asSvg(
        new DigitalGaugeStrategy().render(
          createCtx(42, { unit: "dB", detailLevel: "low" }),
        ),
      );
      // Only background panel rect, no progress bar rects
      expect(svg.querySelectorAll("rect").length).toBe(1);
      // Only the value text, no unit label
      expect(svg.querySelectorAll("text").length).toBe(1);
    });

    it("should show value and unit but omit progress bar at medium detail", () => {
      const svg = asSvg(
        new DigitalGaugeStrategy().render(
          createCtx(42, { unit: "dB", detailLevel: "medium" }),
        ),
      );
      // Background panel only
      expect(svg.querySelectorAll("rect").length).toBe(1);
      // Value + unit label
      expect(svg.querySelectorAll("text").length).toBe(2);
    });
  });

  describe("formatValue", () => {
    it("should use custom formatter for the main readout", () => {
      const fmt = (n: number): string => `$${n.toFixed(2)}`;
      const svg = asSvg(
        new DigitalGaugeStrategy().render(createCtx(42, { formatValue: fmt })),
      );
      const texts = Array.from(svg.querySelectorAll("text")).map(
        (t: SVGTextElement) => t.textContent,
      );
      expect(texts).toContain("$42.00");
    });

    it("should use custom formatter for min/max labels", () => {
      const fmt = (n: number): string => `${n}%`;
      const svg = asSvg(
        new DigitalGaugeStrategy().render(
          createCtx(50, { formatValue: fmt, detailLevel: "high" }),
        ),
      );
      const texts = Array.from(svg.querySelectorAll("text")).map(
        (t: SVGTextElement) => t.textContent,
      );
      expect(texts).toContain("0%");
      expect(texts).toContain("100%");
    });
  });
});

// ── LcdGaugeStrategy ────────────────────────────────────────────────────────

describe("LcdGaugeStrategy", () => {
  it("should produce an SVG output", () => {
    const strategy = new LcdGaugeStrategy();
    const output = strategy.render(createCtx(42.5));
    expect(output.kind).toBe("svg");
    expect(asSvg(output)).toBeInstanceOf(SVGSVGElement);
  });

  it("should have name 'LCD'", () => {
    expect(new LcdGaugeStrategy().name).toBe("LCD");
  });

  it("should render seven-segment polygons for each digit", () => {
    const svg = asSvg(
      new LcdGaugeStrategy({ decimals: 0, digitCount: 3 }).render(
        createCtx(42),
      ),
    );
    const polygons = svg.querySelectorAll("polygon");
    // Each of 3 digit cells renders 7 segments (ghost + active) = 21 polygons
    // Leading space is skipped, so "_42" = 2 visible digits × 7 = 14
    expect(polygons.length).toBeGreaterThan(0);
    expect(polygons.length % 7).toBe(0);
  });

  it("should render a decimal point as a rect", () => {
    const svg = asSvg(
      new LcdGaugeStrategy({ decimals: 1, digitCount: 4 }).render(
        createCtx(3.5),
      ),
    );
    // Background panel + decimal dot = at least 2 rects
    expect(svg.querySelectorAll("rect").length).toBeGreaterThanOrEqual(2);
  });

  it("should display unit label at high detail", () => {
    const svg = asSvg(
      new LcdGaugeStrategy().render(createCtx(10, { unit: "V" })),
    );
    const texts = Array.from(svg.querySelectorAll("text")).map(
      (t: SVGTextElement) => t.textContent,
    );
    expect(texts).toContain("V");
  });

  it("should display min/max labels at high detail", () => {
    const svg = asSvg(
      new LcdGaugeStrategy().render(createCtx(50, { min: 0, max: 100 })),
    );
    const texts = Array.from(svg.querySelectorAll("text")).map(
      (t: SVGTextElement) => t.textContent,
    );
    expect(texts).toContain("0");
    expect(texts).toContain("100");
  });

  describe("detailLevel", () => {
    it("should omit unit and min/max at low detail", () => {
      const svg = asSvg(
        new LcdGaugeStrategy().render(
          createCtx(42, { unit: "V", detailLevel: "low" }),
        ),
      );
      expect(svg.querySelectorAll("text").length).toBe(0);
    });

    it("should show unit but omit min/max at medium detail", () => {
      const svg = asSvg(
        new LcdGaugeStrategy().render(
          createCtx(42, { unit: "V", detailLevel: "medium" }),
        ),
      );
      // Only unit label
      expect(svg.querySelectorAll("text").length).toBe(1);
    });
  });

  describe("formatValue", () => {
    it("should use custom formatter for min/max labels", () => {
      const fmt = (n: number): string => `${n}V`;
      const svg = asSvg(
        new LcdGaugeStrategy().render(
          createCtx(50, { formatValue: fmt, detailLevel: "high" }),
        ),
      );
      const texts = Array.from(svg.querySelectorAll("text")).map(
        (t: SVGTextElement) => t.textContent,
      );
      expect(texts).toContain("0V");
      expect(texts).toContain("100V");
    });
  });
});

// ── BarGaugeStrategy ───────────────────────────────────────────────

describe("BarGaugeStrategy", () => {
  it("should produce an SVG output", () => {
    const output = new BarGaugeStrategy().render(createCtx(60));
    expect(output.kind).toBe("svg");
    expect(asSvg(output)).toBeInstanceOf(SVGSVGElement);
  });

  it("should have name 'Bar'", () => {
    expect(new BarGaugeStrategy().name).toBe("Bar");
  });

  it("should render the track background", () => {
    const svg = asSvg(new BarGaugeStrategy().render(createCtx(50)));
    const rects = svg.querySelectorAll("rect");
    // At least track background + fill
    expect(rects.length).toBeGreaterThanOrEqual(2);
  });

  it("should render tick marks at high detail", () => {
    const svg = asSvg(
      new BarGaugeStrategy({ ticks: 5 }).render(
        createCtx(50, { detailLevel: "high" }),
      ),
    );
    const lines = svg.querySelectorAll("line");
    // 5 ticks + 1 (0th) = 6
    expect(lines.length).toBe(6);
  });

  it("should render tick labels at high detail", () => {
    const svg = asSvg(
      new BarGaugeStrategy({ ticks: 5 }).render(
        createCtx(50, { detailLevel: "high" }),
      ),
    );
    // Tick labels + value readout
    const texts = svg.querySelectorAll("text");
    expect(texts.length).toBe(7); // 6 tick labels + 1 value
  });

  it("should omit tick labels at medium detail", () => {
    const svgHigh = asSvg(
      new BarGaugeStrategy({ ticks: 5 }).render(
        createCtx(50, { detailLevel: "high" }),
      ),
    );
    const svgMed = asSvg(
      new BarGaugeStrategy({ ticks: 5 }).render(
        createCtx(50, { detailLevel: "medium" }),
      ),
    );
    expect(svgMed.querySelectorAll("text").length).toBeLessThan(
      svgHigh.querySelectorAll("text").length,
    );
  });

  it("should omit ticks and value at low detail", () => {
    const svg = asSvg(
      new BarGaugeStrategy().render(createCtx(50, { detailLevel: "low" })),
    );
    expect(svg.querySelectorAll("line").length).toBe(0);
    expect(svg.querySelectorAll("text").length).toBe(0);
  });

  it("should render zone backgrounds when zones are provided", () => {
    const ctx = createCtx(50, {
      zones: [
        { from: 0, to: 50, color: "green" },
        { from: 50, to: 100, color: "red" },
      ],
    });
    const svg = asSvg(new BarGaugeStrategy().render(ctx));
    // Zone rects have opacity 0.25
    const zoneRects = Array.from(svg.querySelectorAll("rect")).filter(
      (r) => r.getAttribute("opacity") === "0.25",
    );
    expect(zoneRects.length).toBe(2);
  });

  describe("zone labels", () => {
    it("should render zone labels at high detail when label is set", () => {
      const ctx = createCtx(50, {
        zones: [
          { from: 0, to: 50, color: "green", label: "OK" },
          { from: 50, to: 100, color: "red", label: "Hot" },
        ],
        detailLevel: "high",
      });
      const svg = asSvg(new BarGaugeStrategy().render(ctx));
      const labels = Array.from(svg.querySelectorAll(".zone-label"));
      expect(labels.length).toBe(2);
      expect(labels[0].textContent).toBe("OK");
      expect(labels[1].textContent).toBe("Hot");
    });

    it("should not render zone labels at medium detail", () => {
      const ctx = createCtx(50, {
        zones: [{ from: 0, to: 50, color: "green", label: "OK" }],
        detailLevel: "medium",
      });
      const svg = asSvg(new BarGaugeStrategy().render(ctx));
      expect(svg.querySelectorAll(".zone-label").length).toBe(0);
    });

    it("should skip zones without a label", () => {
      const ctx = createCtx(50, {
        zones: [
          { from: 0, to: 50, color: "green", label: "OK" },
          { from: 50, to: 100, color: "red" },
        ],
        detailLevel: "high",
      });
      const svg = asSvg(new BarGaugeStrategy().render(ctx));
      expect(svg.querySelectorAll(".zone-label").length).toBe(1);
    });
  });

  describe("threshold markers", () => {
    it("should render threshold marker lines", () => {
      const ctx = createCtx(50, {
        thresholds: [25, 75],
      });
      const svg = asSvg(new BarGaugeStrategy().render(ctx));
      const markers = svg.querySelectorAll(".threshold-marker");
      expect(markers.length).toBe(2);
    });

    it("should skip thresholds outside min/max range", () => {
      const ctx = createCtx(50, {
        thresholds: [-5, 50, 150],
      });
      const svg = asSvg(new BarGaugeStrategy().render(ctx));
      expect(svg.querySelectorAll(".threshold-marker").length).toBe(1);
    });

    it("should render no markers when thresholds is empty", () => {
      const ctx = createCtx(50, { thresholds: [] });
      const svg = asSvg(new BarGaugeStrategy().render(ctx));
      expect(svg.querySelectorAll(".threshold-marker").length).toBe(0);
    });
  });

  it("should render no fill when value equals min", () => {
    const svg = asSvg(new BarGaugeStrategy().render(createCtx(0)));
    // Only the track background rect (no fill rect since width=0 is skipped)
    const rects = svg.querySelectorAll("rect");
    expect(rects.length).toBe(1);
  });

  it("should accept custom options", () => {
    const strategy = new BarGaugeStrategy({
      ticks: 10,
      borderRadius: 8,
      trackHeight: 24,
    });
    const svg = asSvg(strategy.render(createCtx(75)));
    expect(svg).toBeInstanceOf(SVGSVGElement);
    // 10 ticks + 1 (0th) = 11 lines
    expect(svg.querySelectorAll("line").length).toBe(11);
  });

  it("should hide ticks when ticks is 0", () => {
    const svg = asSvg(new BarGaugeStrategy({ ticks: 0 }).render(createCtx(50)));
    expect(svg.querySelectorAll("line").length).toBe(0);
  });

  describe("formatValue", () => {
    it("should use custom formatter for value readout", () => {
      const fmt = (n: number): string => `${n.toFixed(1)}%`;
      const svg = asSvg(
        new BarGaugeStrategy().render(
          createCtx(65, { formatValue: fmt, unit: "" }),
        ),
      );
      const texts = Array.from(svg.querySelectorAll("text")).map(
        (t: SVGTextElement) => t.textContent,
      );
      expect(texts).toContain("65.0%");
    });

    it("should use custom formatter for tick labels", () => {
      const fmt = (n: number): string => `$${n}`;
      const svg = asSvg(
        new BarGaugeStrategy({ ticks: 5 }).render(
          createCtx(50, { formatValue: fmt, detailLevel: "high" }),
        ),
      );
      const texts = Array.from(svg.querySelectorAll("text")).map(
        (t: SVGTextElement) => t.textContent,
      );
      expect(texts).toContain("$0");
      expect(texts).toContain("$100");
    });
  });
});

// ── Helper ─────────────────────────────────────────────────────────

function createCtx(
  value: number,
  overrides: Partial<GaugeRenderContext> = {},
): GaugeRenderContext {
  return {
    value,
    min: 0,
    max: 100,
    unit: "",
    zones: [],
    detailLevel: "high",
    size: { width: 200, height: 200 },
    tokens: {
      text: "#555",
      face: "#e8eaed",
      needle: "#ea4335",
      tick: "#888",
      accent: "#4285f4",
    },
    ...overrides,
  };
}
