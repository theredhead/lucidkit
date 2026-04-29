import { Component, signal } from '@angular/core';
import {
  UINavigationPage,
  navItem,
  navGroup,
  type NavigationNode,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly activePage = signal('dashboard');

  readonly navItems = [
    navItem('dashboard', 'Dashboard'),
    navItem('projects', 'Projects', { badge: '12' }),
    navItem('calendar', 'Calendar'),
    navGroup('settings', 'Settings', [
      navItem('general', 'General'),
      navItem('security', 'Security'),
    ]),
  ];

  onNavigated(node: NavigationNode): void {
    console.log('Navigated to', node.data.label);
  }
}
