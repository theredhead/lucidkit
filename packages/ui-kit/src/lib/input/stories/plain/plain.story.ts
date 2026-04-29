import { Component, signal } from '@angular/core';
import { UIInput } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `<ui-input [(value)]="name" placeholder="Enter your name" />`,
})
export class MyComponent {
  public readonly name = signal('');
}
