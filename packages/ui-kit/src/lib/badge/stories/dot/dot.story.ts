import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  template: `<ui-badge variant="dot" color="success" />`,
})
export class ExampleComponent {}
