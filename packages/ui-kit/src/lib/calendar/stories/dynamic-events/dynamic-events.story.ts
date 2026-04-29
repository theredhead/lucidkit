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

// ── Demo: Dynamic events ─────────────────────────────────────────

@Component({
  selector: "ui-cal-dynamic-demo",
  standalone: true,
  imports: [UICalendarMonthView, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dynamic-events.story.html",
})
export class CalendarDynamicDemo {
  public readonly ds = new ArrayCalendarDatasource(sampleEvents());

  private counter = 100;
  private readonly colors = [
    "#4285f4",
    "#ea4335",
    "#34a853",
    "#fbbc04",
    "#9c27b0",
  ];

  public addEvent(): void {
    const now = new Date();
    const day = Math.floor(Math.random() * 28) + 1;
    this.ds.addEvent({
      id: `dyn-${this.counter++}`,
      title: `Event #${this.counter}`,
      start: new Date(now.getFullYear(), now.getMonth(), day, 10, 0),
      color: this.colors[this.counter % this.colors.length],
    });
  }

  public clear(): void {
    this.ds.setEvents([]);
  }
}
