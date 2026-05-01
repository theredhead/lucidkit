import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { RichTextPlaceholder } from "../../rich-text-editor.types";
import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

const samplePlaceholders: RichTextPlaceholder[] = [
  { key: "firstName", label: "First Name", category: "Contact" },
  { key: "lastName", label: "Last Name", category: "Contact" },
  { key: "email", label: "Email Address", category: "Contact" },
  { key: "company", label: "Company Name", category: "Account" },
  { key: "accountId", label: "Account ID", category: "Account" },
  { key: "todayDate", label: "Today's Date", category: "System" },
];

const modes: RichTextEditorMode[] = ["html", "markdown"];

import { WithInitialContentStorySource } from "./with-initial-content.story";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: WithInitialContentStorySource,
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
  decorators: [moduleMetadata({ imports: [WithInitialContentStorySource] })],
} satisfies Meta<WithInitialContentStorySource>;

export default meta;
type Story = StoryObj<WithInitialContentStorySource>;

export const WithInitialContent: Story = {
  args: {
    disabled: false,
    readonly: false,
    placeholder: "Type here…",
    ariaLabel: "Rich text editor",
    mode: "html",
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
        '<p>Dear <placeholder key="firstName" />,</p><p>Thank you for contacting <b><placeholder key="company" /></b>. We will get back to you shortly.</p><p>Best regards</p>',
    },
    template: `
      <ui-with-initial-content-story-demo
        [mode]="mode"
        [disabled]="disabled"
        [readonly]="readonly"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
        [presentation]="presentation"
        [value]="value"
        [placeholders]="placeholders"
      />
    `,
  }),
};
