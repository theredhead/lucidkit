import { Component } from '@angular/core';
import { UIQRCode } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIQRCode],
  template: '<ui-qr-code [value]="'https://theredhead.nl'" [size]="160" [foreground]="'#0a7cff'" [background]="'#eaf6ff'"></ui-qr-code>'
})
export class ExampleComponent {}
