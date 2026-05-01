import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DemoMarkedParser } from "./custom-parser-marked.story";
import {
  FIXED_MODE_RICH_TEXT_EDITOR_STORY_ARG_TYPES,
  type FixedModeRichTextEditorStoryArgs,
} from "../rich-text-editor-story-helpers";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: DemoMarkedParser,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIRichTextEditor` is a feature-rich WYSIWYG and Markdown editor built entirely with native browser APIs (no external editor dependency). It supports two editing modes, merge-field placeholders, image paste/drop, and optional content-length limits.",
      },
    },
  },
  argTypes: FIXED_MODE_RICH_TEXT_EDITOR_STORY_ARG_TYPES,
  decorators: [moduleMetadata({ imports: [DemoMarkedParser] })],
} satisfies Meta<FixedModeRichTextEditorStoryArgs>;

export default meta;
type Story = StoryObj<FixedModeRichTextEditorStoryArgs>;

export const CustomParserMarked: Story = {
  args: {
    disabled: false,
    readonly: false,
    placeholder: "Markdown parsed by marked…",
    ariaLabel: "Markdown editor with marked parser",
    presentation: "default",
  },
  parameters: {
    docs: {
      description: {
        story: [
          "## Pluggable Markdown Parser",
          "",
          "The `MARKDOWN_PARSER` injection token lets you swap the built-in Markdown → HTML converter ",
          "for any third-party parser — **without adding a dependency to the library itself**.",
          "",
          "### Architecture",
          "",
          "```",
          "┌─────────────────────────┐",
          "│  Consumer Application   │",
          "│                         │",
          "│  npm install marked     │",
          "│                         │",
          "│  providers: [           │",
          "│    { provide:           │",
          "│        MARKDOWN_PARSER, │",
          "│      useValue:          │",
          "│        createMarked-    │",
          "│        Parser(fn)       │",
          "│    }                    │",
          "│  ]                      │",
          "└────────────┬────────────┘",
          "             │ inject(MARKDOWN_PARSER)",
          "             ▼",
          "┌─────────────────────────┐",
          "│  UIRichTextEditor       │",
          "│                         │",
          "│  MarkdownEditing-       │",
          "│  Strategy               │",
          "│    .deserialise-        │",
          "│     Content()           │",
          "│      │                  │",
          "│      ├─ parser? ──▶ ✅  │",
          "│      │   use it         │",
          "│      │                  │",
          "│      └─ no parser ──▶   │",
          "│          built-in       │",
          "│          markdownToHtml │",
          "└─────────────────────────┘",
          "```",
          "",
          "### `MarkdownParser` interface",
          "",
          "```ts",
          "interface MarkdownParser {",
          "  toHtml(markdown: string): string;",
          "}",
          "```",
          "",
          "### Factory functions",
          "",
          "| Factory | Wraps | Description |",
          "|---------|-------|-------------|",
          "| `createMarkedParser(fn)` | `marked` | Takes `(md: string) => string`, typically `(md) => marked.parse(md) as string` |",
          "| `createMarkdownItParser(fn)` | `markdown-it` | Takes `(md: string) => string`, typically `(md) => mdit.render(md)` |",
          "",
          "You can also provide a fully custom parser — just implement the `MarkdownParser` interface directly.",
        ].join("\n"),
      },
    },
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-demo-marked-parser [disabled]="disabled" [readonly]="readonly" [placeholder]="placeholder" [ariaLabel]="ariaLabel" [presentation]="presentation" (blockInserted)="blockInserted($event)" (blockEdited)="blockEdited($event)" (blockRemoved)="blockRemoved($event)" />',
  }),
};
