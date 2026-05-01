import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToolbar } from "../../toolbar.component";

import { FloatingToggleStorySource } from "./floating-toggle.story";

const meta = {
  title: "@theredhead/UI Kit/Toolbar",
  component: FloatingToggleStorySource,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FloatingToggleStorySource] })]
} satisfies Meta<FloatingToggleStorySource>;

export default meta;
type Story = StoryObj<FloatingToggleStorySource>;

export const FloatingToggle: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-floating-toggle-story-demo />",
    })
};
