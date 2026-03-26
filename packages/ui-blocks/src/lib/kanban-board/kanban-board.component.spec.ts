import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIKanbanBoard } from "./kanban-board.component";
import type {
  KanbanColumn,
  KanbanCard,
  KanbanCardMoveEvent,
} from "./kanban-board.types";

interface Task {
  title: string;
  priority: string;
}

function makeColumns(): KanbanColumn<Task>[] {
  return [
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "task-1", data: { title: "Design UI", priority: "high" } },
        { id: "task-2", data: { title: "Write tests", priority: "medium" } },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [{ id: "task-3", data: { title: "Build API", priority: "high" } }],
    },
    {
      id: "done",
      title: "Done",
      cards: [],
    },
  ];
}

@Component({
  selector: "ui-test-kanban-host",
  standalone: true,
  imports: [UIKanbanBoard],
  template: `
    <ui-kanban-board
      [(columns)]="columns"
      (cardMoved)="onCardMoved($event)"
      (cardClicked)="onCardClicked($event)"
    >
      <ng-template let-card let-column="column">
        <div class="test-card">
          <span class="test-card-title">{{ card.data.title }}</span>
          <span class="test-card-priority">{{ card.data.priority }}</span>
        </div>
      </ng-template>
    </ui-kanban-board>
  `,
})
class TestKanbanHost {
  public readonly columns = signal<KanbanColumn<Task>[]>(makeColumns());
  public moves: KanbanCardMoveEvent<Task>[] = [];
  public clicks: KanbanCard<Task>[] = [];

  public onCardMoved(event: KanbanCardMoveEvent<Task>): void {
    this.moves.push(event);
  }

  public onCardClicked(card: KanbanCard<Task>): void {
    this.clicks.push(card);
  }
}

@Component({
  selector: "ui-test-kanban-no-template",
  standalone: true,
  imports: [UIKanbanBoard],
  template: `<ui-kanban-board [(columns)]="columns" />`,
})
class TestKanbanNoTemplate {
  public readonly columns = signal<KanbanColumn<Task>[]>(makeColumns());
}

