import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { SliderMode } from "../../slider.types";

import { TicksStorySource } from "./ticks.story";

const meta = {
  title: "@theredhead/UI Kit/Slider",
  component: TicksStorySource,
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
  decorators: [moduleMetadata({ imports: [TicksStorySource] })],
} satisfies Meta<TicksStorySource>;

export default meta;
type Story = StoryObj<TicksStorySource>;

export const Ticks: Story = {
  args: {
    mode: "single",
    min: 0,
    max: 100,
    step: 20,
    showValue: true,
    showMinMax: false,
    showTicks: true,
    disabled: false,
    ariaLabel: "Auto",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-ticks-story-demo
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
