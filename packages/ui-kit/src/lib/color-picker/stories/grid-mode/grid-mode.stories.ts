import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIColorPicker } from "../../color-picker.component";
import type { ColorPickerMode } from "../../color-picker.types";

import { GridModeStorySource } from "./grid-mode.story";

const meta = {
  title: "@theredhead/UI Kit/Color Picker",
  component: GridModeStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A colour-picker trigger button that opens a popover with four selection modes.",
      },
    },
  },
  argTypes: {
    value: {
      control: "color",
      description:
        "The current colour value as a hex string (`#rrggbb` or `#rrggbbaa`).",
    },
    initialMode: {
      control: "select",
      options: [
        "theme",
        "grid",
        "named",
        "rgba",
        "hsla",
      ] satisfies ColorPickerMode[],
      description: "Which tab the popover opens to by default.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the trigger button.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the trigger button.",
    },
  },
  decorators: [moduleMetadata({ imports: [GridModeStorySource] })]
} satisfies Meta<GridModeStorySource>;

export default meta;
type Story = StoryObj<GridModeStorySource>;

export const GridMode: Story = {
  args: { value: "#1565c0" },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-grid-mode-story-demo />",
    })
};
