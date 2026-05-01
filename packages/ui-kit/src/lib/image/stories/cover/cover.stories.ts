import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { CoverStorySource } from "./cover.story";

const meta = {
  title: "@theredhead/UI Kit/Image",
  component: CoverStorySource,
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
  decorators: [moduleMetadata({ imports: [CoverStorySource] })],
} satisfies Meta<CoverStorySource>;

export default meta;
type Story = StoryObj<CoverStorySource>;

export const Cover: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: "Cover image",
    width: 400,
    height: 300,
    ariaLabel: "Cover image",
  },
  render: (args) => ({
    props: args,
    template: `<ui-cover-story-demo
      [src]="src"
      [alt]="alt"
      [width]="width"
      [height]="height"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
