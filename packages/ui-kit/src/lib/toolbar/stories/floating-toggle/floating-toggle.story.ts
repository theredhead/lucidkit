import { Component, signal } from '@angular/core';
import {
  UIToolbar, UIButtonTool, UISeparatorTool,
  UIIcons,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIToolbar, UIButtonTool, UISeparatorTool],
  template: '<div class="editor-shell">...</div>',
})
export class ExampleComponent {
  protected readonly UIIcons = UIIcons;
  protected readonly toolbarCollapsed = signal(true);
}
