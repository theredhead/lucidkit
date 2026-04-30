import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIKanbanBoard } from "../../kanban-board.component";

interface Task {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
}

import { StoryKanbanDemo } from "./default.story";

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
  decorators: [moduleMetadata({ imports: [StoryKanbanDemo] })]
} satisfies Meta<UIKanbanBoard<Task>>;

export default meta;
type Story = StoryObj<UIKanbanBoard<Task>>;

export const Default: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-story-kanban-demo />",
    })
};
