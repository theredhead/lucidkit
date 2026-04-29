import { Component } from '@angular/core';
import {
  UIGauge,
  BarGaugeStrategy,
  type GaugeZone,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-cpu-meter',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge
      [value]="cpuLoad"
      [min]="0" [max]="100"
      unit="%"
      [strategy]="strategy"
      [zones]="zones"
      [width]="300" [height]="80"
    />
  \`,
})
export class CpuMeterComponent {
  readonly cpuLoad = 65;
  readonly strategy = new BarGaugeStrategy({ ticks: 10 });
  readonly zones: GaugeZone[] = [
    { from: 0, to: 60, color: '#34a853' },
    { from: 60, to: 80, color: '#fbbc04' },
    { from: 80, to: 100, color: '#ea4335' },
  ];
}
