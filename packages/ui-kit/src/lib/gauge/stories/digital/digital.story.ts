import { Component } from '@angular/core';
import { UIGauge, DigitalGaugeStrategy } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-thermometer',
  standalone: true,
  imports: [UIGauge],
  template: \`
    <ui-gauge
      [value]="temperature"
      unit="°C"
      [strategy]="strategy"
      [width]="220" [height]="140"
    />
  \`,
})
export class ThermometerComponent {
  readonly temperature = 88.5;
  readonly strategy = new DigitalGaugeStrategy({ decimals: 1 });
}
