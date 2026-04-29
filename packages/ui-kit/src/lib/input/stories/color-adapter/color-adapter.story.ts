import { Component, signal } from '@angular/core';
import { UIInput, ColorTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="FF6600"
      ariaLabel="Hex colour"
      [adapter]="adapter"
      [(text)]="rawColor"
      [(value)]="colorValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new ColorTextAdapter();
  public readonly rawColor = signal('');
  public readonly colorValue = signal('');
}
