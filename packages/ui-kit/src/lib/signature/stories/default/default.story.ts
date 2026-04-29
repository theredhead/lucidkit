import { Component, signal } from '@angular/core';
import { UISignature, type SignatureValue } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISignature],
  template: `<ui-signature [(value)]="sig" />`,
})
export class ExampleComponent {
  readonly sig = signal<SignatureValue>(null);
}
