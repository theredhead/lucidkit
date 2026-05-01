import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { CustomSizeStorySource } from "./custom-size.story";

const meta = {
  title: "@theredhead/UI Kit/Image",
  component: CustomSizeStorySource,
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
  decorators: [moduleMetadata({ imports: [CustomSizeStorySource] })],
} satisfies Meta<CustomSizeStorySource>;

export default meta;
type Story = StoryObj<CustomSizeStorySource>;

export const CustomSize: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: "Wide banner",
    width: 800,
    height: 200,
    ariaLabel: "Wide banner",
  },
  render: (args) => ({
    props: args,
    template: `<ui-custom-size-story-demo
      [src]="src"
      [alt]="alt"
      [width]="width"
      [height]="height"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
