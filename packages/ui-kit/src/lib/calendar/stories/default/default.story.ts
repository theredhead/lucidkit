import { Component, signal } from '@angular/core';
import { UICalendarMonthView, ArrayCalendarDatasource } from '@theredhead/lucid-kit';
import type { CalendarEvent } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICalendarMonthView],
  template: \`
    <ui-calendar-month-view
      [datasource]="ds"
      [(selectedDate)]="selected"
      (dateSelected)="onDate($event)"
      (eventSelected)="onEvent($event)"
    />
  \`,
})
export class ExampleComponent {
  readonly ds = new ArrayCalendarDatasource([
    { id: '1', title: 'Team standup', start: new Date(), color: '#4285f4' },
  ]);
  readonly selected = signal(new Date());

  onDate(d: Date) { this.selected.set(d); }
  onEvent(e: CalendarEvent) { console.log(e.title); }
}
