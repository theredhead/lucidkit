import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISidebarNav } from "../../sidebar-nav.component";

import { WithBadgesStorySource } from "./with-badges.story";

const meta = {
  title: "@theredhead/UI Kit/Sidebar Nav",
  component: WithBadgesStorySource,
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
  decorators: [moduleMetadata({ imports: [WithBadgesStorySource] })]
} satisfies Meta<WithBadgesStorySource>;

export default meta;
type Story = StoryObj<WithBadgesStorySource>;

export const WithBadges: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-with-badges-story-demo />",
    })
};
