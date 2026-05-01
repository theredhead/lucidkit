import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDropdownMenu } from "../../dropdown-menu.component";

import { BasicStorySource } from "./basic.story";

const meta = {
  title: "@theredhead/UI Kit/Dropdown Menu",
  component: BasicStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dropdown action menu triggered by a button or custom element.",
      },
    },
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end"],
      description: "Horizontal alignment of the menu relative to the trigger.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the menu.",
    },
  },
  decorators: [moduleMetadata({ imports: [BasicStorySource] })]
} satisfies Meta<BasicStorySource>;

export default meta;
type Story = StoryObj<BasicStorySource>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Usage\n" +
        "```html\n" +
        "<ui-dropdown-menu>\n" +
        "  <ui-button trigger>Actions ▾</ui-button>\n" +
        '  <ui-dropdown-item (action)="onEdit()">Edit</ui-dropdown-item>\n' +
        "  <ui-dropdown-divider />\n" +
        '  <ui-dropdown-item (action)="onDelete()">Delete</ui-dropdown-item>\n' +
        "</ui-dropdown-menu>\n" +
        "```\n\n" +
        "### Features\n" +
        "- Click trigger to open, click item or Escape to close\n" +
        "- `start` / `end` horizontal alignment\n" +
        "- `<ui-dropdown-divider />` separators\n" +
        "- Disabled items via `[disabled]`\n" +
        "- Keyboard navigation (Enter, Space, Escape)\n" +
        "- Full dark-mode support"
      }
    }
  },
  render: () => ({
      template: "<ui-basic-story-demo />",
    })
};
