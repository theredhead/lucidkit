import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICalendarMonthView } from "../../calendar-month-view.component";
import { ArrayCalendarDatasource } from "../../array-calendar-datasource";

// ── Demo: Empty calendar ─────────────────────────────────────────

@Component({
  selector: "ui-cal-empty-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./empty.story.html",
})
export class CalendarEmptyDemo {
  public readonly showWeekNumbers = input(false);
  public readonly maxEventsPerDay = input(3);
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Calendar month view");

  public readonly ds = new ArrayCalendarDatasource([]);
}
