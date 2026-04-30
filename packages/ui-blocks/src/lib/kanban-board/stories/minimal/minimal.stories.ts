import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIKanbanBoard } from "../../kanban-board.component";

interface Task {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
}

import { StoryKanbanMinimal } from "./minimal.story";

const meta = {
  title: "@theredhead/UI Blocks/Kanban Board",
  component: UIKanbanBoard,
  tags: ["autodocs"],
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "Accessible label for the kanban board.",
    },
  },
  decorators: [moduleMetadata({ imports: [StoryKanbanMinimal] })]
} satisfies Meta<UIKanbanBoard<Task>>;

export default meta;
type Story = StoryObj<UIKanbanBoard<Task>>;

export const Minimal: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-story-kanban-minimal />",
    })
};
