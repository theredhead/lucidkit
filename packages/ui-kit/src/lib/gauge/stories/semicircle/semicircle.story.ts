import { Component } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  type GaugeZone,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-temp-gauge',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge
      [value]="temperature"
      [min]="0" [max]="100"
      unit="°C"
      [strategy]="strategy"
      [zones]="zones"
      [width]="280" [height]="160"
    />
  \`,
})
export class TempGaugeComponent {
  readonly temperature = 65;
  readonly strategy = new AnalogGaugeStrategy({
    sweepDegrees: 180,
    majorTicks: 5,
  });
  readonly zones: GaugeZone[] = [
    { from: 0, to: 60, color: '#34a853' },
    { from: 60, to: 80, color: '#fbbc04' },
    { from: 80, to: 100, color: '#ea4335' },
  ];
}
