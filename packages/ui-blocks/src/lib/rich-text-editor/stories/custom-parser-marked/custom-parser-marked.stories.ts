import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRichTextEditor } from "../../rich-text-editor.component";
import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

const modes: RichTextEditorMode[] = ["html", "markdown"];

import { DemoMarkedParser } from "./custom-parser-marked.story";

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
  decorators: [moduleMetadata({ imports: [DemoMarkedParser] })]
} satisfies Meta<UIRichTextEditor>;

export default meta;
type Story = StoryObj<UIRichTextEditor & { mode: RichTextEditorMode }>;

export const CustomParserMarked: Story = {
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
        ].join("\n")
      }
    }
  },
  render: () => ({
      template: "<ui-demo-marked-parser />",
    })
};
