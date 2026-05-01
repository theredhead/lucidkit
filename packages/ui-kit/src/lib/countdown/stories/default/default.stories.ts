import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UICountdown, type CountdownFormat, type CountdownMode } from "../../countdown.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Countdown",
  component: DefaultStorySource,
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: { mode: "countdown", format: "hms" },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
