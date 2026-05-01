import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToolbar } from "../../toolbar.component";

import { ToggleToolsStorySource } from "./toggle-tools.story";

const meta = {
  title: "@theredhead/UI Kit/Toolbar",
  component: ToggleToolsStorySource,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [ToggleToolsStorySource] })]
} satisfies Meta<ToggleToolsStorySource>;

export default meta;
type Story = StoryObj<ToggleToolsStorySource>;

export const ToggleTools: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-toggle-tools-story-demo />",
    })
};
