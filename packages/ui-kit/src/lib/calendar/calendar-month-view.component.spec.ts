import { Component, signal, viewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UICalendarMonthView } from "./calendar-month-view.component";
import { ArrayCalendarDatasource } from "./array-calendar-datasource";
import type { CalendarEvent } from "./calendar.types";
import { PopoverService } from "../popover/popover.service";
import { PopoverRef } from "../popover/popover.types";

function makeEvent(
  id: string,
  title: string,
  start: Date,
  end?: Date,
  opts?: Partial<CalendarEvent>,
): CalendarEvent {
  return { id, title, start, end, ...opts };
}

const marchEvents: CalendarEvent[] = [
  makeEvent("1", "Standup", new Date(2025, 2, 3, 9, 0)),
  makeEvent("2", "Lunch meeting", new Date(2025, 2, 3, 12, 0), undefined, {
    color: "#ea4335",
  }),
  makeEvent("3", "Sprint review", new Date(2025, 2, 14, 15, 0)),
  makeEvent("4", "Conference", new Date(2025, 2, 20), new Date(2025, 2, 22), {
    allDay: true,
  }),
];

@Component({
  selector: "ui-test-calendar-host",
  standalone: true,
  imports: [UICalendarMonthView],
  template: `
    <ui-calendar-month-view
      [datasource]="datasource()"
      [(selectedDate)]="selectedDate"
      [maxEventsPerDay]="maxEvents()"
      [ariaLabel]="ariaLabel()"
      [showWeekNumbers]="showWeekNumbers()"
    />
  `,
})
class TestCalendarHost {
  public readonly calendar = viewChild.required(UICalendarMonthView);
  public readonly datasource = signal(new ArrayCalendarDatasource(marchEvents));
  public selectedDate = signal(new Date(2025, 2, 15));
  public readonly maxEvents = signal(3);
  public readonly ariaLabel = signal("Calendar month view");
  public readonly showWeekNumbers = signal(false);
}

