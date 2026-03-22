import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIDatePicker } from "./date-picker.component";
import { UI_DATE_PICKER_DEFAULTS } from "./date-picker.types";
import {
  formatDate,
  parseDate,
  buildCalendarGrid,
  normalizeDate,
  getWeekdayLabels,
  getPlaceholder,
  getLocaleFormat,
  getLocaleFirstDayOfWeek,
  isSameMonth,
} from "./date-picker.utils";

describe("UIDatePicker", () => {
  let component: UIDatePicker;
  let fixture: ComponentFixture<UIDatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIDatePicker],
    }).compileComponents();

    fixture = TestBed.createComponent(UIDatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("host class", () => {
    it("should have the ui-date-picker class", () => {
      expect(fixture.nativeElement.classList.contains("ui-date-picker")).toBe(
        true,
      );
    });
  });

  describe("defaults", () => {
    it("should default format to the user's locale", () => {
      expect(component.format()).toBe(getLocaleFormat());
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

    it("should default firstDayOfWeek to the user's locale", () => {
      expect(component.firstDayOfWeek()).toBe(getLocaleFirstDayOfWeek());
    });

    it('should default ariaLabel to "Date"', () => {
      expect(component.ariaLabel()).toBe("Date");
    });
  });

  describe("input element", () => {
    it("should render a text input", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      expect(input).toBeTruthy();
      expect(input.type).toBe("text");
    });

    it("should show placeholder from the format", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      expect(input.placeholder).toBe(getLocaleFormat());
    });

    it("should forward custom placeholder", () => {
      fixture.componentRef.setInput("placeholder", "Enter date…");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      expect(input.placeholder).toBe("Enter date…");
    });

    it("should forward ariaLabel to the input", () => {
      fixture.componentRef.setInput("ariaLabel", "Birth date");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      expect(input.getAttribute("aria-label")).toBe("Birth date");
    });

    it("should disable the input when disabled is true", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      expect(input.disabled).toBe(true);
    });

    it("should mark the input readonly when readonly is true", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      expect(input.readOnly).toBe(true);
    });
  });

  describe("toggle button", () => {
    it("should render a toggle button", () => {
      const btn = fixture.nativeElement.querySelector(".toggle");
      expect(btn).toBeTruthy();
    });

    it("should disable toggle when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      expect(btn.disabled).toBe(true);
    });

    it("should disable toggle when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      expect(btn.disabled).toBe(true);
    });
  });

  describe("calendar popup", () => {
    it("should not show the calendar initially", () => {
      const cal = fixture.nativeElement.querySelector(".calendar");
      expect(cal).toBeNull();
    });

    it("should open the calendar on toggle button click", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const cal = fixture.nativeElement.querySelector(".calendar");
      expect(cal).toBeTruthy();
    });

    it("should close the calendar on second toggle click", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".calendar")).toBeTruthy();

      btn.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".calendar")).toBeNull();
    });

    it("should close the calendar on document click outside", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".calendar")).toBeTruthy();

      document.body.click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".calendar")).toBeNull();
    });

    it("should not close calendar when clicking inside", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      fixture.nativeElement.click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".calendar")).toBeTruthy();
    });

    it("should not open calendar when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".calendar")).toBeNull();
    });

    it("should render weekday headers", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const headers = fixture.nativeElement.querySelectorAll(".cal-weekday");
      expect(headers.length).toBe(7);
    });

    it("should render 42 day cells", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const days = fixture.nativeElement.querySelectorAll(".cal-day");
      expect(days.length).toBe(42);
    });

    it("should render month/year title", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector(".cal-title");
      expect(title.textContent.trim()).toMatch(/\w+ \d{4}/);
    });
  });

  describe("day selection", () => {
    it("should set value when clicking a day", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const days: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll(
          ".cal-day:not(.cal-day--outside):not(.cal-day--disabled)",
        );
      const firstDay = days[0];
      firstDay.click();
      fixture.detectChanges();

      expect(component.value()).toBeTruthy();
      expect(component.value()!.getDate()).toBe(
        parseInt(firstDay.textContent!.trim(), 10),
      );
    });

    it("should close the calendar after selecting a day", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const days: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll(
          ".cal-day:not(.cal-day--outside):not(.cal-day--disabled)",
        );
      days[0].click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".calendar")).toBeNull();
    });

    it("should emit dateChange on day selection", () => {
      const spy = vi.fn();
      component.dateChange.subscribe(spy);

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const days: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll(
          ".cal-day:not(.cal-day--outside):not(.cal-day--disabled)",
        );
      days[0].click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBeInstanceOf(Date);
    });

    it("should highlight the selected day", () => {
      component.value.set(new Date());
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const selected =
        fixture.nativeElement.querySelector(".cal-day--selected");
      expect(selected).toBeTruthy();
    });
  });

  describe("month navigation", () => {
    it("should navigate to the previous month", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector(".cal-title");
      const originalText = title.textContent.trim();

      const prevBtn = fixture.nativeElement.querySelector(
        '[aria-label="Previous month"]',
      );
      prevBtn.click();
      fixture.detectChanges();

      expect(title.textContent.trim()).not.toBe(originalText);
    });

    it("should navigate to the next month", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector(".cal-title");
      const originalText = title.textContent.trim();

      const nextBtn = fixture.nativeElement.querySelector(
        '[aria-label="Next month"]',
      );
      nextBtn.click();
      fixture.detectChanges();

      expect(title.textContent.trim()).not.toBe(originalText);
    });

    it("should navigate to the previous year", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector(".cal-title");
      const text1 = title.textContent.trim();

      const prevYearBtn = fixture.nativeElement.querySelector(
        '[aria-label="Previous year"]',
      );
      prevYearBtn.click();
      fixture.detectChanges();

      const text2 = title.textContent.trim();
      // The year part should differ
      const year1 = parseInt(text1.split(" ").pop()!, 10);
      const year2 = parseInt(text2.split(" ").pop()!, 10);
      expect(year2).toBe(year1 - 1);
    });

    it("should navigate to the next year", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector(".cal-title");
      const text1 = title.textContent.trim();

      const nextYearBtn = fixture.nativeElement.querySelector(
        '[aria-label="Next year"]',
      );
      nextYearBtn.click();
      fixture.detectChanges();

      const text2 = title.textContent.trim();
      const year1 = parseInt(text1.split(" ").pop()!, 10);
      const year2 = parseInt(text2.split(" ").pop()!, 10);
      expect(year2).toBe(year1 + 1);
    });
  });

  describe("today button", () => {
    it("should navigate to today when clicking Today", () => {
      const spy = vi.fn();
      component.dateChange.subscribe(spy);

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const todayBtn = fixture.nativeElement.querySelector(".cal-today");
      todayBtn.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      const emitted = spy.mock.calls[0][0] as Date;
      const now = new Date();
      expect(emitted.getFullYear()).toBe(now.getFullYear());
      expect(emitted.getMonth()).toBe(now.getMonth());
      expect(emitted.getDate()).toBe(now.getDate());
    });
  });

  describe("text input", () => {
    it("should parse a typed date in the default format", () => {
      fixture.componentRef.setInput("format", "yyyy-MM-dd");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      input.value = "2025-06-15";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBeTruthy();
      expect(component.value()!.getFullYear()).toBe(2025);
      expect(component.value()!.getMonth()).toBe(5);
      expect(component.value()!.getDate()).toBe(15);
    });

    it("should clear value when input is emptied and blurred", () => {
      component.value.set(new Date(2025, 5, 15));
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      input.value = "";
      input.dispatchEvent(new Event("input"));
      input.dispatchEvent(new Event("blur"));
      fixture.detectChanges();

      expect(component.value()).toBeNull();
    });

    it("should not set invalid date text as value", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      input.value = "not-a-date";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBeNull();
    });
  });

  describe("min/max constraints", () => {
    it("should disable days before min", () => {
      const min = new Date(2025, 5, 10);
      fixture.componentRef.setInput("min", min);
      component.value.set(new Date(2025, 5, 15));
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const disabledDays =
        fixture.nativeElement.querySelectorAll(".cal-day--disabled");
      expect(disabledDays.length).toBeGreaterThan(0);
    });

    it("should disable days after max", () => {
      const max = new Date(2025, 5, 20);
      fixture.componentRef.setInput("max", max);
      component.value.set(new Date(2025, 5, 15));
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const disabledDays =
        fixture.nativeElement.querySelectorAll(".cal-day--disabled");
      expect(disabledDays.length).toBeGreaterThan(0);
    });

    it("should not accept typed dates outside min/max range", () => {
      const min = new Date(2025, 5, 10);
      const max = new Date(2025, 5, 20);
      fixture.componentRef.setInput("min", min);
      fixture.componentRef.setInput("max", max);
      fixture.componentRef.setInput("format", "yyyy-MM-dd");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      input.value = "2025-06-05";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBeNull();
    });
  });

  describe("keyboard interaction", () => {
    it("should open calendar on ArrowDown", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".calendar")).toBeTruthy();
    });

    it("should close calendar on Escape", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".calendar")).toBeTruthy();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".calendar")).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("should set aria-expanded on the input", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".input");
      expect(input.getAttribute("aria-expanded")).toBe("false");

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      expect(input.getAttribute("aria-expanded")).toBe("true");
    });

    it("should have a dialog role on the calendar", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const cal = fixture.nativeElement.querySelector(".calendar");
      expect(cal.getAttribute("role")).toBe("dialog");
    });

    it("should have gridcell role on day buttons", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const days = fixture.nativeElement.querySelectorAll(".cal-day");
      for (const day of days) {
        expect(day.getAttribute("role")).toBe("gridcell");
      }
    });

    it("should have columnheader role on weekday labels", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".toggle");
      btn.click();
      fixture.detectChanges();

      const headers = fixture.nativeElement.querySelectorAll(".cal-weekday");
      for (const h of headers) {
        expect(h.getAttribute("role")).toBe("columnheader");
      }
    });
  });
});

