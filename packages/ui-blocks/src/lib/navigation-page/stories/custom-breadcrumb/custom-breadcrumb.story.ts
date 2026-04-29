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

  readonly navItems = [
    navItem('dashboard', 'Dashboard'),
    navGroup('settings', 'Settings', [
      navItem('general', 'General'),
      navItem('security', 'Security'),
    ]),
  ];
}