describe("UICalendarMonthView", () => {
  let fixture: ComponentFixture<TestCalendarHost>;
  let host: TestCalendarHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCalendarHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestCalendarHost);
    host = fixture.componentInstance;

    // Set the display month to March 2025 for predictable tests
    host.calendar().goToMonth(new Date(2025, 2, 1));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.calendar()).toBeTruthy();
  });

  describe("rendering", () => {
    it("should render the month label", () => {
      const label = fixture.nativeElement.querySelector(".month-label");
      expect(label.textContent.trim()).toBe("March 2025");
    });

    it("should render 7 weekday headers", () => {
      const headers = fixture.nativeElement.querySelectorAll(".weekday");
      expect(headers.length).toBe(7);
      expect(headers[0].textContent.trim()).toBe("Mon");
      expect(headers[6].textContent.trim()).toBe("Sun");
    });

    it("should render 42 day cells (6 weeks × 7 days)", () => {
      const days = fixture.nativeElement.querySelectorAll(".day");
      expect(days.length).toBe(42);
    });

    it("should render navigation buttons", () => {
      const buttons = fixture.nativeElement.querySelectorAll(".nav-btn");
      expect(buttons.length).toBe(2);
    });

    it("should mark days outside the current month", () => {
      const outsideDays =
        fixture.nativeElement.querySelectorAll(".day--outside");
      expect(outsideDays.length).toBeGreaterThan(0);
    });
  });

  describe("events", () => {
    it("should render event badges on days with events", () => {
      const events = fixture.nativeElement.querySelectorAll(".event");
      expect(events.length).toBeGreaterThan(0);
    });

    it("should show event title in badge", () => {
      const events = fixture.nativeElement.querySelectorAll(".event");
      const titles = Array.from(events).map((e: unknown) =>
        (e as HTMLElement).textContent?.trim(),
      );
      expect(titles).toContain("Standup");
    });

    it("should apply custom event color", () => {
      const events = fixture.nativeElement.querySelectorAll(".event");
      const lunchEvent = Array.from(events).find(
        (e: unknown) =>
          (e as HTMLElement).textContent?.trim() === "Lunch meeting",
      ) as HTMLElement;
      expect(lunchEvent).toBeTruthy();
      expect(lunchEvent.style.backgroundColor).toBeTruthy();
    });

    it("should show overflow indicator when events exceed max", () => {
      // Add extra events to March 3 to exceed the default max of 3
      const ds = new ArrayCalendarDatasource([
        ...marchEvents,
        makeEvent("5", "Extra 1", new Date(2025, 2, 3, 10, 0)),
        makeEvent("6", "Extra 2", new Date(2025, 2, 3, 11, 0)),
      ]);
      host.datasource.set(ds);
      host.maxEvents.set(2);
      fixture.detectChanges();

      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      expect(overflow).toBeTruthy();
      expect(overflow.textContent).toContain("more");
    });
  });

  describe("navigation", () => {
    it("should navigate to next month", () => {
      host.calendar().nextMonth();
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector(".month-label");
      expect(label.textContent.trim()).toBe("April 2025");
    });

    it("should navigate to previous month", () => {
      host.calendar().previousMonth();
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector(".month-label");
      expect(label.textContent.trim()).toBe("February 2025");
    });

    it("should navigate via prev button click", () => {
      const prevBtn = fixture.nativeElement.querySelector(
        '.nav-btn[aria-label="Previous month"]',
      );
      prevBtn.click();
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector(".month-label");
      expect(label.textContent.trim()).toBe("February 2025");
    });

    it("should navigate via next button click", () => {
      const nextBtn = fixture.nativeElement.querySelector(
        '.nav-btn[aria-label="Next month"]',
      );
      nextBtn.click();
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector(".month-label");
      expect(label.textContent.trim()).toBe("April 2025");
    });

    it("should emit monthChanged on navigation", () => {
      const spy = vi.fn();
      host.calendar().monthChanged.subscribe(spy);
      host.calendar().nextMonth();
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("day selection", () => {
    it("should mark the selected day", () => {
      const selectedDay =
        fixture.nativeElement.querySelector(".day--selected");
      expect(selectedDay).toBeTruthy();
    });

    it("should emit dateSelected on day click", () => {
      const spy = vi.fn();
      host.calendar().dateSelected.subscribe(spy);
      const days = fixture.nativeElement.querySelectorAll(".day");
      // Click a day that's in the current month
      const inMonthDay = Array.from(days).find(
        (d: unknown) =>
          !(d as HTMLElement).classList.contains("day--outside"),
      ) as HTMLElement;
      inMonthDay?.click();
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should update selectedDate on day click", () => {
      const days = fixture.nativeElement.querySelectorAll(
        ".day:not(.day--outside)",
      );
      if (days.length > 0) {
        (days[5] as HTMLElement).click();
        fixture.detectChanges();
        expect(host.selectedDate()).toBeInstanceOf(Date);
      }
    });
  });

  describe("event selection", () => {
    it("should open popover on second click of a day with events", () => {
      const popoverService = TestBed.inject(PopoverService);
      const mockRef = new PopoverRef<CalendarEvent | undefined>();
      vi.spyOn(popoverService, "openPopover").mockReturnValue(
        mockRef as ReturnType<typeof popoverService.openPopover>,
      );

      const eventBadge = fixture.nativeElement.querySelector(".event");
      expect(eventBadge).toBeTruthy();

      const dayCell = eventBadge.closest(".day") as HTMLElement;

      // First click selects the day — no popover
      dayCell.click();
      fixture.detectChanges();
      expect(popoverService.openPopover).not.toHaveBeenCalled();

      // Second click on the already-selected day opens the popover
      dayCell.click();
      fixture.detectChanges();
      expect(popoverService.openPopover).toHaveBeenCalledOnce();
    });
  });

  describe("accessibility", () => {
    it("should have role=grid on the container", () => {
      const grid = fixture.nativeElement.querySelector(".container");
      expect(grid.getAttribute("role")).toBe("grid");
    });

    it("should have aria-label on the container", () => {
      const grid = fixture.nativeElement.querySelector(".container");
      expect(grid.getAttribute("aria-label")).toBe("Calendar month view");
    });

    it("should have role=columnheader on weekday labels", () => {
      const header = fixture.nativeElement.querySelector(".weekday");
      expect(header.getAttribute("role")).toBe("columnheader");
    });

    it("should have role=gridcell on day cells", () => {
      const cell = fixture.nativeElement.querySelector(".day");
      expect(cell.getAttribute("role")).toBe("gridcell");
    });

    it("should have aria-label on day cells", () => {
      const cell = fixture.nativeElement.querySelector(".day");
      expect(cell.getAttribute("aria-label")).toBeTruthy();
    });

    it("should support custom ariaLabel", () => {
      host.ariaLabel.set("My calendar");
      fixture.detectChanges();
      const grid = fixture.nativeElement.querySelector(".container");
      expect(grid.getAttribute("aria-label")).toBe("My calendar");
    });
  });

  describe("multi-day events", () => {
    it("should show conference event across multiple days", () => {
      // Conference is March 20–22
      // Find events on March 20, 21, 22
      const days = fixture.nativeElement.querySelectorAll(
        ".day:not(.day--outside)",
      );
      // March 20 is the 20th day, 0-indexed from first in-month day
      let confDayCount = 0;
      days.forEach((day: HTMLElement) => {
        const events = day.querySelectorAll(".event");
        events.forEach((evt: Element) => {
          if (evt.textContent?.trim() === "Conference") {
            confDayCount++;
          }
        });
      });
      expect(confDayCount).toBe(3); // March 20, 21, 22
    });
  });

  describe("week numbers", () => {
    it("should not show week numbers by default", () => {
      const wkCells =
        fixture.nativeElement.querySelectorAll(".week-number");
      expect(wkCells.length).toBe(0);
    });

    it("should not show Wk header by default", () => {
      const wkHeader = fixture.nativeElement.querySelector(".weekday--wk");
      expect(wkHeader).toBeNull();
    });

    it("should show week numbers when showWeekNumbers is true", () => {
      host.showWeekNumbers.set(true);
      fixture.detectChanges();

      const wkCells =
        fixture.nativeElement.querySelectorAll(".week-number");
      expect(wkCells.length).toBe(6); // 6 week rows
    });

    it("should show Wk column header when showWeekNumbers is true", () => {
      host.showWeekNumbers.set(true);
      fixture.detectChanges();

      const wkHeader = fixture.nativeElement.querySelector(".weekday--wk");
      expect(wkHeader).toBeTruthy();
      expect(wkHeader.textContent.trim()).toBe("Wk");
    });

    it("should display correct ISO week numbers for March 2025", () => {
      host.showWeekNumbers.set(true);
      fixture.detectChanges();

      const wkCells =
        fixture.nativeElement.querySelectorAll(".week-number");
      const weekNums = Array.from(wkCells).map((c: unknown) =>
        parseInt((c as HTMLElement).textContent!.trim(), 10),
      );
      // March 2025 starts on Saturday → grid starts Mon Feb 24 (week 9)
      // Weeks: 9, 10, 11, 12, 13, 14
      expect(weekNums).toEqual([9, 10, 11, 12, 13, 14]);
    });

    it("should add week-numbers modifier class to container", () => {
      host.showWeekNumbers.set(true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(".container");
      expect(container.classList).toContain("container--week-numbers");
    });

    it("should have role=rowheader on week number cells", () => {
      host.showWeekNumbers.set(true);
      fixture.detectChanges();

      const wkCell = fixture.nativeElement.querySelector(".week-number");
      expect(wkCell.getAttribute("role")).toBe("rowheader");
    });
  });

  describe("day-detail popover", () => {
    let popoverService: PopoverService;
    let mockRef: PopoverRef<CalendarEvent | undefined>;

    beforeEach(() => {
      // Set up a datasource with more events than maxEventsPerDay
      const ds = new ArrayCalendarDatasource([
        ...marchEvents,
        makeEvent("5", "Extra 1", new Date(2025, 2, 3, 10, 0)),
        makeEvent("6", "Extra 2", new Date(2025, 2, 3, 11, 0)),
      ]);
      host.datasource.set(ds);
      host.maxEvents.set(2);
      // Pre-select March 3 so the first click counts as "already selected"
      host.selectedDate.set(new Date(2025, 2, 3));
      host.calendar().goToMonth(new Date(2025, 2, 1));
      fixture.detectChanges();

      popoverService = TestBed.inject(PopoverService);
      mockRef = new PopoverRef<CalendarEvent | undefined>();
      vi.spyOn(popoverService, "openPopover").mockReturnValue(
        mockRef as ReturnType<typeof popoverService.openPopover>,
      );
    });

    it("should still show overflow indicator text", () => {
      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      expect(overflow).toBeTruthy();
      expect(overflow.textContent).toContain("more");
    });

    it("should open popover when clicking a day with overflow", () => {
      // Find the day cell that contains the overflow indicator (March 3)
      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      const dayCell = overflow.closest(".day") as HTMLElement;
      expect(dayCell).toBeTruthy();

      dayCell.click();
      fixture.detectChanges();

      expect(popoverService.openPopover).toHaveBeenCalledOnce();
    });

    it("should pass the day data as input to the popover", () => {
      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      const dayCell = overflow.closest(".day") as HTMLElement;
      dayCell.click();
      fixture.detectChanges();

      const call = vi.mocked(popoverService.openPopover).mock.calls[0][0];
      expect(call.inputs).toBeDefined();
      expect(call.inputs!["day"]).toBeDefined();
      expect((call.inputs!["day"] as { events: unknown[] }).events.length).toBe(
        4,
      );
    });

    it("should set ariaLabel on the popover", () => {
      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      const dayCell = overflow.closest(".day") as HTMLElement;
      dayCell.click();
      fixture.detectChanges();

      const call = vi.mocked(popoverService.openPopover).mock.calls[0][0];
      expect(call.ariaLabel).toContain("Events on");
    });

    it("should not open popover when clicking a day without events", () => {
      // Find a day cell that has no events at all
      const days = fixture.nativeElement.querySelectorAll(
        ".day:not(.day--outside)",
      );
      const dayWithoutEvents = Array.from(days).find(
        (d: unknown) => !(d as HTMLElement).querySelector(".event"),
      ) as HTMLElement;
      expect(dayWithoutEvents).toBeTruthy();

      // First click selects
      dayWithoutEvents.click();
      fixture.detectChanges();
      // Second click — still no popover because no events
      dayWithoutEvents.click();
      fixture.detectChanges();

      expect(popoverService.openPopover).not.toHaveBeenCalled();
    });

    it("should open popover on second click of a day with events (even without overflow)", () => {
      // March 14 has 1 event (Sprint review) — no overflow with max 2
      const days = fixture.nativeElement.querySelectorAll(
        ".day:not(.day--outside)",
      );
      const dayWithOneEvent = Array.from(days).find((d: unknown) => {
        const el = d as HTMLElement;
        const events = el.querySelectorAll(
          ".event:not(.event--overflow)",
        );
        return events.length === 1 && !el.querySelector(".event--overflow");
      }) as HTMLElement;
      expect(dayWithOneEvent).toBeTruthy();

      // First click selects — no popover
      dayWithOneEvent.click();
      fixture.detectChanges();
      expect(popoverService.openPopover).not.toHaveBeenCalled();

      // Second click on already-selected day opens the popover
      dayWithOneEvent.click();
      fixture.detectChanges();
      expect(popoverService.openPopover).toHaveBeenCalledOnce();
    });

    it("should emit eventSelected when popover closes with a result", () => {
      const spy = vi.fn();
      host.calendar().eventSelected.subscribe(spy);

      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      const dayCell = overflow.closest(".day") as HTMLElement;
      dayCell.click();
      fixture.detectChanges();

      // Simulate popover closing with a selected event
      const selectedEvent = makeEvent(
        "1",
        "Standup",
        new Date(2025, 2, 3, 9, 0),
      );
      mockRef.close(selectedEvent);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ id: "1", title: "Standup" }),
      );
    });

    it("should not emit eventSelected when popover is dismissed", () => {
      const spy = vi.fn();
      host.calendar().eventSelected.subscribe(spy);

      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      const dayCell = overflow.closest(".day") as HTMLElement;
      dayCell.click();
      fixture.detectChanges();

      // Simulate light-dismiss (no result)
      mockRef.close(undefined);

      expect(spy).not.toHaveBeenCalled();
    });

    it("should close existing popover before opening a new one", () => {
      const closeSpy = vi.spyOn(mockRef, "close");

      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      const dayCell = overflow.closest(".day") as HTMLElement;

      // First click opens popover
      dayCell.click();
      fixture.detectChanges();
      expect(popoverService.openPopover).toHaveBeenCalledOnce();

      // Create a new mock ref for the second open
      const mockRef2 = new PopoverRef<CalendarEvent | undefined>();
      vi.mocked(popoverService.openPopover).mockReturnValue(
        mockRef2 as ReturnType<typeof popoverService.openPopover>,
      );

      // Second click — should close the first popover and open a new one
      dayCell.click();
      fixture.detectChanges();

      expect(closeSpy).toHaveBeenCalledWith(undefined);
      expect(popoverService.openPopover).toHaveBeenCalledTimes(2);
    });

    it("should use the day cell as the popover anchor", () => {
      const overflow = fixture.nativeElement.querySelector(
        ".event--overflow",
      );
      const dayCell = overflow.closest(".day") as HTMLElement;
      dayCell.click();
      fixture.detectChanges();

      const call = vi.mocked(popoverService.openPopover).mock.calls[0][0];
      expect(call.anchor).toBe(dayCell);
    });
  });
});
