import type { Meta, StoryObj } from "@storybook/angular";

import {
  type ButtonSize,
  type ButtonVariant,
  UIButton,
} from "./button.component";

const meta: Meta<UIButton> = {
  title: "@Theredhead/UI Kit/Button",
  component: UIButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined", "ghost"] satisfies ButtonVariant[],
      description: "Visual style variant of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"] satisfies ButtonSize[],
      description: "Size preset",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<UIButton>;

/** Default filled button. */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant" [size]="size" [disabled]="disabled">Click me</ui-button>`,
  }),
  args: {
    variant: "filled",
    size: "md",
    disabled: false,
  },
};

/** Outlined button variant. */
export const Outlined: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-button variant="outlined" [size]="size">Outlined</ui-button>`,
  }),
  args: { size: "md" },
};

/** Ghost button variant (no background). */
export const Ghost: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-button variant="ghost" [size]="size">Ghost</ui-button>`,
  }),
  args: { size: "md" },
};

/** Disabled button state. */
export const Disabled: Story = {
  render: () => ({
    template: `<ui-button variant="filled" [disabled]="true">Disabled</ui-button>`,
  }),
};

/** All variants side by side. */
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <ui-button variant="filled">Filled</ui-button>
        <ui-button variant="outlined">Outlined</ui-button>
        <ui-button variant="ghost">Ghost</ui-button>
      </div>
    `,
  }),
};

/** All sizes side by side. */
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <ui-button variant="filled" size="sm">Small</ui-button>
        <ui-button variant="filled" size="md">Medium</ui-button>
        <ui-button variant="filled" size="lg">Large</ui-button>
      </div>
    `,
  }),
};
