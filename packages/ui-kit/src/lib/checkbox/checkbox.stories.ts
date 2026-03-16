import type { Meta, StoryObj } from "@storybook/angular";

import { type CheckboxVariant, UICheckbox } from "./checkbox.component";

const meta: Meta<UICheckbox> = {
  title: "@Theredhead/UI Kit/Checkbox",
  component: UICheckbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dual-purpose boolean input that renders as either a traditional " +
          "checkbox or a toggle switch.\n\n" +
          "### Features\n" +
          "- **Two-way binding** via the `checked` model signal — `[(checked)]`\n" +
          '- **Switch variant** — set `variant="switch"` for iOS / Material-style toggles\n' +
          '- **Indeterminate state** — visual third state for "select all" patterns\n' +
          "- **Label projection** — text content is projected as the label\n" +
          '- **Accessible** — renders a native `<input type="checkbox">` with proper ARIA\n\n' +
          "### Usage\n" +
          "```html\n" +
          '<ui-checkbox [(checked)]="agreeToTerms">I accept the terms</ui-checkbox>\n' +
          '<ui-checkbox variant="switch" [(checked)]="darkMode">Dark mode</ui-checkbox>\n' +
          "```",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["checkbox", "switch"] satisfies CheckboxVariant[],
      description:
        "Controls the visual appearance. `checkbox` renders a traditional " +
        "tick box; `switch` renders a sliding toggle.",
    },
    checked: {
      control: "boolean",
      description:
        "Two-way bindable model signal (`[(checked)]`). Represents " +
        "the on/off state of the control.",
    },
    disabled: {
      control: "boolean",
      description:
        "Disables the control, preventing interaction and applying " +
        "a muted visual style.",
    },
    indeterminate: {
      control: "boolean",
      description:
        "Shows a horizontal dash instead of a tick mark. Useful for " +
        '"select all" controls where only some children are selected. ' +
        "Only applies to the `checkbox` variant.",
    },
  },
};

export default meta;
type Story = StoryObj<UICheckbox>;

/**
 * Interactive checkbox with controls for `variant`, `checked`,
 * `disabled`, and `indeterminate`. Content projection provides
 * the label text.
 */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-checkbox [variant]="variant" [checked]="checked" [disabled]="disabled">Accept terms</ui-checkbox>`,
  }),
  args: {
    variant: "checkbox",
    checked: false,
    disabled: false,
  },
};

/**
 * Pre-checked checkbox — demonstrates the initial `checked` state.
 */
export const Checked: Story = {
  render: () => ({
    template: `<ui-checkbox [checked]="true">This is checked</ui-checkbox>`,
  }),
};

/**
 * The indeterminate state shows a dash mark instead of a tick.
 * Commonly used for "select all" checkboxes when only a subset
 * of child items are checked.
 */
export const Indeterminate: Story = {
  render: () => ({
    template: `<ui-checkbox [indeterminate]="true">Select all</ui-checkbox>`,
  }),
};

/**
 * The `switch` variant renders a sliding toggle — ideal for
 * boolean settings like "Dark mode", "Notifications", or feature flags.
 */
export const Switch: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-checkbox variant="switch" [checked]="checked">Dark mode</ui-checkbox>`,
  }),
  args: { checked: false },
};

/** Switch checked. */
export const SwitchChecked: Story = {
  render: () => ({
    template: `<ui-checkbox variant="switch" [checked]="true">Notifications enabled</ui-checkbox>`,
  }),
};

/**
 * All disabled combinations: unchecked, checked, switch off, and
 * switch on. Disabled controls display a muted appearance and
 * prevent interaction.
 */
export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <ui-checkbox [disabled]="true">Disabled unchecked</ui-checkbox>
        <ui-checkbox [disabled]="true" [checked]="true">Disabled checked</ui-checkbox>
        <ui-checkbox variant="switch" [disabled]="true">Disabled switch</ui-checkbox>
        <ui-checkbox variant="switch" [disabled]="true" [checked]="true">Disabled switch on</ui-checkbox>
      </div>
    `,
  }),
};

/**
 * Complete overview of every state and variant combination.
 * Useful for visual regression testing and design review.
 */
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <ui-checkbox>Unchecked</ui-checkbox>
        <ui-checkbox [checked]="true">Checked</ui-checkbox>
        <ui-checkbox [indeterminate]="true">Indeterminate</ui-checkbox>
        <ui-checkbox variant="switch">Switch off</ui-checkbox>
        <ui-checkbox variant="switch" [checked]="true">Switch on</ui-checkbox>
      </div>
    `,
  }),
};
