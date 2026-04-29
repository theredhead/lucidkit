import { Component, signal } from '@angular/core';
import { UIInput, FloatTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="3.14"
      ariaLabel="Float value"
      [adapter]="adapter"
      [(text)]="rawFloat"
      [(value)]="floatValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new FloatTextAdapter();
  public readonly rawFloat = signal('');
  public readonly floatValue = signal('');
}
