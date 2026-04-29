import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIImage } from "../../image.component";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { CustomSizeStorySource } from "./custom-size.story";

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
  decorators: [moduleMetadata({ imports: [CustomSizeStorySource] })]
} satisfies Meta<UIImage>;

export default meta;
type Story = StoryObj<UIImage>;

export const CustomSize: Story = {
  args: {
    src: SAMPLE_SRC,
    width: 800,
    height: 200,
  },
  render: (args) => ({
    props: args,
    template: `<ui-image [src]="src" alt="Wide banner" [width]="width" [height]="height" />`,
  })
};
