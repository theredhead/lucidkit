import { Component, signal } from '@angular/core';
import { UIInput, MoneyTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="1,234.56"
      ariaLabel="Monetary amount"
      [adapter]="adapter"
      [(text)]="rawAmount"
      [(value)]="amount"
    />
  `,
})
export class MyComponent {
  // Uses locale-inferred currency by default
  public readonly adapter = new MoneyTextAdapter();

  // Or pass an explicit ISO 4217 code:
  // public readonly adapter = new MoneyTextAdapter('EUR');

  public readonly rawAmount = signal('');
  public readonly amount = signal('');
}

// ── DI override (app.config.ts) ──
import { provideDefaultCurrency } from '@theredhead/lucid-kit';

export const appConfig = {
  providers: [provideDefaultCurrency('EUR')],
};
