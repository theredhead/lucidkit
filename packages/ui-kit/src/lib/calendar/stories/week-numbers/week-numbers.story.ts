import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICalendarMonthView } from "../../calendar-month-view.component";
import { ArrayCalendarDatasource } from "../../array-calendar-datasource";
import type { CalendarEvent } from "../../calendar.types";

// ── Shared fixtures ──────────────────────────────────────────────

function sampleEvents(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  return [
    {
      id: "1",
      title: "Team standup",
      start: new Date(y, m, 3, 9, 0),
      allDay: false,
    },
    {
      id: "2",
      title: "Design review",
      start: new Date(y, m, 3, 14, 0),
      color: "#ea4335",
    },
    {
      id: "3",
      title: "Sprint planning",
      start: new Date(y, m, 7, 10, 0),
      color: "#4285f4",
    },
    {
      id: "4",
      title: "Conference",
      start: new Date(y, m, 12),
      end: new Date(y, m, 14),
      allDay: true,
      color: "#34a853",
    },
    {
      id: "5",
      title: "Dentist appointment",
      start: new Date(y, m, 18, 11, 30),
      color: "#fbbc04",
    },
    {
      id: "6",
      title: "Product demo",
      start: new Date(y, m, 21, 15, 0),
    },
    {
      id: "7",
      title: "Retrospective",
      start: new Date(y, m, 24, 16, 0),
      color: "#9c27b0",
    },
    {
      id: "8",
      title: "Hackathon",
      start: new Date(y, m, 26),
      end: new Date(y, m, 27),
      allDay: true,
      color: "#ff6d00",
    },
  ];
}

// ── Demo: Week numbers ──────────────────────────────────────────

@Component({
  selector: "ui-cal-weeknumbers-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./week-numbers.story.html",
})
export class CalendarWeekNumbersDemo {
  public readonly showWeekNumbers = input(true);
  public readonly maxEventsPerDay = input(3);
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Calendar month view");

  public readonly ds = new ArrayCalendarDatasource(sampleEvents());
}
