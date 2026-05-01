import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIToolbar } from "../../toolbar.component";

import { TemplateToolStorySource } from "./template-tool.story";

const meta = {
  title: "@theredhead/UI Kit/Toolbar",
  component: TemplateToolStorySource,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [TemplateToolStorySource] })]
} satisfies Meta<TemplateToolStorySource>;

export default meta;
type Story = StoryObj<TemplateToolStorySource>;

export const TemplateTool: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-template-tool-story-demo />",
    })
};
