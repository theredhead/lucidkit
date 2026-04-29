import { Component, signal } from '@angular/core';
import { UIInput, UuidTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="550e8400-e29b-41d4-a716-446655440000"
      ariaLabel="UUID"
      [adapter]="adapter"
      [(text)]="rawUuid"
      [(value)]="uuidValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new UuidTextAdapter();
  public readonly rawUuid = signal('');
  public readonly uuidValue = signal('');
}
