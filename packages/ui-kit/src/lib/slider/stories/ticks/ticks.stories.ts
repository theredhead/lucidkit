import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISlider } from "../../slider.component";
import type { SliderMode } from "../../slider.types";

import { TicksStorySource } from "./ticks.story";

const meta = {
  title: "@theredhead/UI Kit/Slider",
  component: UISlider,
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
  decorators: [moduleMetadata({ imports: [TicksStorySource] })]
} satisfies Meta<UISlider>;

export default meta;
type Story = StoryObj<UISlider>;

export const Ticks: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-ticks-story-demo />",
    })
};
