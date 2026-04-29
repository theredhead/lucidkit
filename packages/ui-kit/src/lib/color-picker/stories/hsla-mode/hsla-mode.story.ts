import { Component, signal } from '@angular/core';
import { UIColorPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-hsla-example',
  standalone: true,
  imports: [UIColorPicker],
  templateUrl: './hsla-example.component.html',
})
export class HslaExampleComponent {
  public readonly colour = signal('#43a047');
}
