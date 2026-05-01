import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISidebarNav } from "../../sidebar-nav.component";

import { NavigationStorySource } from "./navigation.story";

const meta = {
  title: "@theredhead/UI Kit/Sidebar Nav",
  component: NavigationStorySource,
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
  decorators: [moduleMetadata({ imports: [NavigationStorySource] })]
} satisfies Meta<NavigationStorySource>;

export default meta;
type Story = StoryObj<NavigationStorySource>;

export const Navigation: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-navigation-story-demo />",
    })
};
