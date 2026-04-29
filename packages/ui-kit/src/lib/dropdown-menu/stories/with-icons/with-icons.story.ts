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
      <ui-button trigger>File ▾</ui-button>
      <ui-dropdown-item>📄 New</ui-dropdown-item>
      <ui-dropdown-item>💾 Save</ui-dropdown-item>
      <ui-dropdown-divider />
      <ui-dropdown-item>📤 Export</ui-dropdown-item>
    </ui-dropdown-menu>
  `,
})
export class ExampleComponent {}
