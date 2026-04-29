import { Component } from '@angular/core';
import {
  UISidebarNav, UISidebarItem, UISidebarGroup, UIIcons,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  template: `
    <ui-sidebar-nav>
      <ui-sidebar-item label="Home" [icon]="houseIcon" [active]="true" />
      <ui-sidebar-group label="Section A" [expanded]="false">
        <ui-sidebar-item label="Item A1" />
        <ui-sidebar-item label="Item A2" />
      </ui-sidebar-group>
    </ui-sidebar-nav>
  `,
})
export class ExampleComponent {
  readonly houseIcon = UIIcons.Lucide.Buildings.House;
}
