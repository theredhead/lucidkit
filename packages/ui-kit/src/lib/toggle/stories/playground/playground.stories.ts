import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ToggleSize, UIToggle } from "../../toggle.component";

import { PlaygroundStorySource } from "./playground.story";

const meta = {
  title: "@theredhead/UI Kit/Toggle",
  component: UIToggle,
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
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })]
} satisfies Meta<UIToggle>;

export default meta;
type Story = StoryObj<UIToggle>;

export const Playground: Story = {
  args: {
    value: false,
    onLabel: "ON",
    offLabel: "OFF",
    size: "medium",
    disabled: false,
    ariaLabel: "Toggle switch",
  },
  render: () => ({
      template: "<ui-playground-story-demo />",
    })
};
