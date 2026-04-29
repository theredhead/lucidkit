import { Component, signal } from '@angular/core';
import { UIDrawer } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDrawer],
  template: `
    <button (click)="drawerOpen.set(true)">Open Drawer</button>
    <ui-drawer [(open)]="drawerOpen" position="left" width="medium">
      <h3>Navigation</h3>
      <p>Drawer content here.</p>
    </ui-drawer>
  `,
})
export class ExampleComponent {
  readonly drawerOpen = signal(false);
}
