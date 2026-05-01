import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISidebarNav } from "../../sidebar-nav.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Sidebar Nav",
  component: DefaultStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A vertical sidebar navigation component with collapsible groups.",
      },
    },
  },
  argTypes: {
    collapsed: {
      control: "boolean",
      description: "Collapses the sidebar to icon-only mode.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the navigation landmark.",
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
        "### Sub-components\n" +
        "| Component | Purpose |\n" +
        "|-----------|--------|\n" +
        "| `<ui-sidebar-nav>` | Container with `navigation` landmark role |\n" +
        "| `<ui-sidebar-item>` | Individual nav item with icon, label, badge |\n" +
        "| `<ui-sidebar-group>` | Collapsible group with header + children |\n\n" +
        "### Features\n" +
        "- Click-to-navigate with `(activated)` output\n" +
        "- Collapsible groups with `[(expanded)]` two-way binding\n" +
        "- SVG icons via `UIIcons` registry and `<ui-icon>` component\n" +
        "- Active item highlighting\n" +
        "- Disabled items\n" +
        "- Keyboard accessible (Enter, Space)\n" +
        "- Full dark-mode support"
      }
    }
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
