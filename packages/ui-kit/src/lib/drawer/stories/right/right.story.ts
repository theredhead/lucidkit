import { Component, signal } from '@angular/core';
import { UIDrawer } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDrawer],
  template: `
    <button (click)="open.set(true)">Open Right Drawer</button>
    <ui-drawer [(open)]="open" position="right" width="wide">
      <h3>Detail Panel</h3>
      <p>Form or detail content here.</p>
      <button (click)="open.set(false)">Close</button>
    </ui-drawer>
  `,
})
export class ExampleComponent {
  readonly open = signal(false);
}
