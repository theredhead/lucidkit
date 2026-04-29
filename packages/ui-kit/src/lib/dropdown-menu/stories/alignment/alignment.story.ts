import { Component } from '@angular/core';
import { UIDropdownMenu, UIDropdownItem } from '@theredhead/lucid-kit';
import { UIButton } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDropdownMenu, UIDropdownItem, UIButton],
  template: `
    <ui-dropdown-menu align="end">
      <ui-button trigger>Menu ▾</ui-button>
      <ui-dropdown-item>Option A</ui-dropdown-item>
      <ui-dropdown-item>Option B</ui-dropdown-item>
    </ui-dropdown-menu>
  `,
})
export class ExampleComponent {}
