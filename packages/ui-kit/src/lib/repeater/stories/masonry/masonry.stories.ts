import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { RepeaterMasonryDemo } from "./masonry.story";

const meta = {
  title: "@theredhead/UI Kit/Repeater",
  component: RepeaterMasonryDemo,
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
  decorators: [moduleMetadata({ imports: [RepeaterMasonryDemo] })],
} satisfies Meta<RepeaterMasonryDemo>;

export default meta;
type Story = StoryObj<RepeaterMasonryDemo>;

export const Masonry: Story = {
  args: {
    reorderable: false,
    ariaLabel: "Masonry gallery",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-repeater-masonry-demo
      [reorderable]="reorderable"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
