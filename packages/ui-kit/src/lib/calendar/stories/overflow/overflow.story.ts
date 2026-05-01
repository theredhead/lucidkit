import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICalendarMonthView } from "../../calendar-month-view.component";
import { ArrayCalendarDatasource } from "../../array-calendar-datasource";
import type { CalendarEvent } from "../../calendar.types";

function busyDayEvents(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  return [
    { id: "b1", title: "Standup", start: new Date(y, m, 10, 9, 0) },
    {
      id: "b2",
      title: "Code review",
      start: new Date(y, m, 10, 10, 0),
      color: "#4285f4",
    },
    {
      id: "b3",
      title: "Lunch & learn",
      start: new Date(y, m, 10, 12, 0),
      color: "#34a853",
    },
    {
      id: "b4",
      title: "1:1 with manager",
      start: new Date(y, m, 10, 14, 0),
      color: "#fbbc04",
    },
    {
      id: "b5",
      title: "Sprint review",
      start: new Date(y, m, 10, 15, 30),
      color: "#ea4335",
    },
    {
      id: "b6",
      title: "Team social",
      start: new Date(y, m, 10, 17, 0),
      color: "#9c27b0",
    },
  ];
}

// ── Demo: Overflow (busy day) ────────────────────────────────────

@Component({
  selector: "ui-cal-overflow-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./overflow.story.html",
})
export class CalendarOverflowDemo {
  public readonly showWeekNumbers = input(false);
  public readonly maxEventsPerDay = input(2);
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Calendar month view");

  public readonly ds = new ArrayCalendarDatasource(busyDayEvents());
}
