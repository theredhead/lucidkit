import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISidebarNav } from "../../sidebar-nav.component";

import { CollapsedGroupsStorySource } from "./collapsed-groups.story";

const meta = {
  title: "@theredhead/UI Kit/Sidebar Nav",
  component: CollapsedGroupsStorySource,
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
  decorators: [moduleMetadata({ imports: [CollapsedGroupsStorySource] })]
} satisfies Meta<CollapsedGroupsStorySource>;

export default meta;
type Story = StoryObj<CollapsedGroupsStorySource>;

export const CollapsedGroups: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-collapsed-groups-story-demo />",
    })
};
