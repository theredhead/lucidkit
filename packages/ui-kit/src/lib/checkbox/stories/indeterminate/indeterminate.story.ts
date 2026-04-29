import { Component, computed, signal } from '@angular/core';
import { UICheckbox } from '@theredhead/lucid-kit';

@Component({
  imports: [UICheckbox],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly allSelected = signal(false);
  protected readonly selectedCount = signal(2);
  protected readonly totalCount = signal(5);

  protected readonly isIndeterminate = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.totalCount(),
  );
}
