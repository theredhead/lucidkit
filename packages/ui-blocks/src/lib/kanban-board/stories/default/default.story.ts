import { Component, signal } from "@angular/core";
import { UIKanbanBoard } from "../../kanban-board.component";
import type { KanbanColumn, KanbanCard } from "../../kanban-board.types";

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
  templateUrl: "./default.story.html",
})
export class StoryKanbanDemo {
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
