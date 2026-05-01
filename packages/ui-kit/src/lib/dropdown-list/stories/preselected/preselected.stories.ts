import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDropdownList } from "../../dropdown-list.component";

import { PreselectedStorySource } from "./preselected.story";

const meta = {
  title: "@theredhead/UI Kit/Dropdown List",
  component: PreselectedStorySource,
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
  decorators: [moduleMetadata({ imports: [PreselectedStorySource] })]
} satisfies Meta<PreselectedStorySource>;

export default meta;
type Story = StoryObj<PreselectedStorySource>;

export const Preselected: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-preselected-story-demo />",
    })
};
