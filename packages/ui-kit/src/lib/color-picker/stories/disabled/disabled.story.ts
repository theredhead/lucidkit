import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-disabled-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './disabled-example.component.html',
})
export class DisabledExampleComponent {
  public readonly colour = signal('#9c27b0');
}
