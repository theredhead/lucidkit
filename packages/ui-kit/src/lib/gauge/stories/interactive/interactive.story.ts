import { Component, signal } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  VuMeterStrategy,
  DigitalGaugeStrategy,
  type GaugeZone,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge [value]="speed()" [strategy]="analog" unit="km/h" [zones]="zones" />
    <ui-gauge [value]="speed()" [strategy]="vu" unit="km/h" [zones]="zones" [width]="100" [height]="240" />
    <ui-gauge [value]="speed()" [strategy]="digital" unit="km/h" [width]="200" [height]="120" />
  \`,
})
export class DashboardComponent {
  readonly speed = signal(80);
  readonly analog = new AnalogGaugeStrategy();
  readonly vu = new VuMeterStrategy();
  readonly digital = new DigitalGaugeStrategy();
  readonly zones: GaugeZone[] = [
    { from: 0, to: 100, color: '#34a853' },
    { from: 100, to: 160, color: '#fbbc04' },
    { from: 160, to: 220, color: '#ea4335' },
  ];
}
