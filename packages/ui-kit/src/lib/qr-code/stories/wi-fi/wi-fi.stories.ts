import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIQRCode } from "../../qr-code.component";

import { WiFiStorySource } from "./wi-fi.story";

const meta = {
  title: "@theredhead/UI Kit/QR Code",
  component: WiFiStorySource,
  tags: ["autodocs"],
  argTypes: {
    ssid: { control: "text", description: "Wi-Fi network name." },
    passphrase: { control: "text", description: "Wi-Fi password." },
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
} satisfies Meta<WiFiStorySource>;

export default meta;
type Story = StoryObj<WiFiStorySource>;

export const WiFi: Story = {
  args: {
    ssid: "GuestNetwork",
    passphrase: "welcome123",
    size: 200,
    foreground: "#222",
    background: "#fff",
    ariaLabel: "Wi-Fi QR code",
  },
  parameters: {
    docs: {}
  },
  render: (args) => ({
    props: args,
    template: `<ui-wi-fi-story-demo
      [ssid]="ssid"
      [passphrase]="passphrase"
      [size]="size"
      [foreground]="foreground"
      [background]="background"
      [ariaLabel]="ariaLabel"
    />`,
  })
};
