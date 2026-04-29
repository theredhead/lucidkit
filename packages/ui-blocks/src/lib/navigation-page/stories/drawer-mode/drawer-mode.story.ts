import { Component, signal } from '@angular/core';
import {
  UINavigationPage,
  navItem,
  navGroup,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly activePage = signal('dashboard');
  readonly drawerOpen = signal(false);

  readonly navItems = [
    navItem('dashboard', 'Dashboard'),
    navItem('projects', 'Projects'),
    navGroup('settings', 'Settings', [
      navItem('general', 'General'),
    ]),
  ];
}
