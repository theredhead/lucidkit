import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MinimalStorySource } from "./minimal.story";

const meta = {
  title: "@theredhead/UI Blocks/Command Palette",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UICommandPalette` is a keyboard-triggered searchable action list inspired by VS Code's command palette.",
          "",
          "## Features",
          "",
          "- **Keyboard shortcut** — Opens with `Cmd+K` / `Ctrl+K` (configurable via `globalShortcut`).",
          "- **Fuzzy search** — Filters commands by label, group name, and keywords.",
          "- **Grouped results** — Commands with the same `group` appear under shared headings.",
          "- **Recent commands** — The most recently executed commands appear at the top.",
          "- **Keyboard navigation** — `↑` / `↓` to highlight, `Enter` to execute, `Esc` to close.",
          "- **Shortcut hints** — Display keyboard shortcuts alongside each command.",
          "- **Icons** — Optional SVG icons via the `UIIcons` registry.",
          "- **Accessible** — Full ARIA combobox + listbox pattern.",
          "",
          "## CSS Custom Properties",
          "",
          "`--cp-bg`, `--cp-text`, `--cp-border`, `--cp-item-active`, `--cp-kbd-bg`",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input.",
    },
    globalShortcut: {
      control: "boolean",
      description: "Enable Cmd+K / Ctrl+K global shortcut.",
    },
    maxRecent: {
      control: "number",
      description: "Max recent commands to track (0 = disabled).",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the command palette.",
    },
  },
  decorators: [moduleMetadata({ imports: [MinimalStorySource] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Minimal: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-minimal-story-demo />",
    })
};
