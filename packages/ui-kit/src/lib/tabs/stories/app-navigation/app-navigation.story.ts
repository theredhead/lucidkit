import { Component } from '@angular/core';
import { UITabGroup, UITab, UITabSeparator, UITabSpacer } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}
