import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToolbar } from "../../toolbar.component";

import { BasicButtonsStorySource } from "./basic-buttons.story";

const meta = {
  title: "@theredhead/UI Kit/Toolbar",
  component: UIToolbar,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [BasicButtonsStorySource] })]
} satisfies Meta<UIToolbar>;

export default meta;
type Story = StoryObj<UIToolbar>;

export const BasicButtons: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-basic-buttons-story-demo />",
    })
};
