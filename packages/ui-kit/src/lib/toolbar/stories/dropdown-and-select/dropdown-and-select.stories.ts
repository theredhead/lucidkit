import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToolbar } from "../../toolbar.component";

import { DropdownAndSelectStorySource } from "./dropdown-and-select.story";

const meta = {
  title: "@theredhead/UI Kit/Toolbar",
  component: UIToolbar,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [DropdownAndSelectStorySource] })]
} satisfies Meta<UIToolbar>;

export default meta;
type Story = StoryObj<UIToolbar>;

export const DropdownAndSelect: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-dropdown-and-select-story-demo />",
    })
};
