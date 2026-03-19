import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal, viewChild } from "@angular/core";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { UIAnalogClock } from "./analog-clock.component";
import { UIIcons } from "../icon";

/**
 * Test host to exercise UIAnalogClock inputs via signals.
 */
@Component({
  selector: "ui-test-clock-host",
  standalone: true,
  imports: [UIAnalogClock],
  template: `
    <ui-analog-clock
      [time]="time()"
      [size]="size()"
      [showSeconds]="showSeconds()"
      [showNumbers]="showNumbers()"
      [showTickMarks]="showTickMarks()"
      [ariaLabel]="ariaLabel()"
      [dayIcon]="dayIcon()"
      [nightIcon]="nightIcon()"
      [dayIconColor]="dayIconColor()"
      [nightIconColor]="nightIconColor()"
    />
  `,
})
class TestClockHost {
  public readonly clock = viewChild.required(UIAnalogClock);
  public readonly time = signal<Date | null>(new Date(2025, 0, 1, 10, 10, 30));
  public readonly size = signal(200);
  public readonly showSeconds = signal(true);
  public readonly showNumbers = signal(true);
  public readonly showTickMarks = signal(true);
  public readonly ariaLabel = signal("Analog clock");
  public readonly dayIcon = signal<string>(UIIcons.Lucide.Weather.Sun);
  public readonly nightIcon = signal<string>(UIIcons.Lucide.Weather.MoonStar);
  public readonly dayIconColor = signal<string>("#f59e0b");
  public readonly nightIconColor = signal<string>("#e8e0c0");
}

