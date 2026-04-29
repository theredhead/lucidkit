import { Component, signal } from '@angular/core';
import {
  UIInput,
  EmailTextAdapter,
  UrlTextAdapter,
  IPAddressTextAdapter,
} from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input type="email" [adapter]="emailAdapter" [(value)]="email" placeholder="user@example.com" />
    <ui-input type="url"   [adapter]="urlAdapter"   [(value)]="url"   placeholder="example.com" />
    <ui-input              [adapter]="ipAdapter"    [(value)]="ip"    placeholder="192.168.1.1" />
  `,
})
export class MyComponent {
  public readonly emailAdapter = new EmailTextAdapter();
  public readonly urlAdapter = new UrlTextAdapter();
  public readonly ipAdapter = new IPAddressTextAdapter();

  public readonly email = signal('');
  public readonly url = signal('');
  public readonly ip = signal('');
}
