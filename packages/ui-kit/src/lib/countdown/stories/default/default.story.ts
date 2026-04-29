import { Component } from '@angular/core';
import { UICountdown } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UICountdown],
  template: `<ui-countdown [target]="launchDate" format="hms" (expired)="onLaunch()" />`,
})
export class ExampleComponent {
  public readonly launchDate = new Date('2027-01-01T00:00:00Z');
  public onLaunch(): void { /* handle expiry */ }
}
