import { Component } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  type GaugeZone,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-threshold-demo',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge
      [value]="load"
      [min]="0" [max]="100"
      unit="%"
      [strategy]="strategy"
      [zones]="zones"
      [thresholds]="thresholds"
    />
  \`,
})
export class ThresholdDemoComponent {
  readonly load = 55;
  readonly strategy = new AnalogGaugeStrategy();
  readonly zones: GaugeZone[] = [
    { from: 0, to: 60, color: '#34a853', label: 'Safe' },
    { from: 60, to: 80, color: '#fbbc04', label: 'Warning' },
    { from: 80, to: 100, color: '#ea4335', label: 'Danger' },
  ];
  readonly thresholds = [40, 75];
}
