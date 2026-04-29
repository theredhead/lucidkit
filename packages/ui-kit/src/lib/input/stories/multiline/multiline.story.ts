import { Component, signal } from '@angular/core';
import { UIInput } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input multiline [rows]="4" [(value)]="description" placeholder="Enter description…" />
  `,
})
export class MyComponent {
  public readonly description = signal('');
}
