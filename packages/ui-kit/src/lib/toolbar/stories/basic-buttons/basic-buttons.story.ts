import { Component } from '@angular/core';
import {
  UIToolbar, UIButtonTool, UISeparatorTool,
  type ToolActionEvent,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIToolbar, UIButtonTool, UISeparatorTool],
  template: `...`,
})
export class ExampleComponent {
  protected readonly UIIcons = UIIcons;

  protected onAction(event: ToolActionEvent): void {
    console.log('Action:', event.itemId);
  }
}
