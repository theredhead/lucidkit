import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  template: `
    <ui-badge [count]="5" color="danger" />
    <ui-badge variant="dot" color="success" />
    <ui-badge variant="label" color="primary">New</ui-badge>
  `,
})
export class ExampleComponent {}
