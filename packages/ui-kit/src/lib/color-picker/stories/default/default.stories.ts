import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIColorPicker } from "../../color-picker.component";
import type { ColorPickerMode } from "../../color-picker.types";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Color Picker",
  component: UIColorPicker,
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<UIColorPicker>;

export default meta;
type Story = StoryObj<UIColorPicker>;

export const Default: Story = {
  args: {
    value: "#0061a4",
    initialMode: "theme",
    disabled: false,
    ariaLabel: "Pick a colour",
  },
  parameters: {
    docs: {
      description: {
        story:
        "### Modes\n" +
        "1. **Theme** — Material-style palette rows in tonal luminosities\n" +
        "2. **Grid** — 72-colour flat grid covering the full spectrum\n" +
        "3. **RGBA** — Red / Green / Blue / Alpha channel sliders\n" +
        "4. **HSLA** — Hue / Saturation / Lightness / Alpha sliders\n\n" +
        "### Features\n" +
        "- Two-way binding with `[(value)]` model signal\n" +
        "- Configurable initial mode via `initialMode` input\n" +
        "- Live colour preview and hex input inside the popover\n" +
        "- Full alpha channel support\n\n" +
        "### Usage\n" +
        "```html\n" +
        '<ui-color-picker [(value)]="myColour" initialMode="rgba" />\n' +
        "```"
      }
    }
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
