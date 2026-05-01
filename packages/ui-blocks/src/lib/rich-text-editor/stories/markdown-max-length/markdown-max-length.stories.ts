import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

const modes: RichTextEditorMode[] = ["html", "markdown"];

import { MarkdownMaxLengthStorySource } from "./markdown-max-length.story";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: MarkdownMaxLengthStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIRichTextEditor` is a feature-rich WYSIWYG and Markdown editor built entirely with native browser APIs (no external editor dependency). It supports two editing modes, merge-field placeholders, image paste/drop, and optional content-length limits.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description:
        "Disables the editor — the toolbar is hidden and the content area cannot be focused or edited.",
    },
    readonly: {
      control: "boolean",
      description:
        "Makes the editor read-only — content is visible and selectable but the toolbar is hidden and editing is prevented.",
    },
    placeholder: {
      control: "text",
      description:
        "Placeholder text displayed inside the empty editing area. Disappears once the user starts typing.",
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible label forwarded to the contenteditable region or textarea for screen readers.",
    },
    mode: {
      control: "select",
      options: modes satisfies RichTextEditorMode[],
      description:
        'Editing strategy: `"html"` uses contenteditable with rich WYSIWYG formatting; `"markdown"` uses a plain textarea with toolbar-driven Markdown syntax insertion.',
    },
    presentation: {
      control: "select",
      options: ["default", "compact"],
      description:
        'Editor chrome presentation: `"default"` shows the full toolbar; `"compact"` uses a small floating toolbar for chat-style composition.',
    },
  },
  decorators: [moduleMetadata({ imports: [MarkdownMaxLengthStorySource] })],
} satisfies Meta<MarkdownMaxLengthStorySource>;

export default meta;
type Story = StoryObj<MarkdownMaxLengthStorySource>;

export const MarkdownMaxLength: Story = {
  args: {
    disabled: false,
    readonly: false,
    mode: "markdown",
    placeholder: "Type here…",
    ariaLabel: "Rich text editor",
    presentation: "default",
    maxLength: 150,
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: {
      ...args,
      value:
        "# Hello\n\nSome **bold** text with a [link](https://example.com).",
    },
    template: `
      <ui-markdown-max-length-story-demo
        [mode]="mode"
        [disabled]="disabled"
        [readonly]="readonly"
        [presentation]="presentation"
        [value]="value"
        [maxLength]="maxLength"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
};
