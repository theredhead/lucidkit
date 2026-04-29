import { Component, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/lucid-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly unchecked = signal(false);
  protected readonly checked = signal(true);
  protected readonly indeterminate = signal(false);
  protected readonly switchOff = signal(false);
  protected readonly switchOn = signal(true);
}
