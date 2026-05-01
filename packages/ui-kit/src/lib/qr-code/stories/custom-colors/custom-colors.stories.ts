import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIQRCode } from "../../qr-code.component";

import { CustomColorsStorySource } from "./custom-colors.story";

const meta = {
  title: "@theredhead/UI Kit/QR Code",
  component: CustomColorsStorySource,
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
  decorators: [moduleMetadata({ imports: [CustomColorsStorySource] })]
} satisfies Meta<CustomColorsStorySource>;

export default meta;
type Story = StoryObj<CustomColorsStorySource>;

export const CustomColors: Story = {
  args: {
    value: "https://theredhead.nl",
    size: 160,
    foreground: "#0a7cff",
    background: "#eaf6ff",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-custom-colors-story-demo />",
    })
};
