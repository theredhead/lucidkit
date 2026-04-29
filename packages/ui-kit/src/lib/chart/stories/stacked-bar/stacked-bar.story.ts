import { Component } from '@angular/core';
import {
  UIChart,
  StackedBarGraphStrategy,
  type ChartLayer,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIChart],
  template: `
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [sources]="layers"
      [strategy]="strategy"
    />
  `,
})
export class StackedBarComponent {
  readonly data = [ /* ... */ ];
  readonly strategy = new StackedBarGraphStrategy();
  readonly layers: ChartLayer<any>[] = [
    { name: 'Cost',   valueProperty: 'cost' },
    { name: 'Profit', valueProperty: 'profit' },
  ];
}
