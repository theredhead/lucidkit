import { Component, signal } from '@angular/core';
import { UIKanbanBoard, KanbanColumn } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [UIKanbanBoard],
  template: \`<ui-kanban-board [(columns)]="columns" />\`,
})
export class BoardComponent {
  public readonly columns = signal<KanbanColumn<{ label: string }>[]>([
    { id: 'a', title: 'Column A', cards: [
      { id: '1', data: { label: 'Card 1' } },
    ]},
    { id: 'b', title: 'Column B', cards: [] },
  ]);
}
