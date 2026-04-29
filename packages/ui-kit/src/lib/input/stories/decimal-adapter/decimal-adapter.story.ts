import { Component, signal } from '@angular/core';
import { UIInput, DecimalTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="9.99"
      ariaLabel="Decimal value"
      [adapter]="adapter"
      [(text)]="rawDec"
      [(value)]="decValue"
    />
  `,
})
export class MyComponent {
  // Allow up to 4 decimal places
  public readonly adapter = new DecimalTextAdapter(4);
  public readonly rawDec = signal('');
  public readonly decValue = signal('');
}
