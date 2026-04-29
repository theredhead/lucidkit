import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIQRCode } from "../../qr-code.component";

import { WiFiStorySource } from "./wi-fi.story";

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
  decorators: [moduleMetadata({ imports: [WiFiStorySource] })]
} satisfies Meta<UIQRCode>;

export default meta;
type Story = StoryObj<UIQRCode>;

export const WiFi: Story = {
  args: {
    value: "WIFI:T:WPA;S:GuestNetwork;P:welcome123;;",
    size: 200,
    foreground: "#222",
    background: "#fff",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-wi-fi-story-demo />",
    })
};
