import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { RichTextViewStrategy } from "../../rich-text-view.component";

const strategies: RichTextViewStrategy[] = ["auto", "html", "markdown"];

import { EmptyStorySource } from "./empty.story";

const meta = {
  title: "@theredhead/UI Kit/Rich Text View",
  component: EmptyStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          '`UIRichTextView` is a read-only renderer for HTML or Markdown content. It auto-detects the format by default (`strategy="auto"`), or you can explicitly specify `"html"` or `"markdown"`. For editable content, see the [Rich Text Editor](?path=/story/theredhead-ui-blocks-rich-text-editor--compact-chat) stories.',
      },
    },
  },
  argTypes: {
    strategy: {
      control: "select",
      options: strategies satisfies RichTextViewStrategy[],
      description:
        'Controls how `content` is interpreted. `"auto"` (default) detects HTML vs Markdown automatically.',
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the container element.",
    },
  },
  decorators: [moduleMetadata({ imports: [EmptyStorySource] })]
} satisfies Meta<EmptyStorySource>;

export default meta;
type Story = StoryObj<EmptyStorySource>;

export const Empty: Story = {
  args: {
    content: "",
    strategy: "auto",
    ariaLabel: "Empty content",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
    template: "<ui-empty-story-demo />",
  })
};
