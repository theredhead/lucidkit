import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: `<ui-analog-clock [time]="fixedTime" />`,
})
export class ExampleComponent {
  fixedTime = new Date(2025, 0, 1, 10, 10, 30);
}
