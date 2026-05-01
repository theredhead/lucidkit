import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DemoCustomParser } from "./custom-parser-manual.story";
import {
  FIXED_MODE_RICH_TEXT_EDITOR_STORY_ARG_TYPES,
  type FixedModeRichTextEditorStoryArgs,
} from "../rich-text-editor-story-helpers";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: DemoCustomParser,
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
  decorators: [moduleMetadata({ imports: [DemoCustomParser] })],
} satisfies Meta<FixedModeRichTextEditorStoryArgs>;

export default meta;
type Story = StoryObj<FixedModeRichTextEditorStoryArgs>;

export const CustomParserManual: Story = {
  args: {
    disabled: false,
    readonly: false,
    placeholder: "Custom parser — headings are uppercased…",
    ariaLabel: "Markdown editor with custom parser",
    presentation: "default",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-demo-custom-parser [disabled]="disabled" [readonly]="readonly" [placeholder]="placeholder" [ariaLabel]="ariaLabel" [presentation]="presentation" (blockInserted)="blockInserted($event)" (blockEdited)="blockEdited($event)" (blockRemoved)="blockRemoved($event)" />',
  }),
};
