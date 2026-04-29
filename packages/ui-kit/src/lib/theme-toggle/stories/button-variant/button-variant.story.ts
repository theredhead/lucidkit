import { Component } from '@angular/core';
import { UIThemeToggle } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIThemeToggle],
  template: `<ui-theme-toggle variant="button" ariaLabel="Switch theme" />`,
})
export class ExampleComponent {}
