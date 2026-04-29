import { Component, signal } from '@angular/core';
import { UIInput, IntegerTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="42"
      ariaLabel="Integer value"
      [adapter]="adapter"
      [(text)]="rawInt"
      [(value)]="intValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new IntegerTextAdapter();
  public readonly rawInt = signal('');
  public readonly intValue = signal('');
}
