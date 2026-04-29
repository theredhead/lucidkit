import { Component, signal } from '@angular/core';
import { UIInput, CronTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="0 * * * *"
      ariaLabel="Cron expression"
      [adapter]="adapter"
      [(text)]="rawCron"
      [(value)]="cronValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new CronTextAdapter();
  public readonly rawCron = signal('');
  public readonly cronValue = signal('');
}
