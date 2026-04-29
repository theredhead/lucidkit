import { Component, signal } from '@angular/core';
import { UIDrawer } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDrawer],
  template: `
    <button (click)="open.set(true)">Open</button>
    <ui-drawer [(open)]="open" width="medium">
      <p>Content in a medium-width drawer.</p>
    </ui-drawer>
  `,
})
export class ExampleComponent {
  readonly open = signal(false);
}