// ── App-wide defaults via DI ────────────────────────────────────

describe("UIDatePicker with UI_DATE_PICKER_DEFAULTS", () => {
  let component: UIDatePicker;
  let fixture: ComponentFixture<UIDatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIDatePicker],
      providers: [
        {
          provide: UI_DATE_PICKER_DEFAULTS,
          useValue: { format: "dd.MM.yyyy", firstDayOfWeek: 0 },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UIDatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should use the provided default format", () => {
    expect(component.format()).toBe("dd.MM.yyyy");
  });

  it("should use the provided default firstDayOfWeek", () => {
    expect(component.firstDayOfWeek()).toBe(0);
  });

  it("should show placeholder matching the provided format", () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector(".input");
    expect(input.placeholder).toBe("dd.MM.yyyy");
  });

  it("should allow explicit input to override the provided default", () => {
    fixture.componentRef.setInput("format", "yyyy-MM-dd");
    fixture.detectChanges();
    expect(component.format()).toBe("yyyy-MM-dd");
  });
});

// ── Utility function tests ──────────────────────────────────────

describe("date-picker utils", () => {
  describe("formatDate", () => {
    const date = new Date(2025, 2, 5); // March 5, 2025

    it("should format yyyy-MM-dd", () => {
      expect(formatDate(date, "yyyy-MM-dd")).toBe("2025-03-05");
    });

    it("should format dd/MM/yyyy", () => {
      expect(formatDate(date, "dd/MM/yyyy")).toBe("05/03/2025");
    });

    it("should format MM/dd/yyyy", () => {
      expect(formatDate(date, "MM/dd/yyyy")).toBe("03/05/2025");
    });

    it("should format dd.MM.yyyy", () => {
      expect(formatDate(date, "dd.MM.yyyy")).toBe("05.03.2025");
    });

    it("should format dd-MM-yyyy", () => {
      expect(formatDate(date, "dd-MM-yyyy")).toBe("05-03-2025");
    });

    it("should format yyyy/MM/dd", () => {
      expect(formatDate(date, "yyyy/MM/dd")).toBe("2025/03/05");
    });

    it("should return empty string for null", () => {
      expect(formatDate(null, "yyyy-MM-dd")).toBe("");
    });
  });

  describe("parseDate", () => {
    it("should parse yyyy-MM-dd", () => {
      const d = parseDate("2025-03-15", "yyyy-MM-dd");
      expect(d).toBeTruthy();
      expect(d!.getFullYear()).toBe(2025);
      expect(d!.getMonth()).toBe(2);
      expect(d!.getDate()).toBe(15);
    });

    it("should parse dd/MM/yyyy", () => {
      const d = parseDate("15/03/2025", "dd/MM/yyyy");
      expect(d).toBeTruthy();
      expect(d!.getDate()).toBe(15);
      expect(d!.getMonth()).toBe(2);
    });

    it("should parse MM/dd/yyyy", () => {
      const d = parseDate("03/15/2025", "MM/dd/yyyy");
      expect(d).toBeTruthy();
      expect(d!.getDate()).toBe(15);
      expect(d!.getMonth()).toBe(2);
    });

    it("should parse dd.MM.yyyy", () => {
      const d = parseDate("15.03.2025", "dd.MM.yyyy");
      expect(d).toBeTruthy();
      expect(d!.getDate()).toBe(15);
    });

    it("should parse dd-MM-yyyy", () => {
      const d = parseDate("15-03-2025", "dd-MM-yyyy");
      expect(d).toBeTruthy();
      expect(d!.getDate()).toBe(15);
    });

    it("should parse yyyy/MM/dd", () => {
      const d = parseDate("2025/03/15", "yyyy/MM/dd");
      expect(d).toBeTruthy();
      expect(d!.getFullYear()).toBe(2025);
    });

    it("should return null for invalid text", () => {
      expect(parseDate("hello", "yyyy-MM-dd")).toBeNull();
    });

    it("should return null for invalid date like Feb 30", () => {
      expect(parseDate("2025-02-30", "yyyy-MM-dd")).toBeNull();
    });

    it("should return null for incomplete input", () => {
      expect(parseDate("2025-03", "yyyy-MM-dd")).toBeNull();
    });
  });

  describe("buildCalendarGrid", () => {
    it("should return 42 days", () => {
      const grid = buildCalendarGrid(new Date(2025, 5, 1), null, null, null, 1);
      expect(grid.length).toBe(42);
    });

    it("should mark today", () => {
      const today = new Date();
      const grid = buildCalendarGrid(today, null, null, null, 1);
      const todayCell = grid.find((d) => d.isToday);
      expect(todayCell).toBeTruthy();
    });

    it("should mark selected date", () => {
      const sel = new Date(2025, 5, 15);
      const grid = buildCalendarGrid(new Date(2025, 5, 1), sel, null, null, 1);
      const selCell = grid.find((d) => d.isSelected);
      expect(selCell).toBeTruthy();
      expect(selCell!.day).toBe(15);
    });

    it("should mark days outside min as disabled", () => {
      const min = new Date(2025, 5, 10);
      const grid = buildCalendarGrid(new Date(2025, 5, 1), null, min, null, 1);
      const day5 = grid.find((d) => d.isCurrentMonth && d.day === 5);
      expect(day5?.isDisabled).toBe(true);
    });

    it("should mark days after max as disabled", () => {
      const max = new Date(2025, 5, 20);
      const grid = buildCalendarGrid(new Date(2025, 5, 1), null, null, max, 1);
      const day25 = grid.find((d) => d.isCurrentMonth && d.day === 25);
      expect(day25?.isDisabled).toBe(true);
    });
  });

  describe("normalizeDate", () => {
    it("should strip time information", () => {
      const d = normalizeDate(new Date(2025, 5, 15, 14, 30, 45));
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
      expect(d.getSeconds()).toBe(0);
      expect(d.getMilliseconds()).toBe(0);
    });
  });

  describe("getWeekdayLabels", () => {
    it("should return 7 labels", () => {
      expect(getWeekdayLabels(1).length).toBe(7);
    });

    it("should start with Monday when firstDayOfWeek is 1", () => {
      const labels = getWeekdayLabels(1);
      expect(labels[0].long).toBe("Monday");
    });

    it("should start with Sunday when firstDayOfWeek is 0", () => {
      const labels = getWeekdayLabels(0);
      expect(labels[0].long).toBe("Sunday");
    });
  });

  describe("getPlaceholder", () => {
    it("should return the format string", () => {
      expect(getPlaceholder("dd/MM/yyyy")).toBe("dd/MM/yyyy");
    });
  });

  describe("isSameMonth", () => {
    it("should return true for same month and year", () => {
      expect(isSameMonth(new Date(2025, 5, 1), new Date(2025, 5, 28))).toBe(
        true,
      );
    });

    it("should return false for different months", () => {
      expect(isSameMonth(new Date(2025, 5, 1), new Date(2025, 6, 1))).toBe(
        false,
      );
    });

    it("should return false for different years", () => {
      expect(isSameMonth(new Date(2025, 5, 1), new Date(2026, 5, 1))).toBe(
        false,
      );
    });
  });
});
