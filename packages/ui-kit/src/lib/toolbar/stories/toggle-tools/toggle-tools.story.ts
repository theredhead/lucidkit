import { Component, signal } from '@angular/core';
import {
  UIToolbar, UIToggleTool, UIToggleGroupTool, UISeparatorTool,
  UIIcons, type ToolActionEvent,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIToolbar, UIToggleTool, UIToggleGroupTool, UISeparatorTool],
  template: `...`,
})
export class ExampleComponent {
  protected readonly UIIcons = UIIcons;
  protected readonly isBold = signal(false);
  protected readonly isItalic = signal(false);
}