describe("UIAnalogClock", () => {
  let fixture: ComponentFixture<TestClockHost>;
  let host: TestClockHost;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [TestClockHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestClockHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create", () => {
    expect(host.clock()).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default size to 200", () => {
      expect(host.clock().size()).toBe(200);
    });

    it("should default showSeconds to true", () => {
      expect(host.clock().showSeconds()).toBe(true);
    });

    it("should default showNumbers to true", () => {
      expect(host.clock().showNumbers()).toBe(true);
    });

    it("should default showTickMarks to true", () => {
      expect(host.clock().showTickMarks()).toBe(true);
    });

    it("should default ariaLabel to 'Analog clock'", () => {
      expect(host.clock().ariaLabel()).toBe("Analog clock");
    });
  });

  describe("rendering", () => {
    it("should render an SVG element", () => {
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("should render the clock structural circles (rim, bg, center cap)", () => {
      const rim = fixture.nativeElement.querySelector("svg .clock-rim");
      const bg = fixture.nativeElement.querySelector("svg .clock-bg");
      const cap = fixture.nativeElement.querySelector("svg .center-cap");
      expect(rim).toBeTruthy();
      expect(bg).toBeTruthy();
      expect(cap).toBeTruthy();
    });

    it("should render 60 tick marks", () => {
      const ticks = fixture.nativeElement.querySelectorAll("svg .tick");
      expect(ticks.length).toBe(60);
    });

    it("should render 12 hour tick marks", () => {
      const hourTicks =
        fixture.nativeElement.querySelectorAll("svg .tick--hour");
      expect(hourTicks.length).toBe(12);
    });

    it("should render 48 minute tick marks", () => {
      const minuteTicks =
        fixture.nativeElement.querySelectorAll("svg .tick--minute");
      expect(minuteTicks.length).toBe(48);
    });

    it("should render 12 hour numbers", () => {
      const numbers =
        fixture.nativeElement.querySelectorAll("svg .hour-number");
      expect(numbers.length).toBe(12);
    });

    it("should render three hands (hour, minute, second)", () => {
      const hands = fixture.nativeElement.querySelectorAll("svg .hand");
      expect(hands.length).toBe(3);
    });

    it("should render a center cap circle", () => {
      const cap = fixture.nativeElement.querySelector("svg .center-cap");
      expect(cap).toBeTruthy();
    });
  });

  describe("hand rotation", () => {
    // Time is 10:10:30

    it("should rotate the second hand to 180°", () => {
      // 30 seconds × 6°/s = 180°
      expect(host.clock()["secondAngle"]()).toBe(180);
    });

    it("should rotate the minute hand correctly", () => {
      // 10 min × 6°/min + 30 sec × 0.1°/s = 60 + 3 = 63°
      expect(host.clock()["minuteAngle"]()).toBe(63);
    });

    it("should rotate the hour hand correctly", () => {
      // 10 hours × 30°/h + 10 min × 0.5°/min = 300 + 5 = 305°
      expect(host.clock()["hourAngle"]()).toBe(305);
    });
  });

  describe("visibility toggles", () => {
    it("should hide the second hand when showSeconds is false", () => {
      host.showSeconds.set(false);
      fixture.detectChanges();
      const secondHand =
        fixture.nativeElement.querySelector("svg .hand--second");
      expect(secondHand).toBeNull();
    });

    it("should hide hour numbers when showNumbers is false", () => {
      host.showNumbers.set(false);
      fixture.detectChanges();
      const numbers =
        fixture.nativeElement.querySelectorAll("svg .hour-number");
      expect(numbers.length).toBe(0);
    });

    it("should hide tick marks when showTickMarks is false", () => {
      host.showTickMarks.set(false);
      fixture.detectChanges();
      const ticks = fixture.nativeElement.querySelectorAll("svg .tick");
      expect(ticks.length).toBe(0);
    });
  });

  describe("size", () => {
    it("should apply custom size to the SVG", () => {
      host.size.set(120);
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.getAttribute("width")).toBe("120");
      expect(svg.getAttribute("height")).toBe("120");
    });

    it("should apply size to the host element", () => {
      host.size.set(300);
      fixture.detectChanges();
      const hostEl: HTMLElement =
        fixture.nativeElement.querySelector("ui-analog-clock");
      expect(hostEl.style.width).toBe("300px");
      expect(hostEl.style.height).toBe("300px");
    });
  });

  describe("accessibility", () => {
    it("should have role=img on the SVG", () => {
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.getAttribute("role")).toBe("img");
    });

    it("should apply aria-label to the SVG", () => {
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.getAttribute("aria-label")).toBe("Analog clock");
    });

    it("should support custom ariaLabel", () => {
      host.ariaLabel.set("Current time");
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector("svg");
      expect(svg.getAttribute("aria-label")).toBe("Current time");
    });
  });

  describe("live mode", () => {
    it("should auto-tick when time is null", () => {
      host.time.set(null);
      fixture.detectChanges();

      // Advance 2 seconds
      vi.advanceTimersByTime(2000);
      fixture.detectChanges();

      // The live date signal should have been updated
      expect(host.clock()["liveDate"]()).toBeInstanceOf(Date);
    });

    it("should use fixed time when provided", () => {
      const fixed = new Date(2025, 5, 15, 3, 45, 0);
      host.time.set(fixed);
      fixture.detectChanges();

      // 3:45:00 → second = 0°, minute = 270°, hour = 112.5°
      expect(host.clock()["secondAngle"]()).toBe(0);
      expect(host.clock()["minuteAngle"]()).toBe(270);
      expect(host.clock()["hourAngle"]()).toBe(112.5);
    });
  });

  describe("day/night detection", () => {
    it("should be daytime at 10:10 (default test time)", () => {
      expect(host.clock()["isNight"]()).toBe(false);
    });

    it("should be nighttime at 23:00", () => {
      host.time.set(new Date(2025, 0, 1, 23, 0, 0));
      fixture.detectChanges();
      expect(host.clock()["isNight"]()).toBe(true);
    });

    it("should be nighttime at 3:00 AM", () => {
      host.time.set(new Date(2025, 0, 1, 3, 0, 0));
      fixture.detectChanges();
      expect(host.clock()["isNight"]()).toBe(true);
    });

    it("should be daytime at 6:00 AM (boundary)", () => {
      host.time.set(new Date(2025, 0, 1, 6, 0, 0));
      fixture.detectChanges();
      expect(host.clock()["isNight"]()).toBe(false);
    });

    it("should be daytime at 17:59", () => {
      host.time.set(new Date(2025, 0, 1, 17, 59, 0));
      fixture.detectChanges();
      expect(host.clock()["isNight"]()).toBe(false);
    });

    it("should be nighttime at 18:00 (boundary)", () => {
      host.time.set(new Date(2025, 0, 1, 18, 0, 0));
      fixture.detectChanges();
      expect(host.clock()["isNight"]()).toBe(true);
    });
  });

  describe("day/night indicator", () => {
    it("should render the indicator group", () => {
      const group = fixture.nativeElement.querySelector(
        "svg .day-night-indicator",
      );
      expect(group).toBeTruthy();
    });

    it("should render SVG content inside the indicator", () => {
      // Default test time is 10:10 (day) → renders Sun paths
      const group = fixture.nativeElement.querySelector(
        "svg .day-night-indicator",
      );
      expect(group.innerHTML).toContain("<");
    });

    it("should apply day icon stroke colour during the day", () => {
      const group = fixture.nativeElement.querySelector(
        "svg .day-night-indicator",
      );
      expect(group.getAttribute("stroke")).toBe("#f59e0b");
    });

    it("should apply night icon stroke colour at night", () => {
      host.time.set(new Date(2025, 0, 1, 22, 0, 0));
      fixture.detectChanges();

      const group = fixture.nativeElement.querySelector(
        "svg .day-night-indicator",
      );
      expect(group.getAttribute("stroke")).toBe("#e8e0c0");
    });

    it("should apply night host class at night", () => {
      host.time.set(new Date(2025, 0, 1, 22, 0, 0));
      fixture.detectChanges();

      const hostEl = fixture.nativeElement.querySelector("ui-analog-clock");
      expect(hostEl.classList.contains("ui-analog-clock--night")).toBe(true);
    });

    it("should not apply night host class during the day", () => {
      const hostEl = fixture.nativeElement.querySelector("ui-analog-clock");
      expect(hostEl.classList.contains("ui-analog-clock--night")).toBe(false);
    });

    it("should accept custom day icon", () => {
      const custom = '<circle cx="12" cy="12" r="10" />';
      host.dayIcon.set(custom);
      fixture.detectChanges();

      const group = fixture.nativeElement.querySelector(
        "svg .day-night-indicator",
      );
      expect(group.innerHTML).toContain('r="10"');
    });

    it("should accept custom night icon", () => {
      const custom = '<rect width="24" height="24" />';
      host.nightIcon.set(custom);
      host.time.set(new Date(2025, 0, 1, 23, 0, 0));
      fixture.detectChanges();

      const group = fixture.nativeElement.querySelector(
        "svg .day-night-indicator",
      );
      expect(group.innerHTML).toContain('width="24"');
    });

    it("should accept custom day icon colour", () => {
      host.dayIconColor.set("#ff0000");
      fixture.detectChanges();

      const group = fixture.nativeElement.querySelector(
        "svg .day-night-indicator",
      );
      expect(group.getAttribute("stroke")).toBe("#ff0000");
    });

    it("should accept custom night icon colour", () => {
      host.nightIconColor.set("#00ff00");
      host.time.set(new Date(2025, 0, 1, 22, 0, 0));
      fixture.detectChanges();

      const group = fixture.nativeElement.querySelector(
        "svg .day-night-indicator",
      );
      expect(group.getAttribute("stroke")).toBe("#00ff00");
    });
  });
});
