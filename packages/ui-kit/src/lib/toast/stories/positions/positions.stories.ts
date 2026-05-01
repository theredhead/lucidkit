import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToastContainer } from "../../toast.component";

import { PositionsStorySource } from "./positions.story";

const meta = {
  title: "@theredhead/UI Kit/Toast",
  component: PositionsStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Auto-dismissing notification toasts.",
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      description: "Screen corner where toasts appear.",
    },
  },
  decorators: [moduleMetadata({ imports: [PositionsStorySource] })]
} satisfies Meta<PositionsStorySource>;

export default meta;
type Story = StoryObj<PositionsStorySource>;

export const Positions: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-positions-story-demo />",
    })
};
