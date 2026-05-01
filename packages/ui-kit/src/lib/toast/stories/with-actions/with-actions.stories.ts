import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToastContainer } from "../../toast.component";

import { WithActionsStorySource } from "./with-actions.story";

const meta = {
  title: "@theredhead/UI Kit/Toast",
  component: WithActionsStorySource,
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
  decorators: [moduleMetadata({ imports: [WithActionsStorySource] })]
} satisfies Meta<WithActionsStorySource>;

export default meta;
type Story = StoryObj<WithActionsStorySource>;

export const WithActions: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-with-actions-story-demo />",
    })
};
