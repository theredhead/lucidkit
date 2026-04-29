import { Component, signal, computed } from '@angular/core';
import {
  UISidebarNav, UISidebarItem, UISidebarGroup, UIIcons,
} from '@theredhead/lucid-kit';

interface NavPage {
  id: string;
  label: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly pages: NavPage[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects',  label: 'Projects' },
    { id: 'general',   label: 'General' },
    { id: 'security',  label: 'Security' },
  ];

  readonly active = signal('dashboard');

  readonly activeLabel = computed(() =>
    this.pages.find(p => p.id === this.active())?.label ?? '',
  );

  readonly dashboardIcon = UIIcons.Lucide.Layout.LayoutDashboard;
  readonly folderIcon    = UIIcons.Lucide.Files.Folder;
  readonly settingsIcon  = UIIcons.Lucide.Account.Settings;
  readonly shieldIcon    = UIIcons.Lucide.Account.Shield;

  navigate(id: string): void {
    this.active.set(id);
  }
}
