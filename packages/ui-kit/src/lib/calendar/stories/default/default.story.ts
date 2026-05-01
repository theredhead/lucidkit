import { UICalendarMonthView } from "../../calendar-month-view.component";
import { ArrayCalendarDatasource } from "../../array-calendar-datasource";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { CalendarEvent } from "../../calendar.types";

function sampleEvents(): CalendarEvent[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return [
    { id: "1", title: "Team standup", start: new Date(year, month, 3, 9, 0) },
    {
      id: "2",
      title: "Design review",
      start: new Date(year, month, 7, 14, 0),
      color: "#ea4335",
    },
    {
      id: "3",
      title: "Sprint planning",
      start: new Date(year, month, 12, 10, 0),
      color: "#4285f4",
    },
    {
      id: "4",
      title: "Conference",
      start: new Date(year, month, 18),
      end: new Date(year, month, 20),
      allDay: true,
      color: "#34a853",
    },
  ];
}

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICalendarMonthView],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly showWeekNumbers = input(false);
  public readonly maxEventsPerDay = input(3);
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Calendar month view");

  public readonly ds = new ArrayCalendarDatasource(sampleEvents());
  public selected = new Date();

  public onDate(date: Date): void {
    this.selected = date;
  }

  public onEvent(_event: CalendarEvent): void {}
}
