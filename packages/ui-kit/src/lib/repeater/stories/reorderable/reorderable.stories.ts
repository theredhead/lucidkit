import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ReorderableStorySource } from "./reorderable.story";

const meta = {
  title: "@theredhead/UI Kit/Repeater",
  component: ReorderableStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIRepeater` iterates over a datasource and stamps out an `<ng-template>` for each item — similar to `*ngFor` but driven by a pluggable `ArrayDatasource`. It adds **zero layout opinions**: the host component fully controls the CSS layout (grid, flex, columns, etc.).",
      },
    },
  },
  argTypes: {
    reorderable: {
      control: "boolean",
      description: "Enables drag-and-drop reordering of items.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the repeater list.",
    },
  },
  decorators: [moduleMetadata({ imports: [ReorderableStorySource] })],
} satisfies Meta<ReorderableStorySource>;

export default meta;
type Story = StoryObj<ReorderableStorySource>;

export const Reorderable: Story = {
  args: {
    reorderable: true,
    ariaLabel: "Reorderable list",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-reorderable-story-demo
      [reorderable]="reorderable"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
