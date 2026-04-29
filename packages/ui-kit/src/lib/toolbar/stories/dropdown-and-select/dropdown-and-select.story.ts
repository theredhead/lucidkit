import { Component, signal } from '@angular/core';
import {
  UIToolbar, UIDropdownTool, UISelectTool,
  type ToolActionEvent, type SelectOption,
} from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIToolbar, UIDropdownTool, UISelectTool],
  template: `...`,
})
export class ExampleComponent {
  protected readonly fontSizeOptions: SelectOption[] = [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
  ];
  protected readonly fontSize = signal('14');

  protected onAction(event: ToolActionEvent): void {
    console.log('Action:', event.itemId, (event.itemRef as UIDropdownTool).selectedItemId());
  }
}
