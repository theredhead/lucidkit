import { Component, signal } from '@angular/core';
import { UIInput, PhoneTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      type="tel"
      placeholder="+1 (555) 123-4567"
      ariaLabel="Phone number"
      [adapter]="adapter"
      [(text)]="rawPhone"
      [(value)]="phoneValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new PhoneTextAdapter();
  public readonly rawPhone = signal('');
  public readonly phoneValue = signal('');
}
