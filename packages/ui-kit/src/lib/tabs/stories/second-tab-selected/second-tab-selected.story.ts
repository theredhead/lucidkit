import { Component } from '@angular/core';
import { UITabGroup, UITab } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}
