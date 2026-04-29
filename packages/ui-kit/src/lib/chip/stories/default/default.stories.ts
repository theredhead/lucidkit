import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ChipColor, UIChip } from "../../chip.component";

import { ChipDemo } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Chip",
  component: UIChip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compact element for displaying tags, labels, or filter tokens.",
      },
    },
  },
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "success",
        "warning",
        "danger",
        "neutral",
      ] satisfies ChipColor[],
      description: "Colour preset.",
    },
    removable: {
      control: "boolean",
      description: "Shows a dismiss button and emits `removed` on click.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the chip.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [ChipDemo] })]
} satisfies Meta<UIChip>;

export default meta;
type Story = StoryObj<UIChip>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- **Five colour presets** — `neutral`, `primary`, `success`, `warning`, `danger`\n" +
        '- **Removable** — set `[removable]="true"` to show a dismiss button; listen to `(removed)`\n' +
        "- **Disabled** — greys out and blocks interaction\n" +
        "- **Content projection** — the chip label is projected content\n\n" +
        "Chips are used inside `UIAutocomplete` for multi-select tokens, but " +
        "can also be used standalone for tag lists or filter displays.\n\n" +
        "### Usage\n" +
        "```html\n" +
        '<ui-chip color="primary" [removable]="true" (removed)="remove(tag)">\n' +
        "  {{ tag }}\n" +
        "</ui-chip>\n" +
        "```"
      }
    }
  },
  render: () => ({
      template: "<ui-chip-demo />",
    })
};
