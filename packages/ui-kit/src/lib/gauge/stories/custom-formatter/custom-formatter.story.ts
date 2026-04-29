import { Component } from '@angular/core';
import { UIGauge, AnalogGaugeStrategy } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-revenue-gauge',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge
      [value]="revenue"
      [min]="0" [max]="5000"
      unit="USD"
      [strategy]="strategy"
      [formatValue]="formatCurrency"
    />
  \`,
})
export class RevenueGaugeComponent {
  readonly revenue = 1234.50;
  readonly strategy = new AnalogGaugeStrategy();

  formatCurrency = (n: number): string =>
    '$' + n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}
