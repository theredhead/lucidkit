import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  ANALOG_CLOCK_STORY_ARG_TYPES,
  type AnalogClockStoryArgs,
} from "../analog-clock-story-helpers";
import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Analog Clock",
  component: DefaultStorySource,
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta<AnalogClockStoryArgs>;

export default meta;
type Story = StoryObj<AnalogClockStoryArgs>;

export const Default: Story = {
  args: {
    size: 200,
    showSeconds: true,
    showNumbers: true,
    showTickMarks: true,
    dayIconColor: "#f59e0b",
    nightIconColor: "#e8e0c0",
    ariaLabel: "Analog clock",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-default-story-demo [size]="size" [showSeconds]="showSeconds" [showNumbers]="showNumbers" [showTickMarks]="showTickMarks" [dayIconColor]="dayIconColor" [nightIconColor]="nightIconColor" [ariaLabel]="ariaLabel" />',
  }),
};
