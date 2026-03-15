import { TestBed } from "@angular/core/testing";

import { UIDensityService } from "./ui-density.service";
import { DEFAULT_UI_DENSITY, type UIDensity } from "./ui-density.model";

describe("UIDensityService", () => {
  let service: UIDensityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UIDensityService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("defaults", () => {
    it(`should default to '${DEFAULT_UI_DENSITY}'`, () => {
      expect(service.density()).toBe(DEFAULT_UI_DENSITY);
    });
  });

  describe("setDensity", () => {
    const densities: UIDensity[] = [
      "small",
      "compact",
      "comfortable",
      "generous",
    ];

    for (const density of densities) {
      it(`should set density to '${density}'`, () => {
        service.setDensity(density);
        expect(service.density()).toBe(density);
      });
    }
  });

  describe("reset", () => {
    it("should restore the default density", () => {
      service.setDensity("small");
      expect(service.density()).toBe("small");

      service.reset();
      expect(service.density()).toBe(DEFAULT_UI_DENSITY);
    });
  });

  describe("density signal", () => {
    it("should be read-only (no set method)", () => {
      const densitySignal = service.density;
      // The getter returns a Signal, not a WritableSignal
      expect(typeof densitySignal).toBe("function");
      expect((densitySignal as any).set).toBeUndefined();
    });
  });
});
