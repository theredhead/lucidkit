import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToastContainer } from "../../toast.component";

import { AllSeveritiesStorySource } from "./all-severities.story";

const meta = {
  title: "@theredhead/UI Kit/Toast",
  component: AllSeveritiesStorySource,
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
  decorators: [moduleMetadata({ imports: [AllSeveritiesStorySource] })]
} satisfies Meta<AllSeveritiesStorySource>;

export default meta;
type Story = StoryObj<AllSeveritiesStorySource>;

export const AllSeverities: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Setup\n" +
        "Place `<ui-toast-container />` in your root template. " +
        "Inject `ToastService` anywhere and call `info()`, `success()`, " +
        "`warning()`, or `error()`.\n\n" +
        "### Features\n" +
        "- Four severity levels with distinct icons and colors\n" +
        "- Six position options (top/bottom × left/center/right)\n" +
        "- Optional title, action button, and custom duration\n" +
        "- `duration: 0` for persistent toasts\n" +
        "- Slide-in/slide-out animations\n" +
        "- Full dark-mode support"
      }
    }
  },
  render: () => ({
      template: "<ui-all-severities-story-demo />",
    })
};
