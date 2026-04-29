import { Component } from '@angular/core';
import { UISkeleton } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UISkeleton],
  template: `<ui-skeleton variant="text" [lines]="3" />`,
})
export class ExampleComponent {}
