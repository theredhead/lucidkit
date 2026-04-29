import { Component } from '@angular/core';
import {
  UIDropdownMenu, UIDropdownItem, UIDropdownDivider,
} from '@theredhead/lucid-kit';
import { UIButton } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIDropdownDivider, UIButton],
  template: `
    <ui-dropdown-menu>
      <ui-button trigger>Actions ▾</ui-button>
      <ui-dropdown-item (action)="onEdit()">Edit</ui-dropdown-item>
      <ui-dropdown-divider />
      <ui-dropdown-item (action)="onDelete()">Delete</ui-dropdown-item>
    </ui-dropdown-menu>
  `,
})
export class ExampleComponent {
  onEdit()   { console.log('edit'); }
  onDelete() { console.log('delete'); }
}
