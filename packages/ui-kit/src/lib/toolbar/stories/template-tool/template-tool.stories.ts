import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToolbar } from "../../toolbar.component";

import { TemplateToolStorySource } from "./template-tool.story";

const meta = {
  title: "@theredhead/UI Kit/Toolbar",
  component: UIToolbar,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [TemplateToolStorySource] })]
} satisfies Meta<UIToolbar>;

export default meta;
type Story = StoryObj<UIToolbar>;

export const TemplateTool: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-template-tool-story-demo />",
    })
};
