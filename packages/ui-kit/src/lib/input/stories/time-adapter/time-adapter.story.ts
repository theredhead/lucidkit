import { Component, signal } from '@angular/core';
import { UIInput, TimeTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="14:30"
      ariaLabel="Time (24-hour)"
      [adapter]="adapter"
      [(text)]="rawTime"
      [(value)]="timeValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new TimeTextAdapter();
  public readonly rawTime = signal('');
  public readonly timeValue = signal('');
}
