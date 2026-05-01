import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Dropdown List",
  component: DefaultStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A custom dropdown that renders an outlined button with a",
          "chevron indicator. Clicking the button opens a popover",
          "(without an arrow pointer) containing a list of selectable options.",
          "",
          "API-compatible with `UISelect` — uses the same `SelectOption`",
          "interface and two-way `value` binding.",
          "",
          "## Inputs / Outputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `options` | `SelectOption[]` | *(required)* | Available options |",
          "| `value` | `string` | `''` | Two-way bound selected value |",
          "| `placeholder` | `string` | `'— Select —'` | Text when nothing is selected |",
          "| `disabled` | `boolean` | `false` | Disables the trigger button |",
          "| `ariaLabel` | `string` | — | Accessible label for the button |",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Text shown when no option is selected.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the trigger button.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the dropdown.",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: {
    placeholder: "\u2014 Select \u2014",
    disabled: false,
    ariaLabel: "Choose a fruit",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-default-story-demo
      [placeholder]="placeholder"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