describe("UIKanbanBoard", () => {
  let fixture: ComponentFixture<TestKanbanHost>;
  let host: TestKanbanHost;
  let boardEl: HTMLElement;

  function getBoard(): UIKanbanBoard<Task> {
    return fixture.debugElement.children[0].componentInstance;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestKanbanHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestKanbanHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    boardEl = fixture.nativeElement.querySelector("ui-kanban-board");
  });

  it("should create", () => {
    expect(getBoard()).toBeTruthy();
  });

  describe("columns", () => {
    it("should render all columns", () => {
      const cols = boardEl.querySelectorAll(".kanban-column");
      expect(cols.length).toBe(3);
    });

    it("should display column titles", () => {
      const titles = boardEl.querySelectorAll(".kanban-column-title");
      expect(titles[0].textContent).toContain("To Do");
      expect(titles[1].textContent).toContain("In Progress");
      expect(titles[2].textContent).toContain("Done");
    });

    it("should display card counts", () => {
      const counts = boardEl.querySelectorAll(".kanban-column-count");
      expect(counts[0].textContent?.trim()).toBe("2");
      expect(counts[1].textContent?.trim()).toBe("1");
      expect(counts[2].textContent?.trim()).toBe("0");
    });
  });

  describe("cards", () => {
    it("should render cards in each column", () => {
      const columns = boardEl.querySelectorAll(".kanban-column-body");
      const todoCards = columns[0].querySelectorAll(".kanban-card-wrapper");
      const inProgressCards = columns[1].querySelectorAll(
        ".kanban-card-wrapper",
      );
      expect(todoCards.length).toBe(2);
      expect(inProgressCards.length).toBe(1);
    });

    it("should render projected card template content", () => {
      const cardTitles = boardEl.querySelectorAll(".test-card-title");
      expect(cardTitles.length).toBe(3);
      expect(cardTitles[0].textContent).toContain("Design UI");
      expect(cardTitles[1].textContent).toContain("Write tests");
      expect(cardTitles[2].textContent).toContain("Build API");
    });

    it("should render priority in projected template", () => {
      const priorities = boardEl.querySelectorAll(".test-card-priority");
      expect(priorities[0].textContent).toContain("high");
      expect(priorities[1].textContent).toContain("medium");
    });

    it("should show empty message for empty columns", () => {
      const emptyMsg = boardEl.querySelectorAll(".kanban-column-empty");
      expect(emptyMsg.length).toBe(1);
      expect(emptyMsg[0].textContent).toContain("No cards");
    });
  });

  describe("fallback template", () => {
    it("should render card id when no template is projected", async () => {
      const noTplFixture = TestBed.createComponent(TestKanbanNoTemplate);
      noTplFixture.detectChanges();
      const board = noTplFixture.nativeElement.querySelector("ui-kanban-board");

      const fallbacks = board.querySelectorAll(".kanban-card-fallback");
      expect(fallbacks.length).toBe(3);
      expect(fallbacks[0].textContent).toContain("task-1");
    });
  });

  describe("card click", () => {
    it("should emit cardClicked when a card is clicked", () => {
      const firstCard = boardEl.querySelector(
        ".kanban-card-wrapper",
      ) as HTMLElement;
      firstCard.click();
      fixture.detectChanges();

      expect(host.clicks.length).toBe(1);
      expect(host.clicks[0].id).toBe("task-1");
      expect(host.clicks[0].data.title).toBe("Design UI");
    });
  });

  describe("column color", () => {
    it("should apply column color as border-top-color", () => {
      host.columns.set([
        { id: "col", title: "Colored", cards: [], color: "#e74c3c" },
      ]);
      fixture.detectChanges();

      const column = boardEl.querySelector(".kanban-column") as HTMLElement;
      expect(column.style.borderTopColor).toBe("rgb(231, 76, 60)");
    });
  });

  describe("drag and drop", () => {
    it("should handle within-column reorder via onDrop", () => {
      const board = getBoard();
      const todoCards = host.columns()[0].cards;

      // Simulate CDK drop event for same-container reorder
      const mockEvent = {
        previousContainer: { id: "todo", data: todoCards },
        container: { id: "todo", data: todoCards },
        previousIndex: 0,
        currentIndex: 1,
        item: { data: todoCards[0] },
      } as any;

      (board as any).onDrop(mockEvent);
      fixture.detectChanges();

      const cols = host.columns();
      expect(cols[0].cards[0].id).toBe("task-2");
      expect(cols[0].cards[1].id).toBe("task-1");
      expect(host.moves.length).toBe(1);
      expect(host.moves[0].previousColumnId).toBe("todo");
      expect(host.moves[0].currentColumnId).toBe("todo");
    });

    it("should handle cross-column transfer via onDrop", () => {
      const board = getBoard();
      const cols = host.columns();
      const todoCards = cols[0].cards;
      const doneCards = cols[2].cards;
      const movedCard = todoCards[0];

      // Simulate CDK drop event for cross-container transfer
      const mockPrevContainer = { id: "todo", data: todoCards };
      const mockContainer = { id: "done", data: doneCards };
      const mockEvent = {
        previousContainer: mockPrevContainer,
        container: mockContainer,
        previousIndex: 0,
        currentIndex: 0,
        item: { data: movedCard },
      } as any;

      (board as any).onDrop(mockEvent);
      fixture.detectChanges();

      const updatedCols = host.columns();
      expect(updatedCols[0].cards.length).toBe(1);
      expect(updatedCols[2].cards.length).toBe(1);
      expect(updatedCols[2].cards[0].id).toBe("task-1");
      expect(host.moves.length).toBe(1);
      expect(host.moves[0].card.id).toBe("task-1");
      expect(host.moves[0].previousColumnId).toBe("todo");
      expect(host.moves[0].currentColumnId).toBe("done");
    });
  });

  describe("accessibility", () => {
    it("should have a region role with aria-label", () => {
      const region = boardEl.querySelector('[role="region"]');
      expect(region).toBeTruthy();
      expect(region!.getAttribute("aria-label")).toBe("Kanban board");
    });

    it("should have aria-label on card counts", () => {
      const counts = boardEl.querySelectorAll(".kanban-column-count");
      expect(counts[0].getAttribute("aria-label")).toBe("2 cards");
      expect(counts[2].getAttribute("aria-label")).toBe("0 cards");
    });
  });

  describe("dynamic updates", () => {
    it("should re-render when columns are updated", () => {
      host.columns.set([
        {
          id: "single",
          title: "Only Column",
          cards: [{ id: "c1", data: { title: "Card 1", priority: "low" } }],
        },
      ]);
      fixture.detectChanges();

      const cols = boardEl.querySelectorAll(".kanban-column");
      expect(cols.length).toBe(1);
      expect(
        boardEl.querySelector(".kanban-column-title")!.textContent,
      ).toContain("Only Column");
    });
  });
});
