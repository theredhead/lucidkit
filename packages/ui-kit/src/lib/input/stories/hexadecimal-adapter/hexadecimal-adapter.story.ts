import { Component, signal } from '@angular/core';
import { UIInput, HexadecimalTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="0xFF"
      ariaLabel="Hexadecimal value"
      [adapter]="adapter"
      [(text)]="rawHex"
      [(value)]="hexValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new HexadecimalTextAdapter();
  public readonly rawHex = signal('');
  public readonly hexValue = signal('');
}
