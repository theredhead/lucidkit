import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  ANALOG_CLOCK_STORY_ARG_TYPES,
  type AnalogClockStoryArgs,
} from "../analog-clock-story-helpers";
import { CustomIconsStorySource } from "./custom-icons.story";

const meta = {
  title: "@theredhead/UI Kit/Analog Clock",
  component: CustomIconsStorySource,
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
  decorators: [moduleMetadata({ imports: [CustomIconsStorySource] })],
} satisfies Meta<AnalogClockStoryArgs>;

export default meta;
type Story = StoryObj<AnalogClockStoryArgs>;

export const CustomIcons: Story = {
  args: {
    size: 200,
    showSeconds: true,
    showNumbers: true,
    showTickMarks: true,
    dayIconColor: "#ec4899",
    nightIconColor: "#fbbf24",
    ariaLabel: "Analog clock with custom icons",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-custom-icons-story-demo [size]="size" [showSeconds]="showSeconds" [showNumbers]="showNumbers" [showTickMarks]="showTickMarks" [dayIconColor]="dayIconColor" [nightIconColor]="nightIconColor" [ariaLabel]="ariaLabel" />',
  }),
};
