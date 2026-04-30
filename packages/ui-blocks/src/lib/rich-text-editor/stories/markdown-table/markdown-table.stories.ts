import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRichTextEditor } from "../../rich-text-editor.component";
import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

const modes: RichTextEditorMode[] = ["html", "markdown"];

const sampleTableMarkdown = [
  "## Package Comparison",
  "",
  "| Package | Purpose | Standalone |",
  "| :--- | :--- | :---: |",
  "| `lucid-foundation` | Core utilities & logger | Yes |",
  "| `lucid-theme` | Design tokens & dark mode | Yes |",
  "| `lucid-kit` | UI primitives | Yes |",
  "| `lucid-blocks` | Composite views | Yes |",
  "| `lucid-forms` | Schema-driven forms | Yes |",
  "",
  "### Alignment demo",
  "",
  "| Left | Center | Right |",
  "| :--- | :---: | ---: |",
  "| apple | banana | cherry |",
  "| 1 | 2 | 3 |",
].join("\n");

import { MarkdownTableStorySource } from "./markdown-table.story";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: UIRichTextEditor,
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
  decorators: [moduleMetadata({ imports: [MarkdownTableStorySource] })]
} satisfies Meta<UIRichTextEditor>;

export default meta;
type Story = StoryObj<UIRichTextEditor & { mode: RichTextEditorMode }>;

export const MarkdownTable: Story = {
  name: "Markdown — table support",
  args: {},
  parameters: {
    docs: {}
  },
  render: (args) => ({
    props: { ...args, initialValue: sampleTableMarkdown },
    template: `
      <ui-rich-text-editor
        mode="markdown"
        [value]="initialValue"
        splitDirection="horizontal"
        placeholder="Write Markdown…"
        ariaLabel="Markdown table demo"
        style="height: 420px; display: block;"
      />
    `,
  })
};
