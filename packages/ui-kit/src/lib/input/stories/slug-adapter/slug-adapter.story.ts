import { Component, signal } from '@angular/core';
import { UIInput, SlugTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="my-page-title"
      ariaLabel="URL slug"
      [adapter]="adapter"
      [(text)]="rawSlug"
      [(value)]="slugValue"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new SlugTextAdapter();
  public readonly rawSlug = signal('');
  public readonly slugValue = signal('');
}
