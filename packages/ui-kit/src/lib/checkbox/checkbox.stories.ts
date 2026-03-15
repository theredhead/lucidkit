import type { Meta, StoryObj } from "@storybook/angular";

import { type CheckboxVariant, UICheckbox } from "./checkbox.component";

const meta: Meta<UICheckbox> = {
  title: "@Theredhead/UI Kit/Checkbox",
  component: UICheckbox,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["checkbox", "switch"] satisfies CheckboxVariant[],
      description: "Visual appearance: checkbox or toggle switch",
    },
    checked: {
      control: "boolean",
      description: "Whether the control is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the control is disabled",
    },
    indeterminate: {
      control: "boolean",
      description: "Indeterminate state (checkbox variant only)",
    },
  },
};

export default meta;
type Story = StoryObj<UICheckbox>;

/** Default checkbox. */
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

/** Checked checkbox. */
export const Checked: Story = {
  render: () => ({
    template: `<ui-checkbox [checked]="true">This is checked</ui-checkbox>`,
  }),
};

/** Indeterminate state. */
export const Indeterminate: Story = {
  render: () => ({
    template: `<ui-checkbox [indeterminate]="true">Select all</ui-checkbox>`,
  }),
};

/** Toggle switch variant. */
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

/** Disabled states. */
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

/** All variants overview. */
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
