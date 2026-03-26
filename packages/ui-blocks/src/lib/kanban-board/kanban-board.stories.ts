import { Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIKanbanBoard } from "./kanban-board.component";
import type { KanbanColumn, KanbanCard } from "./kanban-board.types";

interface Task {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
}

function sampleColumns(): KanbanColumn<Task>[] {
  return [
    {
      id: "backlog",
      title: "Backlog",
      color: "#6366f1",
      cards: [
        {
          id: "t1",
          data: {
            title: "Research competitors",
            description: "Analyse top 5 competitor products",
            priority: "low",
            assignee: "Alice",
          },
        },
        {
          id: "t2",
          data: {
            title: "Define API schema",
            description: "OpenAPI spec for v2 endpoints",
            priority: "medium",
          },
        },
        {
          id: "t10",
          data: {
            title: "Accessibility audit",
            description: "WCAG 2.1 AA compliance check across all views",
            priority: "high",
            assignee: "Diana",
          },
        },
        {
          id: "t11",
          data: {
            title: "Internationalisation setup",
            description: "Configure i18n pipeline and extract initial strings",
            priority: "low",
          },
        },
      ],
    },
    {
      id: "todo",
      title: "To Do",
      color: "#f59e0b",
      cards: [
        {
          id: "t3",
          data: {
            title: "Design login page",
            description: "Figma mockup with dark mode variant",
            priority: "high",
            assignee: "Bob",
          },
        },
        {
          id: "t4",
          data: {
            title: "Set up CI pipeline",
            description: "GitHub Actions for build + test + deploy",
            priority: "medium",
            assignee: "Carol",
          },
        },
        {
          id: "t12",
          data: {
            title: "Write onboarding guide",
            description: "Step-by-step getting-started docs for new devs",
            priority: "medium",
            assignee: "Eve",
          },
        },
        {
          id: "t13",
          data: {
            title: "E2E test suite",
            description: "Playwright tests for critical user flows",
            priority: "high",
            assignee: "Alice",
          },
        },
        {
          id: "t14",
          data: {
            title: "Performance budget",
            description: "Lighthouse CI thresholds for bundle size and LCP",
            priority: "low",
          },
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "#3b82f6",
      cards: [
        {
          id: "t5",
          data: {
            title: "Build dashboard",
            description: "Widget grid with drag-and-drop layout",
            priority: "high",
            assignee: "Alice",
          },
        },
        {
          id: "t15",
          data: {
            title: "Notification service",
            description: "WebSocket push + toast queue integration",
            priority: "medium",
            assignee: "Bob",
          },
        },
        {
          id: "t16",
          data: {
            title: "Dark mode polish",
            description: "Fix contrast issues in charts and data grids",
            priority: "low",
            assignee: "Carol",
          },
        },
      ],
    },
    {
      id: "review",
      title: "In Review",
      color: "#a855f7",
      cards: [
        {
          id: "t17",
          data: {
            title: "User avatar upload",
            description: "Crop, resize, and upload to S3 bucket",
            priority: "medium",
            assignee: "Diana",
          },
        },
        {
          id: "t18",
          data: {
            title: "Search indexing",
            description: "Elasticsearch integration for full-text search",
            priority: "high",
            assignee: "Eve",
          },
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "#22c55e",
      cards: [
        {
          id: "t6",
          data: {
            title: "Project scaffolding",
            description: "Angular workspace + package structure",
            priority: "medium",
            assignee: "Bob",
          },
        },
        {
          id: "t7",
          data: {
            title: "Design system tokens",
            description: "CSS custom properties for colours, spacing, and type",
            priority: "high",
            assignee: "Carol",
          },
        },
        {
          id: "t8",
          data: {
            title: "Auth module",
            description: "JWT login, refresh, and role-based guards",
            priority: "high",
            assignee: "Alice",
          },
        },
        {
          id: "t9",
          data: {
            title: "Storybook setup",
            description:
              "Component catalogue with autodocs and dark mode toggle",
            priority: "low",
            assignee: "Diana",
          },
        },
      ],
    },
  ];
}

const priorityColors: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

@Component({
  selector: "ui-story-kanban-demo",
  standalone: true,
  imports: [UIKanbanBoard],
  host: { style: "display: flex; flex: 1; min-height: 0;" },
  template: `
    <ui-kanban-board
      [(columns)]="columns"
      (cardMoved)="onMoved($event)"
      (cardClicked)="onClicked($event)"
    >
      <ng-template let-card let-column="column">
        <div
          style="padding: 12px; display: flex; flex-direction: column; gap: 6px;"
        >
          <strong style="font-size: 0.875rem;">{{ card.data.title }}</strong>
          <span
            style="font-size: 0.75rem; color: var(--ui-text-muted, #6b7280);"
            >{{ card.data.description }}</span
          >
          <div
            style="display: flex; align-items: center; gap: 6px; margin-top: 4px;"
          >
            <span
              [style.background]="priorityColor(card.data.priority)"
              style="color: #fff; font-size: 0.625rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; font-weight: 600;"
              >{{ card.data.priority }}</span
            >
            @if (card.data.assignee) {
              <span
                style="font-size: 0.75rem; color: var(--ui-text-muted, #9ca3af); margin-left: auto;"
              >
                {{ card.data.assignee }}
              </span>
            }
          </div>
        </div>
      </ng-template>
    </ui-kanban-board>
  `,
})
class StoryKanbanDemo {
  public readonly columns = signal<KanbanColumn<Task>[]>(sampleColumns());

  public priorityColor(priority: string): string {
    return priorityColors[priority] ?? "#6b7280";
  }

  public onMoved(event: unknown): void {
    console.log("Card moved", event);
  }

  public onClicked(card: KanbanCard<Task>): void {
    console.log("Card clicked", card);
  }
}

@Component({
  selector: "ui-story-kanban-minimal",
  standalone: true,
  imports: [UIKanbanBoard],
  template: `<ui-kanban-board [(columns)]="columns" />`,
})
class StoryKanbanMinimal {
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

const meta: Meta<UIKanbanBoard<Task>> = {
  title: "@Theredhead/UI Blocks/Kanban Board",
  component: UIKanbanBoard,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [StoryKanbanDemo, StoryKanbanMinimal],
    }),
  ],
};

export default meta;
type Story = StoryObj<UIKanbanBoard<Task>>;

export const Default: Story = {
  render: () => ({
    template: `<ui-story-kanban-demo style="display: flex; height: 600px;" />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-kanban-board
  [(columns)]="columns"
  (cardMoved)="onMoved($event)"
  (cardClicked)="onClicked($event)"
>
  <ng-template let-card let-column="column">
    <div style="padding: 12px;">
      <strong>{{ card.data.title }}</strong>
      <p>{{ card.data.description }}</p>
    </div>
  </ng-template>
</ui-kanban-board>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIKanbanBoard, KanbanColumn } from '@theredhead/ui-blocks';

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

// ── SCSS ──
/* Column widths and colours are controlled via CSS custom properties:
   --kb-column-width, --kb-column-gap, --kb-accent, etc. */
`,
      },
    },
  },
};

export const Minimal: Story = {
  render: () => ({
    template: `<ui-story-kanban-minimal />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-kanban-board [(columns)]="columns" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIKanbanBoard, KanbanColumn } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [UIKanbanBoard],
  template: \\\`<ui-kanban-board [(columns)]="columns" />\\\`,
})
export class BoardComponent {
  public readonly columns = signal<KanbanColumn<{ label: string }>[]>([
    { id: 'a', title: 'Column A', cards: [
      { id: '1', data: { label: 'Card 1' } },
    ]},
    { id: 'b', title: 'Column B', cards: [] },
  ]);
}

// ── SCSS ──
/* No custom styles needed — uses fallback card ID rendering. */
`,
      },
    },
  },
};
