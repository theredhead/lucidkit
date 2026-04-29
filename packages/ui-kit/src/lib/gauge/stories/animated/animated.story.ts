import { Component, signal } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  type GaugeZone,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-animated-gauge',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge
      [value]="speed()"
      [min]="0" [max]="220"
      unit="km/h"
      [strategy]="strategy"
      [zones]="zones"
      [animated]="true"
      [animationDuration]="300"
    />
    <button (click)="randomize()">Randomize</button>
  \`,
})
export class AnimatedGaugeComponent {
  readonly speed = signal(72);
  readonly strategy = new AnalogGaugeStrategy();
  readonly zones: GaugeZone[] = [
    { from: 0, to: 100, color: '#34a853' },
    { from: 100, to: 160, color: '#fbbc04' },
    { from: 160, to: 220, color: '#ea4335' },
  ];

  randomize(): void {
    this.speed.set(Math.round(Math.random() * 220));
  }
}
