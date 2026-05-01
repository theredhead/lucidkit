import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIThemeToggle } from "../../theme-toggle.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Theme Toggle",
  component: DefaultStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A button that cycles between light, dark, and system theme modes.",
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
    disabled: {
      control: "boolean",
      description: "Disables the toggle button.",
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible label forwarded to the native button element. " +
        'Defaults to `"Toggle theme"`.',
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### How it works\n" +
        "Clicking the toggle cycles through three states: **light → dark → " +
        "system → light**. It works in concert with `ThemeService` from " +
        "`@theredhead/lucid-theme` to apply the correct CSS class (`light-theme` " +
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
        "```"
      }
    }
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
