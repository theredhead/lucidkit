import { Component, signal } from '@angular/core';
import { UIInput, IPAddressTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `
    <ui-input
      placeholder="192.168.1.1"
      ariaLabel="IP address"
      [adapter]="adapter"
      [(text)]="rawIp"
      [(value)]="ip"
    />
  `,
})
export class MyComponent {
  public readonly adapter = new IPAddressTextAdapter();
  public readonly rawIp = signal('');
  public readonly ip = signal('');
}
