import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: `
    @for (s of sizes; track s) {
      <ui-analog-clock [size]="s" />
    }
  `,
})
export class ExampleComponent {
  sizes = [60, 100, 160, 240];
}
