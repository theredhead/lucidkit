import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIAnalogClock } from "../../analog-clock.component";

import { DayVsNightStorySource } from "./day-vs-night.story";

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
  decorators: [moduleMetadata({ imports: [DayVsNightStorySource] })]
} satisfies Meta<UIAnalogClock>;

export default meta;
type Story = StoryObj<UIAnalogClock>;

export const DayVsNight: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-day-vs-night-story-demo />",
    })
};
