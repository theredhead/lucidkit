import { Component, signal } from '@angular/core';
import { UIRepeater, RepeaterReorderEvent } from '@theredhead/lucid-kit';
import { ArrayDatasource } from '@theredhead/lucid-foundation';

@Component({
  selector: 'app-reorder-example',
  standalone: true,
  imports: [UIRepeater],
  templateUrl: './reorder-example.component.html',
})
export class ReorderExampleComponent {
  readonly ds = new ArrayDatasource([
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Bravo' },
    { id: 3, name: 'Charlie' },
  ]);

  onReorder(event: RepeaterReorderEvent): void {
    console.log('Moved from', event.previousIndex, 'to', event.currentIndex);
  }
}
