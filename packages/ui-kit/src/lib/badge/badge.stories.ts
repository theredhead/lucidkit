import type { Meta, StoryObj } from "@storybook/angular";

import { type BadgeColor, type BadgeVariant, UIBadge } from "./badge.component";

const meta: Meta<UIBadge> = {
  title: "@theredhead/UI Kit/Badge",
  component: UIBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A small status indicator that conveys a numeric count, a presence dot, " +
          "or a short text label.\n\n" +
          "### Variants\n" +
          "| Variant | Purpose | Example |\n" +
          "|---------|---------|---------|\n" +
          "| `count` | Numeric notification badge | Unread messages (5) |\n" +
          "| `dot` | Presence / status indicator | Online status |\n" +
          '| `label` | Short text tag | "New", "Beta" |\n\n' +
          "### Colors\n" +
          "`primary` · `success` · `warning` · `danger` · `neutral`\n\n" +
          "### Overflow\n" +
          "When `count` exceeds `maxCount`, the badge displays `maxCount+` " +
          '(e.g. "99+").',
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["count", "dot", "label"] satisfies BadgeVariant[],
      description:
        "Controls the visual shape: `count` shows a number, `dot` shows a " +
        "small circle, `label` renders projected text content.",
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
      description:
        "Semantic colour preset. Maps to `--ui-badge-bg` and " +
        "`--ui-badge-text` CSS custom properties.",
    },
    count: {
      control: "number",
      description:
        "Numeric value displayed when `variant` is `count`. " +
        "Clamped to `maxCount` with a `+` suffix when exceeded.",
    },
    maxCount: {
      control: "number",
      description:
        "Upper display limit for the `count` variant. Counts above this " +
        'threshold render as `maxCount+` (e.g. "99+"). Defaults to `99`.',
    },
  },
};

export default meta;
type Story = StoryObj<UIBadge>;

/**
 * A numeric count badge — the most common variant. Displays the
 * current `count` value, or `maxCount+` when the count exceeds the
 * maximum. Useful for notification counts, cart items, etc.
 */
export const Count: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-badge [count]="count" [color]="color" [maxCount]="maxCount" />`,
  }),
  args: { count: 5, color: "danger", maxCount: 99 },
};

/**
 * Demonstrates overflow behaviour: when `count` (150) exceeds
 * `maxCount` (99), the badge renders as "99+".
 */
export const Overflow: Story = {
  render: () => ({
    template: `<ui-badge [count]="150" [maxCount]="99" color="danger" />`,
  }),
};

/**
 * The `dot` variant renders a small coloured circle without text.
 * Ideal for online/offline indicators, status dots, or attention markers.
 */
export const Dot: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-badge variant="dot" [color]="color" />`,
  }),
  args: { color: "success" },
};

/**
 * The `label` variant renders projected text content inside the badge.
 * Perfect for status tags like "New", "Beta", "Sale", or category labels.
 */
export const Label: Story = {
  render: () => ({
    template: `<ui-badge variant="label" color="primary">New</ui-badge>`,
  }),
};

/**
 * All five colour presets side-by-side for quick visual comparison.
 * Each colour maps to semantic meaning: primary (info), success,
 * warning, danger (error), and neutral.
 */
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

/**
 * All three variants rendered together: a count badge, a status dot,
 * and a text label. Shows how badges can convey different types
 * of information at a glance.
 */
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
