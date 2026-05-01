import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DefaultStorySource } from "./default.story";
import {
  RICH_TEXT_EDITOR_STORY_ARG_TYPES,
  type RichTextEditorStoryArgs,
} from "../rich-text-editor-story-helpers";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: DefaultStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIRichTextEditor` is a feature-rich WYSIWYG and Markdown editor built entirely with native browser APIs (no external editor dependency). It supports two editing modes, merge-field placeholders, image paste/drop, and optional content-length limits.",
      },
    },
  },
  argTypes: RICH_TEXT_EDITOR_STORY_ARG_TYPES,
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta<RichTextEditorStoryArgs>;

export default meta;
type Story = StoryObj<RichTextEditorStoryArgs>;

export const Default: Story = {
  args: {
    mode: "html",
    disabled: false,
    readonly: false,
    placeholder: "Type here…",
    ariaLabel: "Rich text editor",
    presentation: "default",
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
          "| `blockInserted` | `RichTextTemplateBlockEvent` | Emitted when a template block is inserted |",
          "| `blockEdited` | `RichTextTemplateBlockEvent` | Emitted when a template block is edited |",
          "| `blockRemoved` | `RichTextTemplateBlockEvent` | Emitted when a template block is removed |",
        ].join("\n"),
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-default-story-demo
        [mode]="mode"
        [disabled]="disabled"
        [readonly]="readonly"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
        [presentation]="presentation"
        (blockInserted)="blockInserted($event)"
        (blockEdited)="blockEdited($event)"
        (blockRemoved)="blockRemoved($event)"
      />
    `,
  }),
};
