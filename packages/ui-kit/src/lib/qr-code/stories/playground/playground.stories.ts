import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIQRCode } from "../../qr-code.component";

import { PlaygroundStorySource } from "./playground.story";

const meta = {
  title: "@theredhead/UI Kit/QR Code",
  component: UIQRCode,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "The data to encode in the QR code.",
    },
    size: {
      control: "number",
      description: "QR code size in pixels.",
    },
    foreground: {
      control: "color",
      description: "Foreground (module) colour.",
    },
    background: {
      control: "color",
      description: "Background colour.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })]
} satisfies Meta<UIQRCode>;

export default meta;
type Story = StoryObj<UIQRCode>;

export const Playground: Story = {
  args: {
    value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    size: 180,
    foreground: "#222",
    background: "#fff",
    ariaLabel: "QR code",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-playground-story-demo />",
    })
};
