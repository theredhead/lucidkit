import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { ContainStorySource } from "./contain.story";

const meta = {
  title: "@theredhead/UI Kit/Image",
  component: ContainStorySource,
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image source URL.",
    },
    alt: {
      control: "text",
      description: "Alternative text for accessibility.",
    },
    width: {
      control: "number",
      description: "Width in pixels.",
    },
    height: {
      control: "number",
      description: "Height in pixels.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [ContainStorySource] })],
} satisfies Meta<ContainStorySource>;

export default meta;
type Story = StoryObj<ContainStorySource>;

export const Contain: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: "Contained image",
    width: 400,
    height: 300,
    ariaLabel: "Contained image",
  },
  render: (args) => ({
    props: args,
    template: `<ui-contain-story-demo
      [src]="src"
      [alt]="alt"
      [width]="width"
      [height]="height"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
