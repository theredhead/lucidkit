import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { PreSelectedStorySource } from "./pre-selected.story";

const meta = {
  title: "@theredhead/UI Kit/Radio Group",
  component: PreSelectedStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A group of mutually exclusive radio buttons. Only one option " +
          "can be selected at a time.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the entire radio group.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the radio group.",
    },
  },
  decorators: [moduleMetadata({ imports: [PreSelectedStorySource] })],
} satisfies Meta<PreSelectedStorySource>;

export default meta;
type Story = StoryObj<PreSelectedStorySource>;

export const PreSelected: Story = {
  args: {
    disabled: false,
    ariaLabel: "Choose a color",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-pre-selected-story-demo
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
