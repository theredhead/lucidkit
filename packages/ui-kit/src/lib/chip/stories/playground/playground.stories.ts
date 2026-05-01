import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ChipColor, UIChip } from "../../chip.component";

import { PlaygroundStorySource } from "./playground.story";

const meta = {
  title: "@theredhead/UI Kit/Chip",
  component: PlaygroundStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compact element for displaying tags, labels, or filter tokens.",
      },
    },
  },
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "success",
        "warning",
        "danger",
        "neutral",
      ] satisfies ChipColor[],
      description: "Colour preset.",
    },
    removable: {
      control: "boolean",
      description: "Shows a dismiss button and emits `removed` on click.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the chip.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })]
} satisfies Meta<PlaygroundStorySource>;

export default meta;
type Story = StoryObj<PlaygroundStorySource>;

export const Playground: Story = {
  args: {
    color: "primary",
    removable: false,
    disabled: false,
    ariaLabel: "Sample chip",
  },
  render: (args) => ({
    props: args,
    template: `<ui-chip
      [color]="color"
      [removable]="removable"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    >Sample chip</ui-chip>`,
  })
};
