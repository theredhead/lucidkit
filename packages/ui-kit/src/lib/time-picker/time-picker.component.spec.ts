import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UITimePicker } from "./time-picker.component";
import {
  formatTime,
  parseTime,
  to12Hour,
  getMeridiem,
  clamp,
  wrap,
  compareTime,
} from "./time-picker.utils";

describe("UITimePicker", () => {
  let component: UITimePicker;
  let fixture: ComponentFixture<UITimePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UITimePicker],
    }).compileComponents();

    fixture = TestBed.createComponent(UITimePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("host class", () => {
    it("should have the ui-time-picker class", () => {
      expect(fixture.nativeElement.classList.contains("ui-time-picker")).toBe(
        true,
      );
    });
  });

  describe("defaults", () => {
    it("should default mode to 24", () => {
      expect(component.mode()).toBe(24);
    });

    it("should default value to null", () => {
      expect(component.value()).toBeNull();
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it("should default readonly to false", () => {
      expect(component.readonly()).toBe(false);
    });

    it("should default min to null", () => {
      expect(component.min()).toBeNull();
    });

    it("should default max to null", () => {
      expect(component.max()).toBeNull();
    });

    it("should default minuteStep to 1", () => {
      expect(component.minuteStep()).toBe(1);
    });

    it('should default ariaLabel to "Time"', () => {
      expect(component.ariaLabel()).toBe("Time");
    });
  });

  describe("input elements", () => {
    it("should render hour and minute inputs", () => {
      const hour = fixture.nativeElement.querySelector(".tp-hour");
      const minute = fixture.nativeElement.querySelector(".tp-minute");
      expect(hour).toBeTruthy();
      expect(minute).toBeTruthy();
    });

    it("should render a colon separator", () => {
      const sep = fixture.nativeElement.querySelector(".tp-separator");
      expect(sep).toBeTruthy();
      expect(sep.textContent.trim()).toBe(":");
    });

    it("should not show AM/PM in 24-hour mode", () => {
      const meridiem = fixture.nativeElement.querySelector(".tp-meridiem");
      expect(meridiem).toBeNull();
    });

    it("should show AM/PM in 12-hour mode", () => {
      fixture.componentRef.setInput("mode", 12);
      fixture.detectChanges();

      const meridiem = fixture.nativeElement.querySelector(".tp-meridiem");
      expect(meridiem).toBeTruthy();
    });

    it("should disable inputs when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      const minute: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      expect(hour.disabled).toBe(true);
      expect(minute.disabled).toBe(true);
    });

    it("should set inputs readonly when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      const minute: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      expect(hour.readOnly).toBe(true);
      expect(minute.readOnly).toBe(true);
    });
  });

  describe("24-hour mode", () => {
    it("should display 24-hour value", () => {
      component.value.set("14:30");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      const minute: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      expect(hour.value).toBe("14");
      expect(minute.value).toBe("30");
    });

    it("should display midnight as 00:00", () => {
      component.value.set("00:00");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      const minute: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      expect(hour.value).toBe("00");
      expect(minute.value).toBe("00");
    });
  });

  describe("12-hour mode", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("mode", 12);
      fixture.detectChanges();
    });

    it("should display 12-hour value for PM", () => {
      component.value.set("14:30");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      expect(hour.value).toBe("2");

      const meridiem = fixture.nativeElement.querySelector(".tp-meridiem");
      expect(meridiem.textContent.trim()).toBe("PM");
    });

    it("should display 12 for noon", () => {
      component.value.set("12:00");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      expect(hour.value).toBe("12");

      const meridiem = fixture.nativeElement.querySelector(".tp-meridiem");
      expect(meridiem.textContent.trim()).toBe("PM");
    });

    it("should display 12 for midnight", () => {
      component.value.set("00:00");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      expect(hour.value).toBe("12");

      const meridiem = fixture.nativeElement.querySelector(".tp-meridiem");
      expect(meridiem.textContent.trim()).toBe("AM");
    });

    it("should toggle meridiem on button click", () => {
      component.value.set("09:00");
      fixture.detectChanges();

      const meridiemBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".tp-meridiem");
      expect(meridiemBtn.textContent.trim()).toBe("AM");

      meridiemBtn.click();
      fixture.detectChanges();

      // 09:00 → 21:00, which is 9 PM
      expect(component.value()).toBe("21:00");
    });
  });

  describe("keyboard interaction", () => {
    it("should increment hour on ArrowUp", () => {
      component.value.set("10:30");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      hour.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(component.value()).toBe("11:30");
    });

    it("should decrement hour on ArrowDown", () => {
      component.value.set("10:30");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      hour.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      fixture.detectChanges();

      expect(component.value()).toBe("09:30");
    });

    it("should increment minute on ArrowUp", () => {
      component.value.set("10:30");
      fixture.detectChanges();

      const minute: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      minute.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(component.value()).toBe("10:31");
    });

    it("should decrement minute on ArrowDown", () => {
      component.value.set("10:30");
      fixture.detectChanges();

      const minute: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      minute.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      fixture.detectChanges();

      expect(component.value()).toBe("10:29");
    });

    it("should wrap hour from 23 to 0", () => {
      component.value.set("23:00");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      hour.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(component.value()).toBe("00:00");
    });

    it("should wrap minute from 59 to 0", () => {
      component.value.set("10:59");
      fixture.detectChanges();

      const minute: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      minute.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(component.value()).toBe("10:00");
    });

    it("should not respond to keys when disabled", () => {
      component.value.set("10:30");
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      hour.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(component.value()).toBe("10:30");
    });
  });

  describe("minute step", () => {
    it("should respect minuteStep when incrementing", () => {
      fixture.componentRef.setInput("minuteStep", 15);
      component.value.set("10:00");
      fixture.detectChanges();

      const minute: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      minute.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(component.value()).toBe("10:15");
    });
  });

  describe("timeChange output", () => {
    it("should emit timeChange on ArrowUp in hour", () => {
      const spy = vi.fn();
      component.timeChange.subscribe(spy);
      component.value.set("10:30");
      fixture.detectChanges();

      const hour: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      hour.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith("11:30");
    });
  });

  describe("accessibility", () => {
    it("should have group role on wrapper", () => {
      const wrapper = fixture.nativeElement.querySelector(".tp-wrapper");
      expect(wrapper.getAttribute("role")).toBe("group");
    });

    it("should forward ariaLabel to wrapper", () => {
      fixture.componentRef.setInput("ariaLabel", "Meeting time");
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector(".tp-wrapper");
      expect(wrapper.getAttribute("aria-label")).toBe("Meeting time");
    });

    it("should have aria-label on hour input", () => {
      const hour = fixture.nativeElement.querySelector(".tp-hour");
      expect(hour.getAttribute("aria-label")).toBe("Hour");
    });

    it("should have aria-label on minute input", () => {
      const minute = fixture.nativeElement.querySelector(".tp-minute");
      expect(minute.getAttribute("aria-label")).toBe("Minute");
    });

    it("should have aria-label on meridiem button in 12-hour mode", () => {
      fixture.componentRef.setInput("mode", 12);
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector(".tp-meridiem");
      expect(btn.getAttribute("aria-label")).toBe("Toggle AM/PM");
    });
  });
});

