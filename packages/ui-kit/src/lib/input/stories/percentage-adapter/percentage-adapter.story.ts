import { Component, signal } from '@angular/core';
import { UIInput, PercentageTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="75.5%"
      ariaLabel="Percentage value"
      [adapter]="adapter"
      [(text)]="rawPct"
      [(value)]="pctValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new PercentageTextAdapter();
  public readonly rawPct = signal('');
  public readonly pctValue = signal('');
}
