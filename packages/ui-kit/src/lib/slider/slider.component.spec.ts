import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UISlider } from "./slider.component";
import type { SliderValue } from "./slider.types";

@Component({
  standalone: true,
  imports: [UISlider],
  template: `
    <ui-slider
      [mode]="mode()"
      [(value)]="value"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [disabled]="disabled()"
      [showValue]="showValue()"
    />
  `,
})
class TestHost {
  public readonly mode = signal<"single" | "range">("single");
  public readonly value = signal<SliderValue>(50);
  public readonly min = signal(0);
  public readonly max = signal(100);
  public readonly step = signal(1);
  public readonly disabled = signal(false);
  public readonly showValue = signal(false);
}

describe("UISlider", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.nativeElement.querySelector("ui-slider")).toBeTruthy();
  });

  it("should have ui-slider host class", () => {
    expect(
      fixture.nativeElement.querySelector("ui-slider").classList,
    ).toContain("ui-slider");
  });

  describe("single mode", () => {
    it("should render one input", () => {
      const inputs =
        fixture.nativeElement.querySelectorAll("input[type=range]");
      expect(inputs.length).toBe(1);
    });

    it("should apply single mode class", () => {
      expect(
        fixture.nativeElement.querySelector("ui-slider").classList,
      ).toContain("ui-slider--single");
    });

    it("should set input value", () => {
      const input = fixture.nativeElement.querySelector("input[type=range]");
      expect(input.value).toBe("50");
    });

    it("should set min/max/step", () => {
      const input = fixture.nativeElement.querySelector("input[type=range]");
      expect(input.min).toBe("0");
      expect(input.max).toBe("100");
      expect(input.step).toBe("1");
    });

    it("should update value on input event", () => {
      const input = fixture.nativeElement.querySelector(
        "input[type=range]",
      ) as HTMLInputElement;
      input.value = "75";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      fixture.detectChanges();
      expect(host.value()).toBe(75);
    });

    it("should show value label when showValue is true", () => {
      host.showValue.set(true);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector(".sl-value");
      expect(label).toBeTruthy();
      expect(label.textContent.trim()).toBe("50");
    });
  });

  describe("range mode", () => {
    beforeEach(() => {
      host.mode.set("range");
      host.value.set([20, 80] as readonly [number, number]);
      fixture.detectChanges();
    });

    it("should render two inputs", () => {
      const inputs =
        fixture.nativeElement.querySelectorAll("input[type=range]");
      expect(inputs.length).toBe(2);
    });

    it("should apply range mode class", () => {
      expect(
        fixture.nativeElement.querySelector("ui-slider").classList,
      ).toContain("ui-slider--range");
    });

    it("should set low input value", () => {
      const inputs =
        fixture.nativeElement.querySelectorAll("input[type=range]");
      expect(inputs[0].value).toBe("20");
    });

    it("should set high input value", () => {
      const inputs =
        fixture.nativeElement.querySelectorAll("input[type=range]");
      expect(inputs[1].value).toBe("80");
    });

    it("should update low value on input", () => {
      const inputs =
        fixture.nativeElement.querySelectorAll("input[type=range]");
      inputs[0].value = "30";
      inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
      fixture.detectChanges();
      const v = host.value() as readonly [number, number];
      expect(v[0]).toBe(30);
      expect(v[1]).toBe(80);
    });

    it("should update high value on input", () => {
      const inputs =
        fixture.nativeElement.querySelectorAll("input[type=range]");
      inputs[1].value = "90";
      inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
      fixture.detectChanges();
      const v = host.value() as readonly [number, number];
      expect(v[0]).toBe(20);
      expect(v[1]).toBe(90);
    });

    it("should clamp low value to not exceed high", () => {
      const inputs =
        fixture.nativeElement.querySelectorAll("input[type=range]");
      inputs[0].value = "90";
      inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
      fixture.detectChanges();
      const v = host.value() as readonly [number, number];
      expect(v[0]).toBe(80);
    });

    it("should clamp high value to not go below low", () => {
      const inputs =
        fixture.nativeElement.querySelectorAll("input[type=range]");
      inputs[1].value = "10";
      inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
      fixture.detectChanges();
      const v = host.value() as readonly [number, number];
      expect(v[1]).toBe(20);
    });

    it("should show range value label when showValue is true", () => {
      host.showValue.set(true);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector(".sl-value");
      expect(label.textContent).toContain("20");
      expect(label.textContent).toContain("80");
    });
  });

  describe("disabled", () => {
    it("should apply disabled class", () => {
      host.disabled.set(true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector("ui-slider").classList,
      ).toContain("ui-slider--disabled");
    });

    it("should disable native input", () => {
      host.disabled.set(true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input[type=range]");
      expect(input.disabled).toBe(true);
    });
  });

  describe("aria", () => {
    it("should have aria-label on input", () => {
      const input = fixture.nativeElement.querySelector("input[type=range]");
      expect(input.getAttribute("aria-label")).toBe("Slider");
    });
  });
});
