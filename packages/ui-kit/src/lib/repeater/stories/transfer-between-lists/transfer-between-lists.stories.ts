import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRepeater } from "../../repeater.component";

import { TransferBetweenListsStorySource } from "./transfer-between-lists.story";

const meta = {
  title: "@theredhead/UI Kit/Repeater",
  component: TransferBetweenListsStorySource,
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
  decorators: [moduleMetadata({ imports: [TransferBetweenListsStorySource] })],
} satisfies Meta<TransferBetweenListsStorySource>;

export default meta;
type Story = StoryObj<TransferBetweenListsStorySource>;

export const TransferBetweenLists: Story = {
  args: {
    reorderable: true,
    ariaLabel: "Transfer between lists",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-transfer-between-lists-story-demo
        [reorderable]="reorderable"
        [ariaLabel]="ariaLabel"
      />`,
  }),
};
