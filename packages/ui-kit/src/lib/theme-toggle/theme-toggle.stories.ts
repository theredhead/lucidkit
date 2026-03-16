import type { Meta, StoryObj } from "@storybook/angular";

import { UIThemeToggle } from "./theme-toggle.component";

const meta: Meta<UIThemeToggle> = {
  title: "@Theredhead/UI Kit/Theme Toggle",
  component: UIThemeToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A button that cycles between light, dark, and system theme modes.\n\n" +
          "### How it works\n" +
          "Clicking the toggle cycles through three states: **light → dark → " +
          "system → light**. It works in concert with `ThemeService` from " +
          "`@theredhead/ui-theme` to apply the correct CSS class (`light-theme` " +
          "or `dark-theme`) on the `<html>` element and persist the choice in " +
          "`localStorage`.\n\n" +
          "### Variants\n" +
          "| Variant | Appearance |\n" +
          "|---------|------------|\n" +
          "| `icon` | Icon-only button (sun/moon/auto glyph) |\n" +
          "| `button` | Icon + text label showing current mode |\n\n" +
          "### Usage\n" +
          "```html\n" +
          '<ui-theme-toggle variant="button" />\n' +
          "```",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["icon", "button"],
      description:
        "Visual style: `icon` for a compact icon-only button, `button` " +
        "for a wider button with a text label alongside the icon.",
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible label forwarded to the native button element. " +
        'Defaults to `"Toggle theme"`.',
    },
  },
};

export default meta;
type Story = StoryObj<UIThemeToggle>;

/**
 * The default `icon` variant — a compact button showing only a
 * sun, moon, or auto glyph. Click to cycle through
 * light → dark → system modes.
 */
export const Default: Story = {
  args: {
    variant: "icon",
  },
};

/**
 * The `button` variant shows the current mode as a text label
 * alongside the icon. More discoverable for users who may not
 * recognise the sun/moon icons.
 */
export const ButtonVariant: Story = {
  args: {
    variant: "button",
  },
};
