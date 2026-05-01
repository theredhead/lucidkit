import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { PlaygroundStorySource } from "./playground.story";

const meta = {
  title: "@theredhead/UI Kit/Radio Group",
  component: PlaygroundStorySource,
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
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })],
} satisfies Meta<PlaygroundStorySource>;

export default meta;
type Story = StoryObj<PlaygroundStorySource>;

export const Playground: Story = {
  args: {
    disabled: false,
    ariaLabel: "Choose a fruit",
  },
  render: (args) => ({
    props: {
      ...args,
      options: [
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry" },
      ],
    },
    template: `<ui-playground-story-demo
      [options]="options"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
