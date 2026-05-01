import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICalendarMonthView } from "../../calendar-month-view.component";
import { ArrayCalendarDatasource } from "../../array-calendar-datasource";
import type { CalendarEvent } from "../../calendar.types";

// ── Demo: Multi-day events ───────────────────────────────────────

@Component({
  selector: "ui-cal-multiday-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./multi-day-events.story.html",
})
export class CalendarMultiDayDemo {
  public readonly showWeekNumbers = input(false);
  public readonly maxEventsPerDay = input(3);
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Calendar month view");

  public readonly ds = new ArrayCalendarDatasource(
    (() => {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      return [
        {
          id: "md1",
          title: "Vacation",
          start: new Date(y, m, 5),
          end: new Date(y, m, 9),
          allDay: true,
          color: "#34a853",
        },
        {
          id: "md2",
          title: "Sprint",
          start: new Date(y, m, 14),
          end: new Date(y, m, 25),
          allDay: true,
          color: "#4285f4",
        },
        {
          id: "md3",
          title: "Workshop",
          start: new Date(y, m, 18),
          end: new Date(y, m, 20),
          allDay: true,
          color: "#ff6d00",
        },
        {
          id: "md4",
          title: "Standup",
          start: new Date(y, m, 18, 9, 0),
        },
      ] satisfies CalendarEvent[];
    })(),
  );
}
