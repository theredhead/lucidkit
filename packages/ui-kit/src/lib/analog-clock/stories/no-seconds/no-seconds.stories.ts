import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  ANALOG_CLOCK_STORY_ARG_TYPES,
  type AnalogClockStoryArgs,
} from "../analog-clock-story-helpers";
import { NoSecondsStorySource } from "./no-seconds.story";

const meta = {
  title: "@theredhead/UI Kit/Analog Clock",
  component: NoSecondsStorySource,
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
  decorators: [moduleMetadata({ imports: [NoSecondsStorySource] })],
} satisfies Meta<AnalogClockStoryArgs>;

export default meta;
type Story = StoryObj<AnalogClockStoryArgs>;

export const NoSeconds: Story = {
  args: {
    size: 200,
    showSeconds: false,
    showNumbers: true,
    showTickMarks: true,
    dayIconColor: "#f59e0b",
    nightIconColor: "#e8e0c0",
    ariaLabel: "Analog clock without second hand",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-no-seconds-story-demo [size]="size" [showSeconds]="showSeconds" [showNumbers]="showNumbers" [showTickMarks]="showTickMarks" [dayIconColor]="dayIconColor" [nightIconColor]="nightIconColor" [ariaLabel]="ariaLabel" />',
  }),
};
