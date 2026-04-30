import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISlider } from "../../slider.component";
import type { SliderMode } from "../../slider.types";

import { SliderSingleDemo } from "./single.story";

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
  decorators: [moduleMetadata({ imports: [SliderSingleDemo] })]
} satisfies Meta<UISlider>;

export default meta;
type Story = StoryObj<UISlider>;

export const Single: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- **Single mode** — one draggable thumb for scalar values (e.g. volume)\n" +
        "- **Range mode** — two thumbs for selecting a min/max interval (e.g. price range)\n" +
        "- **Step snapping** — constrain values to discrete increments\n" +
        "- **Value display** — optional current-value label above the thumb\n" +
        "- **Two-way binding** — `[(value)]` model signal\n\n" +
        "### Inputs\n" +
        "| Input | Type | Default | Description |\n" +
        "|-------|------|---------|-------------|\n" +
        "| `mode` | `'single' \\| 'range'` | `'single'` | Selection mode |\n" +
        "| `value` | `number \\| [number, number]` | `0` | Current value (model) |\n" +
        "| `min` / `max` | `number` | `0` / `100` | Value bounds |\n" +
        "| `step` | `number` | `1` | Step increment |\n" +
        "| `showValue` | `boolean` | `false` | Show numeric label |\n" +
        "| `showTicks` | `boolean` | `false` | Show tick marks at each step |\n" +
        "| `ticks` | `SliderTick[]` | `[]` | Explicit tick definitions (overrides showTicks) |\n" +
        "| `disabled` | `boolean` | `false` | Disable interaction |"
      }
    }
  },
  render: () => ({
      template: "<ui-slider-demo />",
    })
};
