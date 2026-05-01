import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DemoHtmlMailMerge } from "./html-mail-merge.story";
import {
  FIXED_MODE_RICH_TEXT_EDITOR_STORY_ARG_TYPES,
  type FixedModeRichTextEditorStoryArgs,
} from "../rich-text-editor-story-helpers";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: DemoHtmlMailMerge,
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
  decorators: [moduleMetadata({ imports: [DemoHtmlMailMerge] })],
} satisfies Meta<FixedModeRichTextEditorStoryArgs>;

export default meta;
type Story = StoryObj<FixedModeRichTextEditorStoryArgs>;

export const HtmlMailMerge: Story = {
  name: "Mail-merge — HTML invoice demo",
  args: {
    disabled: false,
    readonly: false,
    placeholder: "Edit your HTML invoice template…",
    ariaLabel: "HTML mail-merge invoice template",
    presentation: "default",
  },
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-demo-html-mail-merge [disabled]="disabled" [readonly]="readonly" [placeholder]="placeholder" [ariaLabel]="ariaLabel" [presentation]="presentation" (blockInserted)="blockInserted($event)" (blockEdited)="blockEdited($event)" (blockRemoved)="blockRemoved($event)" />',
  }),
};
