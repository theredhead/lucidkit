import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-interactive-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './interactive-example.component.html',
  styleUrl: './interactive-example.component.scss',
})
export class InteractiveExampleComponent {
  public readonly colour = signal('#0061a4');
}
