import { Component } from '@angular/core';
import { UIEmptyState } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIEmptyState],
  template: `
    <ui-empty-state heading="No results found" message="Try adjusting your search.">
      <button action>Clear filters</button>
    </ui-empty-state>
  `,
})
export class ExampleComponent {}