// ── Utility function tests ──────────────────────────────────────

describe("time-picker utils", () => {
  describe("formatTime", () => {
    it("should format 24-hour time", () => {
      expect(formatTime({ hours: 14, minutes: 5 }, 24)).toBe("14:05");
    });

    it("should format midnight in 24-hour", () => {
      expect(formatTime({ hours: 0, minutes: 0 }, 24)).toBe("00:00");
    });

    it("should format 12-hour PM time", () => {
      expect(formatTime({ hours: 14, minutes: 30 }, 12)).toBe("2:30 PM");
    });

    it("should format 12-hour AM time", () => {
      expect(formatTime({ hours: 9, minutes: 5 }, 12)).toBe("9:05 AM");
    });

    it("should format noon in 12-hour", () => {
      expect(formatTime({ hours: 12, minutes: 0 }, 12)).toBe("12:00 PM");
    });

    it("should format midnight in 12-hour", () => {
      expect(formatTime({ hours: 0, minutes: 0 }, 12)).toBe("12:00 AM");
    });

    it("should return empty string for null", () => {
      expect(formatTime(null, 24)).toBe("");
    });
  });

  describe("parseTime", () => {
    it("should parse 24-hour format", () => {
      const t = parseTime("14:30");
      expect(t).toEqual({ hours: 14, minutes: 30 });
    });

    it("should parse midnight", () => {
      const t = parseTime("00:00");
      expect(t).toEqual({ hours: 0, minutes: 0 });
    });

    it("should parse 12-hour AM format", () => {
      const t = parseTime("9:05 AM");
      expect(t).toEqual({ hours: 9, minutes: 5 });
    });

    it("should parse 12-hour PM format", () => {
      const t = parseTime("2:30 PM");
      expect(t).toEqual({ hours: 14, minutes: 30 });
    });

    it("should parse 12:00 AM as midnight", () => {
      const t = parseTime("12:00 AM");
      expect(t).toEqual({ hours: 0, minutes: 0 });
    });

    it("should parse 12:00 PM as noon", () => {
      const t = parseTime("12:00 PM");
      expect(t).toEqual({ hours: 12, minutes: 0 });
    });

    it("should parse case-insensitive AM/PM", () => {
      const t = parseTime("3:15 pm");
      expect(t).toEqual({ hours: 15, minutes: 15 });
    });

    it("should return null for invalid text", () => {
      expect(parseTime("hello")).toBeNull();
    });

    it("should return null for empty string", () => {
      expect(parseTime("")).toBeNull();
    });

    it("should return null for invalid hours", () => {
      expect(parseTime("25:00")).toBeNull();
    });

    it("should return null for invalid minutes", () => {
      expect(parseTime("10:60")).toBeNull();
    });

    it("should return null for invalid 12-hour value", () => {
      expect(parseTime("13:00 AM")).toBeNull();
    });
  });

  describe("to12Hour", () => {
    it("should convert 0 to 12", () => {
      expect(to12Hour(0)).toBe(12);
    });

    it("should convert 12 to 12", () => {
      expect(to12Hour(12)).toBe(12);
    });

    it("should convert 13 to 1", () => {
      expect(to12Hour(13)).toBe(1);
    });

    it("should convert 23 to 11", () => {
      expect(to12Hour(23)).toBe(11);
    });
  });

  describe("getMeridiem", () => {
    it("should return AM for hours 0-11", () => {
      expect(getMeridiem(0)).toBe("AM");
      expect(getMeridiem(11)).toBe("AM");
    });

    it("should return PM for hours 12-23", () => {
      expect(getMeridiem(12)).toBe("PM");
      expect(getMeridiem(23)).toBe("PM");
    });
  });

  describe("clamp", () => {
    it("should clamp below min", () => {
      expect(clamp(-1, 0, 23)).toBe(0);
    });

    it("should clamp above max", () => {
      expect(clamp(25, 0, 23)).toBe(23);
    });

    it("should pass through valid value", () => {
      expect(clamp(10, 0, 23)).toBe(10);
    });
  });

  describe("wrap", () => {
    it("should wrap below min to max", () => {
      expect(wrap(-1, 0, 23)).toBe(23);
    });

    it("should wrap above max to min", () => {
      expect(wrap(24, 0, 23)).toBe(0);
    });

    it("should pass through valid value", () => {
      expect(wrap(10, 0, 23)).toBe(10);
    });
  });

  describe("compareTime", () => {
    it("should return 0 for equal times", () => {
      expect(
        compareTime({ hours: 10, minutes: 30 }, { hours: 10, minutes: 30 }),
      ).toBe(0);
    });

    it("should return negative when a < b", () => {
      expect(
        compareTime({ hours: 9, minutes: 0 }, { hours: 10, minutes: 0 }),
      ).toBeLessThan(0);
    });

    it("should return positive when a > b", () => {
      expect(
        compareTime({ hours: 15, minutes: 0 }, { hours: 10, minutes: 0 }),
      ).toBeGreaterThan(0);
    });

    it("should compare minutes when hours are equal", () => {
      expect(
        compareTime({ hours: 10, minutes: 15 }, { hours: 10, minutes: 30 }),
      ).toBeLessThan(0);
    });
  });
});
