import { Component } from '@angular/core';
import { UIImage } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIImage],
  template: \`<ui-image src="photo.jpg" alt="Mountain landscape" [width]="400" [height]="300" />\`,
})
export class ExampleComponent {}
