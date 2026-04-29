import { Component, signal } from '@angular/core';
import { UISegmentedControl, type SegmentedItem } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UISegmentedControl],
  template: `<ui-segmented-control [items]="viewItems" [(value)]="activeView" />`,
})
export class ExampleComponent {
  public readonly activeView = signal('week');
  public readonly viewItems: SegmentedItem[] = [
    { id: 'day',   label: 'Day' },
    { id: 'week',  label: 'Week' },
    { id: 'month', label: 'Month' },
  ];
}
