import { Component } from '@angular/core';
import { UIQRCode } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIQRCode],
  template: '<ui-qr-code [value]="'https://www.youtube.com/watch?v=dQw4w9WgXcQ'" [size]="180"></ui-qr-code>'
})
export class ExampleComponent {}
