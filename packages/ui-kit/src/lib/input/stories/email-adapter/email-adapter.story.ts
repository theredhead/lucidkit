import { Component, signal } from '@angular/core';
import { UIInput, EmailTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      type="email"
      placeholder="user@example.com"
      ariaLabel="Email address"
      [adapter]="adapter"
      [(text)]="email"
      [(value)]="normalizedEmail"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new EmailTextAdapter();
  public readonly email = signal('');
  public readonly normalizedEmail = signal('');
}
