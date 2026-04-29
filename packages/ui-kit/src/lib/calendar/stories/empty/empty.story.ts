import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { UICalendarMonthView } from "../../calendar-month-view.component";
import { ArrayCalendarDatasource } from "../../array-calendar-datasource";
import type { CalendarEvent } from "../../calendar.types";
import { UIButton } from "../../../button/button.component";

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
