import { Component, signal } from '@angular/core';
import { UIKanbanBoard, KanbanColumn } from '@theredhead/lucid-blocks';

interface Task { title: string; description: string; }

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [UIKanbanBoard],
  templateUrl: './board.component.html',
})
export class BoardComponent {
  public readonly columns = signal<KanbanColumn<Task>[]>([
    { id: 'todo', title: 'To Do', cards: [
      { id: '1', data: { title: 'Task 1', description: 'First task' } },
    ]},
    { id: 'done', title: 'Done', cards: [] },
  ]);

  public onMoved(event: unknown): void { console.log(event); }
  public onClicked(card: unknown): void { console.log(card); }
}
