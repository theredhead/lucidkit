import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISourceTabs } from "../../source-tabs.component";

import { UISourceTabsStoryDemo } from "./default.story";

const meta = {
  title: "@theredhead/UI Blocks/Source Tabs",
  component: UISourceTabs,
  tags: ["autodocs"],
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "Accessible label for the source tab list.",
    },
    emptyMessage: {
      control: "text",
      description: "Fallback message shown when no source panes are present.",
    },
  },
  decorators: [moduleMetadata({ imports: [UISourceTabsStoryDemo] })]
} satisfies Meta<UISourceTabs>;

export default meta;
type Story = StoryObj<UISourceTabs>;

export const Default: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-source-tabs-story-demo />",
    })
};
