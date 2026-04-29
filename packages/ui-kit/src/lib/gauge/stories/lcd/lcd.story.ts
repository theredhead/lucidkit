import { Component } from '@angular/core';
import { UIGauge, LcdGaugeStrategy } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-lcd-thermometer',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge
      [value]="temperature"
      unit="°C"
      [strategy]="strategy"
      [width]="260" [height]="120"
    />
  \`,
})
export class LcdThermometerComponent {
  readonly temperature = 37.2;
  readonly strategy = new LcdGaugeStrategy({ decimals: 1, digitCount: 5 });
}
