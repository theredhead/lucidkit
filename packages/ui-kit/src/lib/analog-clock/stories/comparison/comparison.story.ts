import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: `
    <ui-analog-clock [size]="160" />
    <ui-analog-clock [size]="160" [showSeconds]="false" />
    <ui-analog-clock [size]="160" [showNumbers]="false" />
    <ui-analog-clock [size]="160" [showNumbers]="false" [showTickMarks]="false" />
  `,
})
export class ExampleComponent {}
