import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

const modes: RichTextEditorMode[] = ["html", "markdown"];

import { MarkdownWithInitialContentStorySource } from "./markdown-with-initial-content.story";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: MarkdownWithInitialContentStorySource,
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
  decorators: [
    moduleMetadata({ imports: [MarkdownWithInitialContentStorySource] }),
  ],
} satisfies Meta<MarkdownWithInitialContentStorySource>;

export default meta;
type Story = StoryObj<MarkdownWithInitialContentStorySource>;

export const MarkdownWithInitialContent: Story = {
  args: {
    disabled: false,
    readonly: false,
    placeholder: "Type here…",
    ariaLabel: "Rich text editor",
    mode: "markdown",
    presentation: "default",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: {
      ...args,
      value:
        "# Welcome\n\nThis is a **bold** and *italic* demo.\n\n- Item one\n- Item two\n- Item three\n\n> A blockquote for emphasis.\n\n```\nconst x = 42;\n```\n\nVisit [Angular](https://angular.dev) for more.",
    },
    template: `
      <ui-markdown-with-initial-content-story-demo
        [mode]="mode"
        [disabled]="disabled"
        [readonly]="readonly"
        [presentation]="presentation"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
        [value]="value"
      />
    `,
  }),
};
