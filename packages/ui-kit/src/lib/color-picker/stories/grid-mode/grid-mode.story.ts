import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-grid-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './grid-example.component.html',
})
export class GridExampleComponent {
  public readonly colour = signal('#1565c0');
}
