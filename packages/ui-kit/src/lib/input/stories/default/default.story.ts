import { Component, signal } from '@angular/core';
import { UIInput, EmailTextAdapter } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIInput],
  template: \`
    <ui-input
      type="email"
      placeholder="user@example.com"
      [adapter]="adapter"
      [(text)]="rawText"
      [(value)]="processedValue"
    />
  \`,
})
export class ExampleComponent {
  readonly adapter = new EmailTextAdapter();
  readonly rawText = signal('');
  readonly processedValue = signal('');
}
