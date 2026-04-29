import { Component, signal } from '@angular/core';
import { UIInput, DateTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="2025-12-31"
      ariaLabel="Date (ISO 8601)"
      [adapter]="adapter"
      [(text)]="rawDate"
      [(value)]="dateValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new DateTextAdapter();
  public readonly rawDate = signal('');
  public readonly dateValue = signal('');
}
