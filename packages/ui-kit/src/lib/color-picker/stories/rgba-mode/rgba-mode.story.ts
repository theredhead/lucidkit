import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-rgba-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './rgba-example.component.html',
})
export class RgbaExampleComponent {
  public readonly colour = signal('#e53935');
}
