import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIDateTimePicker } from "./date-time-picker.component";

describe("UIDateTimePicker", () => {
  let component: UIDateTimePicker;
  let fixture: ComponentFixture<UIDateTimePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIDateTimePicker],
    }).compileComponents();

    fixture = TestBed.createComponent(UIDateTimePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("host class", () => {
    it("should have the ui-date-time-picker class", () => {
      expect(
        fixture.nativeElement.classList.contains("ui-date-time-picker"),
      ).toBe(true);
    });
  });

  describe("defaults", () => {
    it('should default format to "yyyy-MM-dd"', () => {
      expect(component.format()).toBe("yyyy-MM-dd");
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

    it("should default timeMode to 24", () => {
      expect(component.timeMode()).toBe(24);
    });

    it("should default minDate to null", () => {
      expect(component.minDate()).toBeNull();
    });

    it("should default maxDate to null", () => {
      expect(component.maxDate()).toBeNull();
    });

    it("should default minTime to null", () => {
      expect(component.minTime()).toBeNull();
    });

    it("should default maxTime to null", () => {
      expect(component.maxTime()).toBeNull();
    });

    it("should default minuteStep to 1", () => {
      expect(component.minuteStep()).toBe(1);
    });

    it("should default firstDayOfWeek to 1", () => {
      expect(component.firstDayOfWeek()).toBe(1);
    });

    it('should default ariaLabel to "Date and time"', () => {
      expect(component.ariaLabel()).toBe("Date and time");
    });

    it('should default dateAriaLabel to "Date"', () => {
      expect(component.dateAriaLabel()).toBe("Date");
    });

    it('should default timeAriaLabel to "Time"', () => {
      expect(component.timeAriaLabel()).toBe("Time");
    });
  });

  describe("sub-components", () => {
    it("should render a date picker", () => {
      const dp = fixture.nativeElement.querySelector("ui-date-picker");
      expect(dp).toBeTruthy();
    });

    it("should render a time picker", () => {
      const tp = fixture.nativeElement.querySelector("ui-time-picker");
      expect(tp).toBeTruthy();
    });

    it("should disable both pickers when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const dateInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".dp-input");
      const hourInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      expect(dateInput.disabled).toBe(true);
      expect(hourInput.disabled).toBe(true);
    });

    it("should set readonly on both pickers", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      const dateInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".dp-input");
      const hourInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      expect(dateInput.readOnly).toBe(true);
      expect(hourInput.readOnly).toBe(true);
    });
  });

  describe("combined value", () => {
    it("should split a Date into date and time parts", () => {
      const d = new Date(2025, 5, 15, 14, 30, 0, 0);
      component.value.set(d);
      fixture.detectChanges();

      // Date part shows in the date input
      const dateInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".dp-input");
      expect(dateInput.value).toBe("2025-06-15");

      // Time part shows in the hour/minute inputs
      const hourInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      const minuteInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-minute");
      expect(hourInput.value).toBe("14");
      expect(minuteInput.value).toBe("30");
    });

    it("should combine date selection with current time", () => {
      // Set an initial time
      component.value.set(new Date(2025, 5, 10, 9, 15));
      fixture.detectChanges();

      // Simulate date change from sub-component
      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      // Open calendar and click a day
      const toggleBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".dp-toggle");
      toggleBtn.click();
      fixture.detectChanges();

      const days: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll(
          ".dp-cal-day:not(.dp-cal-day--outside):not(.dp-cal-day--disabled)",
        );
      days[0].click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      const emitted: Date = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(emitted).toBeInstanceOf(Date);
      // Should preserve the time portion
      expect(emitted.getHours()).toBe(9);
      expect(emitted.getMinutes()).toBe(15);
    });

    it("should combine time change with current date", () => {
      component.value.set(new Date(2025, 5, 15, 10, 0));
      fixture.detectChanges();

      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      // Step the hour up via keyboard
      const hourInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      hourInput.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      const emitted: Date = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(emitted.getFullYear()).toBe(2025);
      expect(emitted.getMonth()).toBe(5);
      expect(emitted.getDate()).toBe(15);
      expect(emitted.getHours()).toBe(11);
    });

    it("should emit null when date is cleared", () => {
      component.value.set(new Date(2025, 5, 15, 10, 0));
      fixture.detectChanges();

      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      // Clear the date input
      const dateInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".dp-input");
      dateInput.value = "";
      dateInput.dispatchEvent(new Event("input"));
      dateInput.dispatchEvent(new Event("blur"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      const lastCall = spy.mock.calls[spy.mock.calls.length - 1][0];
      expect(lastCall).toBeNull();
    });
  });

  describe("dateChange output", () => {
    it("should emit dateChange when a day is picked", () => {
      const spy = vi.fn();
      component.dateChange.subscribe(spy);

      const toggleBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".dp-toggle");
      toggleBtn.click();
      fixture.detectChanges();

      const days: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll(
          ".dp-cal-day:not(.dp-cal-day--outside):not(.dp-cal-day--disabled)",
        );
      days[0].click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("timeChange output", () => {
    it("should emit timeChange when time is stepped", () => {
      component.value.set(new Date(2025, 5, 15, 10, 0));
      fixture.detectChanges();

      const spy = vi.fn();
      component.timeChange.subscribe(spy);

      const hourInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".tp-hour");
      hourInput.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("12-hour mode", () => {
    it("should show AM/PM button when timeMode is 12", () => {
      fixture.componentRef.setInput("timeMode", 12);
      fixture.detectChanges();

      const meridiem = fixture.nativeElement.querySelector(".tp-meridiem");
      expect(meridiem).toBeTruthy();
    });

    it("should not show AM/PM button in 24-hour mode", () => {
      const meridiem = fixture.nativeElement.querySelector(".tp-meridiem");
      expect(meridiem).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("should have group role on wrapper", () => {
      const wrapper = fixture.nativeElement.querySelector(".dtp-wrapper");
      expect(wrapper.getAttribute("role")).toBe("group");
    });

    it("should forward ariaLabel to wrapper", () => {
      fixture.componentRef.setInput("ariaLabel", "Appointment");
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector(".dtp-wrapper");
      expect(wrapper.getAttribute("aria-label")).toBe("Appointment");
    });

    it("should forward dateAriaLabel to date picker", () => {
      fixture.componentRef.setInput("dateAriaLabel", "Start date");
      fixture.detectChanges();

      const dateInput: HTMLInputElement =
        fixture.nativeElement.querySelector(".dp-input");
      expect(dateInput.getAttribute("aria-label")).toBe("Start date");
    });

    it("should forward timeAriaLabel to time picker", () => {
      fixture.componentRef.setInput("timeAriaLabel", "Start time");
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector(
        "ui-time-picker .tp-wrapper",
      );
      expect(wrapper.getAttribute("aria-label")).toBe("Start time");
    });
  });
});
