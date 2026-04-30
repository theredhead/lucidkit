import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRichTextEditor } from "../../rich-text-editor.component";
import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

const modes: RichTextEditorMode[] = ["html", "markdown"];

import { DefaultStorySource } from "./default.story";

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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<UIRichTextEditor>;

export default meta;
type Story = StoryObj<UIRichTextEditor & { mode: RichTextEditorMode }>;

export const Default: Story = {
  args: {
    mode: "html",
    disabled: false,
    readonly: false,
    placeholder: "Type here…",
    ariaLabel: "Rich text editor",
  },
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          '- **Dual mode** \u2014 `"html"` (contenteditable WYSIWYG) or `"markdown"` (plain-text with toolbar-driven syntax insertion)',
          "- **Toolbar actions** \u2014 bold, italic, underline, strikethrough, headings, lists, links, blockquote, code, horizontal rule \u2014 fully customisable via `toolbarActions`",
          "- **Merge-field placeholders** \u2014 supply a `placeholderContext` sample object or `RichTextPlaceholder[]` array and users can insert XML `<placeholder />` blocks from the data-shape dropdown",
          "- **Image support** \u2014 paste or drop images; provide an `imageHandler` callback to upload and return a URL, or fall back to inline base64",
          "- **Max-length indicator** \u2014 optional character counter with over-limit visual feedback",
          "- **Sanitisation** \u2014 configurable `sanitise` function for stripping unsafe HTML on paste",
          "- **Pluggable Markdown parser** \u2014 inject a custom `MarkdownParser` via the `MARKDOWN_PARSER` token to swap the built-in converter for `marked`, `markdown-it`, or any other parser.",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          '| `mode` | `"html" \\| "markdown"` | `"html"` | Editing strategy |',
          "| `disabled` | `boolean` | `false` | Disables the entire editor |",
          "| `readonly` | `boolean` | `false` | Makes content visible but not editable |",
          '| `placeholder` | `string` | `""` | Placeholder text when empty |',
          '| `ariaLabel` | `string` | `"Rich text editor"` | Accessible label |',
          "| `toolbarActions` | `string[]` | *(all actions)* | Subset of toolbar buttons to show |",
          "| `placeholders` | `RichTextPlaceholder[]` | `[]` | Merge-field tokens available for insertion |",
          "| `placeholderContext` | `unknown` | — | Sample context data used to derive the placeholder picker's object/array shape |",
          "| `sanitise` | `(html: string) => string` | identity | Sanitisation function applied on paste |",
          "| `maxLength` | `number` | \u2014 | Maximum character count (plain-text length) |",
          "| `imageHandler` | `RichTextImageHandler` | \u2014 | Async function `(file: File) => Promise<string>` for uploading pasted images |",
          "",
          "## DI Tokens",
          "",
          "| Token | Type | Description |",
          "|-------|------|-------------|",
          "| `MARKDOWN_PARSER` | `MarkdownParser` | Optional. When provided, the Markdown strategy delegates its MD \u2192 HTML conversion to this parser instead of the built-in lightweight converter. See the *Custom Markdown Parser* stories below. |",
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `value` | `string` | Two-way bound HTML or Markdown content |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `placeholderInserted` | `RichTextPlaceholder` | Emitted when a merge-field placeholder is inserted |",
        ].join("\n")
      }
    }
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [disabled]="disabled"
        [readonly]="readonly"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
      />
    `,
  })
};
