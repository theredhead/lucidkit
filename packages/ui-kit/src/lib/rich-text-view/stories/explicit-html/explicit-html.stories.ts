import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRichTextView } from "../../rich-text-view.component";
import type { RichTextViewStrategy } from "../../rich-text-view.component";

const strategies: RichTextViewStrategy[] = ["auto", "html", "markdown"];

import { ExplicitHtmlStorySource } from "./explicit-html.story";

const meta = {
  title: "@theredhead/UI Kit/Rich Text View",
  component: ExplicitHtmlStorySource,
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
  decorators: [moduleMetadata({ imports: [ExplicitHtmlStorySource] })]
} satisfies Meta<ExplicitHtmlStorySource>;

export default meta;
type Story = StoryObj<ExplicitHtmlStorySource>;

export const ExplicitHtml: Story = {
  name: "Explicit HTML strategy",
  args: {
    ariaLabel: "Rich text content",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-explicit-html-story-demo />",
    })
};
