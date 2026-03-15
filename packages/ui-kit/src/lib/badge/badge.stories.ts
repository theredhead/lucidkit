import type { Meta, StoryObj } from "@storybook/angular";

import { type BadgeColor, type BadgeVariant, UIBadge } from "./badge.component";

const meta: Meta<UIBadge> = {
  title: "@theredhead/UI Kit/Badge",
  component: UIBadge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["count", "dot", "label"] satisfies BadgeVariant[],
      description: "Visual variant",
    },
    color: {
      control: "select",
      options: [
        "primary",
        "success",
        "warning",
        "danger",
        "neutral",
      ] satisfies BadgeColor[],
      description: "Color preset",
    },
    count: {
      control: "number",
      description: "Count value (count variant only)",
    },
    maxCount: {
      control: "number",
      description: "Maximum count before showing max+",
    },
  },
};

export default meta;
type Story = StoryObj<UIBadge>;

/** Count badge. */
export const Count: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-badge [count]="count" [color]="color" [maxCount]="maxCount" />`,
  }),
  args: { count: 5, color: "danger", maxCount: 99 },
};

/** Overflow count. */
export const Overflow: Story = {
  render: () => ({
    template: `<ui-badge [count]="150" [maxCount]="99" color="danger" />`,
  }),
};

/** Dot badge. */
export const Dot: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-badge variant="dot" [color]="color" />`,
  }),
  args: { color: "success" },
};

/** Label badge. */
export const Label: Story = {
  render: () => ({
    template: `<ui-badge variant="label" color="primary">New</ui-badge>`,
  }),
};

/** All colors. */
export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <ui-badge [count]="3" color="primary" />
        <ui-badge [count]="7" color="success" />
        <ui-badge [count]="12" color="warning" />
        <ui-badge [count]="99" color="danger" />
        <ui-badge [count]="42" color="neutral" />
      </div>
    `,
  }),
};

/** All variants. */
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <ui-badge [count]="5" color="danger" />
        <ui-badge variant="dot" color="success" />
        <ui-badge variant="label" color="primary">Beta</ui-badge>
      </div>
    `,
  }),
};
