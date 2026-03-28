import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UICalendarPanel } from "./calendar-panel.component";

describe("UICalendarPanel", () => {
  let component: UICalendarPanel;
  let fixture: ComponentFixture<UICalendarPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UICalendarPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(UICalendarPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("host class", () => {
    it("should have the ui-calendar-panel class", () => {
      expect(
        fixture.nativeElement.classList.contains("ui-calendar-panel"),
      ).toBe(true);
    });
  });

  describe("defaults", () => {
    it("should default currentValue to empty string", () => {
      expect(component.currentValue()).toBe("");
    });

    it('should default format to "yyyy-MM-dd"', () => {
      expect(component.format()).toBe("yyyy-MM-dd");
    });

    it("should default min to null", () => {
      expect(component.min()).toBeNull();
    });

    it("should default max to null", () => {
      expect(component.max()).toBeNull();
    });

    it("should default firstDayOfWeek to 1 (Monday)", () => {
      expect(component.firstDayOfWeek()).toBe(1);
    });
  });

  describe("calendar grid", () => {
    it("should render 7 weekday labels", () => {
      const labels = fixture.nativeElement.querySelectorAll(".cal-weekday");
      expect(labels.length).toBe(7);
    });

    it("should render 42 day buttons", () => {
      const days = fixture.nativeElement.querySelectorAll(".cal-day");
      expect(days.length).toBe(42);
    });

    it("should render month/year in the header", () => {
      const title = fixture.nativeElement.querySelector(".cal-title");
      expect(title.textContent.trim()).toMatch(/\w+ \d{4}/);
    });
  });

  describe("navigation", () => {
    it("should navigate to previous month", () => {
      const navButtons = fixture.nativeElement.querySelectorAll(".cal-nav");
      const prevMonthBtn = navButtons[1]; // «, ‹, ›, »
      const titleBefore =
        fixture.nativeElement.querySelector(".cal-title").textContent;
      prevMonthBtn.click();
      fixture.detectChanges();
      const titleAfter =
        fixture.nativeElement.querySelector(".cal-title").textContent;
      expect(titleAfter).not.toBe(titleBefore);
    });

    it("should navigate to next month", () => {
      const navButtons = fixture.nativeElement.querySelectorAll(".cal-nav");
      const nextMonthBtn = navButtons[2];
      const titleBefore =
        fixture.nativeElement.querySelector(".cal-title").textContent;
      nextMonthBtn.click();
      fixture.detectChanges();
      const titleAfter =
        fixture.nativeElement.querySelector(".cal-title").textContent;
      expect(titleAfter).not.toBe(titleBefore);
    });
  });

  describe("day selection", () => {
    it("should emit valueSelected when a day is clicked", () => {
      const spy = vi.fn();
      component.valueSelected.subscribe(spy);

      const enabledDay = fixture.nativeElement.querySelector(
        ".cal-day:not(.cal-day--disabled)",
      );
      enabledDay?.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBeInstanceOf(Date);
    });

    it("should not emit for disabled days", () => {
      // Set a very restrictive max to create disabled days
      fixture.componentRef.setInput("max", new Date(2000, 0, 1));
      fixture.detectChanges();

      const spy = vi.fn();
      component.valueSelected.subscribe(spy);

      const disabledDay =
        fixture.nativeElement.querySelector(".cal-day--disabled");
      disabledDay?.click();
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("today button", () => {
    it("should emit valueSelected with today's date", () => {
      const spy = vi.fn();
      component.valueSelected.subscribe(spy);

      const todayBtn = fixture.nativeElement.querySelector(".cal-today");
      todayBtn.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      const emitted = spy.mock.calls[0][0] as Date;
      const today = new Date();
      expect(emitted.getDate()).toBe(today.getDate());
      expect(emitted.getMonth()).toBe(today.getMonth());
      expect(emitted.getFullYear()).toBe(today.getFullYear());
    });
  });

  describe("currentValue parsing", () => {
    it("should highlight the selected day when currentValue is set", () => {
      fixture.componentRef.setInput("currentValue", "2026-03-15");
      fixture.componentRef.setInput("format", "yyyy-MM-dd");
      fixture.detectChanges();

      const selected =
        fixture.nativeElement.querySelector(".cal-day--selected");
      expect(selected).toBeTruthy();
      expect(selected.textContent.trim()).toBe("15");
    });
  });
});
