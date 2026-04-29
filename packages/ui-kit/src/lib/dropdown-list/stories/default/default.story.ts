import { Component, signal } from '@angular/core';
import { UIDropdownList } from '@theredhead/lucid-kit';
import type { SelectOption } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDropdownList],
  template: \`
    <ui-dropdown-list
      [options]="fruitOptions"
      [(value)]="selectedFruit"
      ariaLabel="Choose a fruit"
    />
  \`,
})
export class ExampleComponent {
  readonly fruitOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];
  readonly selectedFruit = signal('');
}
