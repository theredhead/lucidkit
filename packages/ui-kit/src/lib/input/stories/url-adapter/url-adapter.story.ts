import { Component, signal } from '@angular/core';
import { UIInput, UrlTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      type="url"
      placeholder="example.com"
      ariaLabel="Website URL"
      [adapter]="adapter"
      [(text)]="rawUrl"
      [(value)]="fullUrl"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new UrlTextAdapter();
  public readonly rawUrl = signal('');
  public readonly fullUrl = signal('');
}
