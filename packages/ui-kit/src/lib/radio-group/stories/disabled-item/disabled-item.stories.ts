import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DisabledItemStorySource } from "./disabled-item.story";

const meta = {
  title: "@theredhead/UI Kit/Radio Group",
  component: DisabledItemStorySource,
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
  decorators: [moduleMetadata({ imports: [DisabledItemStorySource] })],
} satisfies Meta<DisabledItemStorySource>;

export default meta;
type Story = StoryObj<DisabledItemStorySource>;

export const DisabledItem: Story = {
  args: {
    disabled: false,
    ariaLabel: "Choose a plan",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-disabled-item-story-demo
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
