import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: `
    <ui-analog-clock [time]="morningTime" />
    <ui-analog-clock [time]="nightTime" />
  `,
})
export class ExampleComponent {
  morningTime = new Date(2025, 0, 1, 8, 0, 0);
  nightTime = new Date(2025, 0, 1, 22, 0, 0);
}
