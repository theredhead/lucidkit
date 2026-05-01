import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { RichTextPlaceholder } from "../../rich-text-editor.types";
const samplePlaceholders: RichTextPlaceholder[] = [
  { key: "firstName", label: "First Name", category: "Contact" },
  { key: "lastName", label: "Last Name", category: "Contact" },
  { key: "email", label: "Email Address", category: "Contact" },
  { key: "company", label: "Company Name", category: "Account" },
  { key: "accountId", label: "Account ID", category: "Account" },
  { key: "todayDate", label: "Today's Date", category: "System" },
];

import { MarkdownWithPlaceholdersStorySource } from "./markdown-with-placeholders.story";
import {
  RICH_TEXT_EDITOR_STORY_ARG_TYPES,
  type RichTextEditorStoryArgs,
} from "../rich-text-editor-story-helpers";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: MarkdownWithPlaceholdersStorySource,
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
  decorators: [
    moduleMetadata({ imports: [MarkdownWithPlaceholdersStorySource] }),
  ],
} satisfies Meta<RichTextEditorStoryArgs>;

export default meta;
type Story = StoryObj<RichTextEditorStoryArgs>;

export const MarkdownWithPlaceholders: Story = {
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
      placeholders: samplePlaceholders,
      value:
        'Dear <placeholder key="firstName" />,\n\nThank you for contacting **<placeholder key="company" />**. We will get back to you shortly.\n\nBest regards',
    },
    template: `
      <ui-markdown-with-placeholders-story-demo
        [mode]="mode"
        [disabled]="disabled"
        [readonly]="readonly"
        [presentation]="presentation"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
        [value]="value"
        [placeholders]="placeholders"
        (blockInserted)="blockInserted($event)"
        (blockEdited)="blockEdited($event)"
        (blockRemoved)="blockRemoved($event)"
      />
    `,
  }),
};
