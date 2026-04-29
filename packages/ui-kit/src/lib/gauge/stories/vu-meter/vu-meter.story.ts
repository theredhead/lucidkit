import { Component } from '@angular/core';
import { UIGauge, VuMeterStrategy } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-vu-meter',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge
      [value]="level"
      unit="dB"
      [strategy]="strategy"
      [width]="120" [height]="260"
    />
  \`,
})
export class VuMeterComponent {
  readonly level = 65;
  readonly strategy = new VuMeterStrategy({ segments: 20 });
}
