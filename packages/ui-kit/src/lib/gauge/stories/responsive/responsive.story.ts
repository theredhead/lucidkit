import { Component } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  type GaugeZone,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-responsive-gauge',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <div style="width: 100%; height: 300px;">
      <ui-gauge
        [value]="speed"
        [min]="0" [max]="220"
        unit="km/h"
        [strategy]="strategy"
        [zones]="zones"
        [fit]="true"
      />
    </div>
  \`,
})
export class ResponsiveGaugeComponent {
  readonly speed = 72;
  readonly strategy = new AnalogGaugeStrategy();
  readonly zones: GaugeZone[] = [
    { from: 0, to: 60, color: '#34a853' },
    { from: 60, to: 80, color: '#fbbc04' },
    { from: 80, to: 100, color: '#ea4335' },
  ];
}
