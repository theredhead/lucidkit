import { ChangeDetectionStrategy, Component } from "@angular/core";
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
  public readonly ds = new ArrayCalendarDatasource([]);
}
