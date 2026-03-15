import { Component, input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIDensityDirective } from "./ui-density.directive";
import { UIDensityService } from "./ui-density.service";
import {
  UI_DENSITY_SCALE,
  UI_DENSITY_TOKENS,
  type UIDensity,
} from "./ui-density.model";

@Component({
  standalone: true,
  imports: [UIDensityDirective],
  template: `<div uiDensity [uiDensity]="density()">Content</div>`,
})
class TestHost {
  readonly density = input<UIDensity | null>(null);
}

describe("UIDensityDirective", () => {
  let fixture: ComponentFixture<TestHost>;
  let service: UIDensityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    service = TestBed.inject(UIDensityService);
    fixture.detectChanges();
  });

  it("should create the directive", () => {
    const el: HTMLElement = fixture.nativeElement.querySelector("[uiDensity]");
    expect(el).toBeTruthy();
  });

  describe("resolved density", () => {
    it("should use the service density by default", () => {
      const el: HTMLElement =
        fixture.nativeElement.querySelector("[uiDensity]");
      expect(el.getAttribute("data-ui-density")).toBe("comfortable");
    });

    it("should use the input density when provided", () => {
      fixture.componentRef.setInput("density", "compact");
      fixture.detectChanges();

      const el: HTMLElement =
        fixture.nativeElement.querySelector("[uiDensity]");
      expect(el.getAttribute("data-ui-density")).toBe("compact");
    });

    it("should fall back to service when input is null", () => {
      fixture.componentRef.setInput("density", "small");
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector("[uiDensity]")
          .getAttribute("data-ui-density"),
      ).toBe("small");

      fixture.componentRef.setInput("density", null);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector("[uiDensity]")
          .getAttribute("data-ui-density"),
      ).toBe("comfortable");
    });

    it("should react to service density changes", () => {
      service.setDensity("generous");
      fixture.detectChanges();

      const el: HTMLElement =
        fixture.nativeElement.querySelector("[uiDensity]");
      expect(el.getAttribute("data-ui-density")).toBe("generous");
    });
  });

  describe("host style bindings", () => {
    const densities: UIDensity[] = [
      "small",
      "compact",
      "comfortable",
      "generous",
    ];

    for (const density of densities) {
      it(`should apply correct tokens for '${density}'`, () => {
        fixture.componentRef.setInput("density", density);
        fixture.detectChanges();

        const el: HTMLElement =
          fixture.nativeElement.querySelector("[uiDensity]");
        const tokens = UI_DENSITY_TOKENS[density];
        const scale = UI_DENSITY_SCALE[density];

        expect(el.style.getPropertyValue("--ui-density")).toBe(density);
        expect(el.style.getPropertyValue("--ui-density-scale")).toBe(
          String(scale),
        );
        expect(el.style.getPropertyValue("--ui-control-height")).toBe(
          tokens.controlHeight,
        );
        expect(el.style.getPropertyValue("--ui-cell-height")).toBe(
          tokens.cellHeight,
        );
        expect(el.style.getPropertyValue("--ui-inline-padding")).toBe(
          tokens.inlinePadding,
        );
        expect(el.style.getPropertyValue("--ui-block-padding")).toBe(
          tokens.blockPadding,
        );
        expect(el.style.getPropertyValue("--ui-gap")).toBe(tokens.gap);
        expect(el.style.getPropertyValue("--ui-radius")).toBe(tokens.radius);
      });
    }
  });
});
