import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: `
    <ui-analog-clock [showNumbers]="false" [showTickMarks]="false" />
  `,
})
export class ExampleComponent {}
