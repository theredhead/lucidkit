import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIAnalogClock } from "../../analog-clock.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Analog Clock",
  component: UIAnalogClock,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIAnalogClock` renders a classic analog clock face as inline SVG.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "range", min: 40, max: 500, step: 10 },
      description: "Clock diameter in CSS pixels",
    },
    showSeconds: {
      control: "boolean",
      description: "Whether to show the second hand",
    },
    showNumbers: {
      control: "boolean",
      description: "Whether to show hour numbers (1–12)",
    },
    showTickMarks: {
      control: "boolean",
      description: "Whether to show tick marks around the rim",
    },
    dayIconColor: {
      control: "color",
      description: "Stroke colour for the daytime indicator icon",
    },
    nightIconColor: {
      control: "color",
      description: "Stroke colour for the nighttime indicator icon",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<UIAnalogClock>;

export default meta;
type Story = StoryObj<UIAnalogClock>;

export const Default: Story = {
  args: {
    size: 200,
    showSeconds: true,
    showNumbers: true,
    showTickMarks: true,
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
