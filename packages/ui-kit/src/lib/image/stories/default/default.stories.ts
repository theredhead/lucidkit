import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIImage } from "../../image.component";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Image",
  component: UIImage,
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<UIImage>;

export default meta;
type Story = StoryObj<UIImage>;

export const Default: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: "Mountain landscape",
    width: 400,
    height: 300,
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
