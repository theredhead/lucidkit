import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { RepeaterFlexColumnDemo } from "./flex-column.story";

const meta = {
  title: "@theredhead/UI Kit/Repeater",
  component: RepeaterFlexColumnDemo,
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
  decorators: [moduleMetadata({ imports: [RepeaterFlexColumnDemo] })],
} satisfies Meta<RepeaterFlexColumnDemo>;

export default meta;
type Story = StoryObj<RepeaterFlexColumnDemo>;

export const FlexColumn: Story = {
  args: {
    reorderable: false,
    ariaLabel: "Photo list",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-repeater-flex-column-demo
      [reorderable]="reorderable"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
