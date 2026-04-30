import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToolbar } from "../../toolbar.component";

import { ButtonGroupsStorySource } from "./button-groups.story";

const meta = {
  title: "@theredhead/UI Kit/Toolbar",
  component: UIToolbar,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [ButtonGroupsStorySource] })]
} satisfies Meta<UIToolbar>;

export default meta;
type Story = StoryObj<UIToolbar>;

export const ButtonGroups: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-button-groups-story-demo />",
    })
};
