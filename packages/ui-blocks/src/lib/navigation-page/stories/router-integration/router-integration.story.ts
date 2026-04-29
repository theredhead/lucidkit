import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  UINavigationPage,
  routesToNavigation,
  type NavigationNode,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private readonly router = inject(Router);
  readonly activePage = signal('dashboard');

  // Automatically derive navigation from your route config.
  // Routes with data: { navLabel: '…' } are included;
  // the rest are silently skipped.
  readonly navItems = routesToNavigation(this.router.config);

  onNavigated(node: NavigationNode): void {
    if (node.data.route) {
      this.router.navigate([node.data.route]);
    }
  }
}

// In your route config:
// { path: 'dashboard', data: { navLabel: 'Dashboard', navIcon: '…' }, … }
// { path: 'settings', data: { navLabel: 'Settings' }, children: [
//   { path: 'general', data: { navLabel: 'General' }, … },
// ]}
