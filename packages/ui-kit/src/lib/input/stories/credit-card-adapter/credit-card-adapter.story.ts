import { Component, signal } from '@angular/core';
import { UIInput, CreditCardTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="4111 1111 1111 1111"
      ariaLabel="Credit card number"
      [adapter]="adapter"
      [(text)]="rawCard"
      [(value)]="cardNumber"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new CreditCardTextAdapter();
  public readonly rawCard = signal('');
  public readonly cardNumber = signal('');
}
