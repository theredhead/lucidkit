import { Component, signal } from '@angular/core';
import {
  UISidebarNav, UISidebarItem, UISidebarGroup, UIIcons,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  template: `
    <ui-sidebar-nav>
      <ui-sidebar-item
        label="Dashboard" [icon]="dashboardIcon"
        [active]="active() === 'dashboard'"
        (activated)="active.set('dashboard')" />
      <ui-sidebar-item label="Projects" [icon]="folderIcon" badge="12" />
      <ui-sidebar-group label="Management" [icon]="settingsIcon">
        <ui-sidebar-item label="Users" [icon]="usersIcon" />
      </ui-sidebar-group>
    </ui-sidebar-nav>
  `,
})
export class ShellComponent {
  readonly active = signal('dashboard');

  readonly dashboardIcon = UIIcons.Lucide.Layout.LayoutDashboard;
  readonly folderIcon = UIIcons.Lucide.Files.Folder;
  readonly settingsIcon = UIIcons.Lucide.Account.Settings;
  readonly usersIcon = UIIcons.Lucide.Account.Users;
}
