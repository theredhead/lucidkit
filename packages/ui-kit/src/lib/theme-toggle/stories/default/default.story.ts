import { Component } from '@angular/core';
import { UIThemeToggle } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIThemeToggle],
  template: `<ui-theme-toggle variant="icon" />`,
})
export class ExampleComponent {}
