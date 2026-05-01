import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRichTextView } from "../../rich-text-view.component";
import type { RichTextViewStrategy } from "../../rich-text-view.component";

const strategies: RichTextViewStrategy[] = ["auto", "html", "markdown"];

import { ExplicitMarkdownStorySource } from "./explicit-markdown.story";

const meta = {
  title: "@theredhead/UI Kit/Rich Text View",
  component: ExplicitMarkdownStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          '`UIRichTextView` is a read-only renderer for HTML or Markdown content. It auto-detects the format by default (`strategy="auto"`), or you can explicitly specify `"html"` or `"markdown"`.',
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
  decorators: [moduleMetadata({ imports: [ExplicitMarkdownStorySource] })]
} satisfies Meta<ExplicitMarkdownStorySource>;

export default meta;
type Story = StoryObj<ExplicitMarkdownStorySource>;

export const ExplicitMarkdown: Story = {
  name: "Explicit Markdown strategy",
  args: {
    ariaLabel: "Markdown content",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-explicit-markdown-story-demo />",
    })
};
