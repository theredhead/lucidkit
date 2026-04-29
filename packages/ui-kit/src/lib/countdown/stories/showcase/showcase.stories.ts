import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UICountdown, type CountdownFormat, type CountdownMode } from "../../countdown.component";

import { CountdownDemo } from "./showcase.story";

const meta = {
  title: "@theredhead/UI Kit/Countdown",
  component: UICountdown,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["countdown", "elapsed"] satisfies CountdownMode[],
      description: "Count down to target or count up from target.",
    },
    format: {
      control: "select",
      options: ["dhms", "hms", "ms"] satisfies CountdownFormat[],
      description: "Which time units are displayed.",
    },
  },
  decorators: [moduleMetadata({ imports: [CountdownDemo] })]
} satisfies Meta<UICountdown>;

export default meta;
type Story = StoryObj<UICountdown>;

export const Showcase: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-countdown-demo />",
    })
};
