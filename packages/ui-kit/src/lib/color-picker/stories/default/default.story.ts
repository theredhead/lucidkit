import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  public readonly colour = signal('#0061a4');
}
