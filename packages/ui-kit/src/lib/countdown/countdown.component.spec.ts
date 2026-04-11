import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UICountdown } from "./countdown.component";

const NEAR_FUTURE = Date.now() + 90_000; // 1 min 30 s from now
const PAST = Date.now() - 90_000;

describe("UICountdown", () => {
  let component: UICountdown;
  let fixture: ComponentFixture<UICountdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UICountdown],
    }).compileComponents();
    fixture = TestBed.createComponent(UICountdown);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("target", NEAR_FUTURE);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("countdown mode", () => {
    it("should display time-display for a future target", () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".time-display")).toBeTruthy();
    });

    it("should show minutes and seconds", () => {
      fixture.detectChanges();
      const values = fixture.nativeElement.querySelectorAll(".value");
      expect(values.length).toBeGreaterThanOrEqual(2);
    });

    it("should start not expired", () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).not.toContain("expired");
    });
  });

  describe("elapsed mode", () => {
    it("should display time-display for a past target in elapsed mode", () => {
      fixture.componentRef.setInput("target", PAST);
      fixture.componentRef.setInput("mode", "elapsed");
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".time-display")).toBeTruthy();
    });
  });

  describe("formats", () => {
    it("dhms format shows h/m/s units by default", () => {
      fixture.detectChanges();
      const labels = Array.from(
        fixture.nativeElement.querySelectorAll(
          ".label",
        ) as NodeListOf<HTMLElement>,
      ).map((el) => el.textContent?.trim());
      expect(labels).toContain("m");
      expect(labels).toContain("s");
    });

    it("ms format only shows minutes and seconds", () => {
      fixture.componentRef.setInput("format", "ms");
      fixture.detectChanges();
      const labels = Array.from(
        fixture.nativeElement.querySelectorAll(
          ".label",
        ) as NodeListOf<HTMLElement>,
      ).map((el) => el.textContent?.trim());
      expect(labels).not.toContain("h");
      expect(labels).toContain("m");
      expect(labels).toContain("s");
    });
  });

  describe("pad helper", () => {
    it("should pad single digits", () => {
      fixture.detectChanges();
      // Access protected member via casting for unit test
      const padFn = (component as unknown as { pad: (n: number) => string })
        .pad;
      expect(padFn.call(component, 5)).toBe("05");
      expect(padFn.call(component, 10)).toBe("10");
    });
  });

  describe("accessibility", () => {
    it("should expose aria-label", () => {
      fixture.componentRef.setInput("ariaLabel", "Sale ends in");
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute("aria-label")).toBe(
        "Sale ends in",
      );
    });
  });
});
