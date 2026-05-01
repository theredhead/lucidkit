import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { StoryKanbanDemo } from "./default.story";

interface KanbanDefaultStoryArgs {
  readonly ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Blocks/Kanban Board",
  component: StoryKanbanDemo,
  tags: ["autodocs"],
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "Accessible label for the kanban board.",
    },
  },
  decorators: [moduleMetadata({ imports: [StoryKanbanDemo] })],
} satisfies Meta<KanbanDefaultStoryArgs>;

export default meta;
type Story = StoryObj<KanbanDefaultStoryArgs>;

export const Default: Story = {
  args: {
    ariaLabel: "Kanban board",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-story-kanban-demo [ariaLabel]="ariaLabel"></ui-story-kanban-demo>',
  }),
};
