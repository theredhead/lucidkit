import { Component, input, signal } from "@angular/core";
import { UIKanbanBoard } from "../../kanban-board.component";
import type { KanbanColumn } from "../../kanban-board.types";

@Component({
  selector: "ui-story-kanban-minimal",
  standalone: true,
  imports: [UIKanbanBoard],
  templateUrl: "./minimal.story.html",
})
export class StoryKanbanMinimal {
  /** Accessible label forwarded to the kanban board region. */
  public readonly ariaLabel = input<string>("Kanban board");

  public readonly columns = signal<KanbanColumn<{ label: string }>[]>([
    {
      id: "a",
      title: "Column A",
      cards: [
        { id: "1", data: { label: "Card 1" } },
        { id: "2", data: { label: "Card 2" } },
      ],
    },
    {
      id: "b",
      title: "Column B",
      cards: [{ id: "3", data: { label: "Card 3" } }],
    },
    { id: "c", title: "Column C", cards: [] },
  ]);
}
