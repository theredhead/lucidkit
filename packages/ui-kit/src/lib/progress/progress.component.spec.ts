import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIProgress } from "./progress.component";
import type { ProgressMode, ProgressVariant } from "./progress.types";

@Component({
  standalone: true,
  imports: [UIProgress],
  template: `
    <ui-progress [variant]="variant()" [mode]="mode()" [value]="value()" />
  `,
})
class TestHost {
  public readonly variant = signal<ProgressVariant>("linear");
  public readonly mode = signal<ProgressMode>("determinate");
  public readonly value = signal(50);
}

describe("UIProgress", () => {
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
    expect(fixture.nativeElement.querySelector("ui-progress")).toBeTruthy();
  });

  it("should have progressbar role", () => {
    const el = fixture.nativeElement.querySelector("ui-progress");
    expect(el.getAttribute("role")).toBe("progressbar");
  });

  describe("linear determinate", () => {
    it("should render track and fill", () => {
      expect(fixture.nativeElement.querySelector(".track")).toBeTruthy();
      expect(fixture.nativeElement.querySelector(".fill")).toBeTruthy();
    });

    it("should set fill width based on value", () => {
      const fill = fixture.nativeElement.querySelector(
        ".fill",
      ) as HTMLElement;
      expect(fill.style.width).toBe("50%");
    });

    it("should clamp value to 0–100", () => {
      host.value.set(150);
      fixture.detectChanges();
      const fill = fixture.nativeElement.querySelector(
        ".fill",
      ) as HTMLElement;
      expect(fill.style.width).toBe("100%");
    });

    it("should set aria-valuenow", () => {
      const el = fixture.nativeElement.querySelector("ui-progress");
      expect(el.getAttribute("aria-valuenow")).toBe("50");
    });

    it("should apply linear class", () => {
      expect(
        fixture.nativeElement.querySelector("ui-progress").classList,
      ).toContain("linear");
    });
  });

  describe("linear indeterminate", () => {
    beforeEach(() => {
      host.mode.set("indeterminate");
      fixture.detectChanges();
    });

    it("should render indeterminate fill", () => {
      expect(
        fixture.nativeElement.querySelector(".fill--indeterminate"),
      ).toBeTruthy();
    });

    it("should not set aria-valuenow", () => {
      const el = fixture.nativeElement.querySelector("ui-progress");
      expect(el.getAttribute("aria-valuenow")).toBeNull();
    });

    it("should apply indeterminate class", () => {
      expect(
        fixture.nativeElement.querySelector("ui-progress").classList,
      ).toContain("indeterminate");
    });
  });

  describe("circular", () => {
    beforeEach(() => {
      host.variant.set("circular");
      fixture.detectChanges();
    });

    it("should render SVG ring", () => {
      expect(fixture.nativeElement.querySelector(".ring")).toBeTruthy();
    });

    it("should render track and fill circles", () => {
      expect(
        fixture.nativeElement.querySelector(".ring-track"),
      ).toBeTruthy();
      expect(fixture.nativeElement.querySelector(".ring-fill")).toBeTruthy();
    });

    it("should apply circular class", () => {
      expect(
        fixture.nativeElement.querySelector("ui-progress").classList,
      ).toContain("circular");
    });
  });

  describe("circular indeterminate", () => {
    beforeEach(() => {
      host.variant.set("circular");
      host.mode.set("indeterminate");
      fixture.detectChanges();
    });

    it("should render indeterminate ring", () => {
      expect(
        fixture.nativeElement.querySelector(".ring-fill--indeterminate"),
      ).toBeTruthy();
    });
  });
});
