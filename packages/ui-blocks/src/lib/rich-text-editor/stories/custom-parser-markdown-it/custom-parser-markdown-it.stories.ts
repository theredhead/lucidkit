import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DemoMarkdownItParser } from "./custom-parser-markdown-it.story";
import {
  FIXED_MODE_RICH_TEXT_EDITOR_STORY_ARG_TYPES,
  type FixedModeRichTextEditorStoryArgs,
} from "../rich-text-editor-story-helpers";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: DemoMarkdownItParser,
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
  decorators: [moduleMetadata({ imports: [DemoMarkdownItParser] })],
} satisfies Meta<FixedModeRichTextEditorStoryArgs>;

export default meta;
type Story = StoryObj<FixedModeRichTextEditorStoryArgs>;

export const CustomParserMarkdownIt: Story = {
  args: {
    disabled: false,
    readonly: false,
    placeholder: "Markdown parsed by markdown-it…",
    ariaLabel: "Markdown editor with markdown-it parser",
    presentation: "default",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-demo-markdownit-parser [disabled]="disabled" [readonly]="readonly" [placeholder]="placeholder" [ariaLabel]="ariaLabel" [presentation]="presentation" (blockInserted)="blockInserted($event)" (blockEdited)="blockEdited($event)" (blockRemoved)="blockRemoved($event)" />',
  }),
};
