import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ToggleSize, UIToggle } from "../../toggle.component";

import { DemoToggleSizes } from "./sizes.story";

const meta = {
  title: "@theredhead/UI Kit/Toggle",
  component: DemoToggleSizes,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A toggle switch with customisable on/off labels.",
      },
    },
  },
  argTypes: {
    value: {
      control: "boolean",
      description: "On/off state (two-way bindable via `[(value)]`).",
    },
    onLabel: {
      control: "text",
      description: "Label shown inside the track when the toggle is on.",
    },
    offLabel: {
      control: "text",
      description: "Label shown inside the track when the toggle is off.",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"] satisfies ToggleSize[],
      description: "Size variant.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the toggle.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [DemoToggleSizes] })]
} satisfies Meta<DemoToggleSizes>;

export default meta;
type Story = StoryObj<DemoToggleSizes>;

export const Sizes: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-toggle-sizes />",
    })
};
