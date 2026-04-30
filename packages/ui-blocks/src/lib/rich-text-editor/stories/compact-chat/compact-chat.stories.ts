import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRichTextEditor } from "../../rich-text-editor.component";
import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

const modes: RichTextEditorMode[] = ["html", "markdown"];

import { CompactChatStorySource } from "./compact-chat.story";

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
  decorators: [moduleMetadata({ imports: [CompactChatStorySource] })]
} satisfies Meta<UIRichTextEditor>;

export default meta;
type Story = StoryObj<UIRichTextEditor & { mode: RichTextEditorMode }>;

export const CompactChat: Story = {
  args: {
    mode: "markdown",
    presentation: "compact",
    placeholder: "Message…",
    ariaLabel: "Chat composer",
  },
  parameters: {
    docs: {}
  },
  render: (args) => ({
    props: {
      ...args,
      value: "Hey **team** - this supports _quick_ formatting.",
    },
    template: `
      <div style="position: relative; max-width: 34rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #ffffff); padding: 1rem; border-radius: 1.25rem; border: 1px solid var(--ui-border, #d4d8dd);">
        <ui-rich-text-editor
          [mode]="mode"
          [presentation]="presentation"
          [(value)]="value"
          [placeholder]="placeholder"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
  })
};
