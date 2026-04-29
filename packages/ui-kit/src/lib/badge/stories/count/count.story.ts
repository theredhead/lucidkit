import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  template: `<ui-badge [count]="unreadCount" color="danger" />`,
})
export class ExampleComponent {
  public readonly unreadCount = 5;
}
