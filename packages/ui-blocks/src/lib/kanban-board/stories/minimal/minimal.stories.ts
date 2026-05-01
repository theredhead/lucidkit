import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { StoryKanbanMinimal } from "./minimal.story";

interface KanbanMinimalStoryArgs {
  readonly ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Blocks/Kanban Board",
  component: StoryKanbanMinimal,
  tags: ["autodocs"],
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "Accessible label for the kanban board.",
    },
  },
  decorators: [moduleMetadata({ imports: [StoryKanbanMinimal] })],
} satisfies Meta<KanbanMinimalStoryArgs>;

export default meta;
type Story = StoryObj<KanbanMinimalStoryArgs>;

export const Minimal: Story = {
  args: {
    ariaLabel: "Kanban board",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-story-kanban-minimal [ariaLabel]="ariaLabel"></ui-story-kanban-minimal>',
  }),
};
