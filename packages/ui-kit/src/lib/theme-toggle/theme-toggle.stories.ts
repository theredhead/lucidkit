import type { Meta, StoryObj } from "@storybook/angular";

import { UIThemeToggle } from "./theme-toggle.component";

const meta: Meta<UIThemeToggle> = {
  title: "@theredhead/UI Kit/Theme Toggle",
  component: UIThemeToggle,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["icon", "button"],
      description: "Visual style of the toggle",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the button",
    },
  },
};

export default meta;
type Story = StoryObj<UIThemeToggle>;

/**
 * Default icon button variant.
 */
export const Default: Story = {
  args: {
    variant: "icon",
  },
};

/**
 * Button variant with icon and text label.
 */
export const ButtonVariant: Story = {
  args: {
    variant: "button",
  },
};
