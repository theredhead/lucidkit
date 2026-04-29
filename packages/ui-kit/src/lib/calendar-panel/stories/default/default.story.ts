import { Component, signal } from '@angular/core';
import { UIInput, DateInputAdapter } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIInput],
  template: \`<ui-input [adapter]="dateAdapter" [(text)]="dateText" placeholder="yyyy-MM-dd" />\`,
})
export class ExampleComponent {
  readonly dateAdapter = new DateInputAdapter({ format: 'yyyy-MM-dd' });
  readonly dateText = signal('');
}
