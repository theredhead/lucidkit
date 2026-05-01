import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { SliderMode } from "../../slider.types";

import { SliderRangeDemo } from "./range.story";

const meta = {
  title: "@theredhead/UI Kit/Slider",
  component: SliderRangeDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A range-input component that supports both single-value and " +
          "dual-thumb range selection.",
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "range"] satisfies SliderMode[],
      description: "Selection mode: one thumb or two.",
    },
    min: {
      control: "number",
      description: "Minimum bound.",
    },
    max: {
      control: "number",
      description: "Maximum bound.",
    },
    step: {
      control: "number",
      description: "Step increment.",
    },
    showValue: {
      control: "boolean",
      description: "Show the current value label above the thumb.",
    },
    showMinMax: {
      control: "boolean",
      description: "Show min/max labels at either end of the track.",
    },
    showTicks: {
      control: "boolean",
      description: "Show tick marks at each step.",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [SliderRangeDemo] })],
} satisfies Meta<SliderRangeDemo>;

export default meta;
type Story = StoryObj<SliderRangeDemo>;

export const Range: Story = {
  args: {
    mode: "range",
    min: 0,
    max: 1000,
    step: 10,
    showValue: true,
    showMinMax: false,
    showTicks: false,
    disabled: false,
    ariaLabel: "Price",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-slider-range-demo
      [mode]="mode"
      [min]="min"
      [max]="max"
      [step]="step"
      [showValue]="showValue"
      [showMinMax]="showMinMax"
      [showTicks]="showTicks"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
