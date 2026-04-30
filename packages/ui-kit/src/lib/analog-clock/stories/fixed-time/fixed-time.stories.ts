import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  ANALOG_CLOCK_STORY_ARG_TYPES,
  type AnalogClockStoryArgs,
} from "../analog-clock-story-helpers";
import { FixedTimeStorySource } from "./fixed-time.story";

const meta = {
  title: "@theredhead/UI Kit/Analog Clock",
  component: FixedTimeStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIAnalogClock` renders a classic analog clock face as inline SVG.",
      },
    },
  },
  argTypes: ANALOG_CLOCK_STORY_ARG_TYPES,
  decorators: [moduleMetadata({ imports: [FixedTimeStorySource] })],
} satisfies Meta<AnalogClockStoryArgs>;

export default meta;
type Story = StoryObj<AnalogClockStoryArgs>;

export const FixedTime: Story = {
  args: {
    size: 200,
    showSeconds: true,
    showNumbers: true,
    showTickMarks: true,
    dayIconColor: "#f59e0b",
    nightIconColor: "#e8e0c0",
    ariaLabel: "Analog clock at 10:08 AM",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-fixed-time-story-demo [size]="size" [showSeconds]="showSeconds" [showNumbers]="showNumbers" [showTickMarks]="showTickMarks" [dayIconColor]="dayIconColor" [nightIconColor]="nightIconColor" [ariaLabel]="ariaLabel" />',
  }),
};
