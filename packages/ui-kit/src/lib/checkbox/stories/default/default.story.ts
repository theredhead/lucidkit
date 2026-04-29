import { Component, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/lucid-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly accepted = signal(false);
}
