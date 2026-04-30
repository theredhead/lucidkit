import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ChipColor } from "../../chip.component";

import { ChipDemo } from "./default.story";

interface ChipStoryArgs {
  ariaLabel?: string;
  color: ChipColor;
  disabled: boolean;
  removable: boolean;
  removed: (event?: void) => void;
}

const meta = {
  title: "@theredhead/UI Kit/Chip",
  component: ChipDemo,
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
    removed: {
      action: "removed",
      description: "Emitted when the configurable sample chip is dismissed.",
    },
  },
  decorators: [moduleMetadata({ imports: [ChipDemo] })],
} satisfies Meta<ChipStoryArgs>;

export default meta;
type Story = StoryObj<ChipStoryArgs>;

export const Default: Story = {
  args: {
    color: "primary",
    removable: false,
    disabled: false,
    ariaLabel: "Sample chip",
  },
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
          "```",
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<ui-chip-demo
      [color]="color"
      [removable]="removable"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
      (removed)="removed($event)"
    />`,
  }),
};
