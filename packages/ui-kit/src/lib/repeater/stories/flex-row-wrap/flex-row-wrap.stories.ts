import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRepeater } from "../../repeater.component";

import { RepeaterFlexRowDemo } from "./flex-row-wrap.story";

const meta = {
  title: "@theredhead/UI Kit/Repeater",
  component: UIRepeater,
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
  decorators: [moduleMetadata({ imports: [RepeaterFlexRowDemo] })]
} satisfies Meta<UIRepeater>;

export default meta;
type Story = StoryObj<UIRepeater>;

export const FlexRowWrap: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-repeater-flex-row-demo />",
    })
};
