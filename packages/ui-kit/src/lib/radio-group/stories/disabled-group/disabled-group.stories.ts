import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DisabledGroupStorySource } from "./disabled-group.story";

const meta = {
  title: "@theredhead/UI Kit/Radio Group",
  component: DisabledGroupStorySource,
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
  decorators: [moduleMetadata({ imports: [DisabledGroupStorySource] })],
} satisfies Meta<DisabledGroupStorySource>;

export default meta;
type Story = StoryObj<DisabledGroupStorySource>;

export const DisabledGroup: Story = {
  args: {
    disabled: true,
    ariaLabel: "Choose a size",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-disabled-group-story-demo
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
