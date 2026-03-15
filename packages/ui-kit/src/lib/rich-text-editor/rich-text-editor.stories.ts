import { type Meta, type StoryObj } from "@storybook/angular";
import { UIRichTextEditor } from "./rich-text-editor.component";
import type { RichTextPlaceholder } from "./rich-text-editor.types";

const samplePlaceholders: RichTextPlaceholder[] = [
  { key: "firstName", label: "First Name", category: "Contact" },
  { key: "lastName", label: "Last Name", category: "Contact" },
  { key: "email", label: "Email Address", category: "Contact" },
  { key: "company", label: "Company Name", category: "Account" },
  { key: "accountId", label: "Account ID", category: "Account" },
  { key: "todayDate", label: "Today's Date", category: "System" },
];

const meta: Meta<UIRichTextEditor> = {
  title: "@theredhead/UI Kit/Rich Text Editor",
  component: UIRichTextEditor,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    placeholder: { control: "text" },
    ariaLabel: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<UIRichTextEditor>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-rich-text-editor
        [disabled]="disabled"
        [readonly]="readonly"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
  args: {
    disabled: false,
    readonly: false,
    placeholder: "Type here…",
    ariaLabel: "Rich text editor",
  },
};

export const WithPlaceholders: Story = {
  render: (args) => ({
    props: { ...args, placeholders: samplePlaceholders },
    template: `
      <ui-rich-text-editor
        [placeholders]="placeholders"
        [placeholder]="placeholder"
      />
    `,
  }),
  args: {
    placeholder: "Compose your email template…",
  },
};

export const WithInitialContent: Story = {
  render: (args) => ({
    props: {
      ...args,
      placeholders: samplePlaceholders,
      value:
        "<p>Dear {{firstName}},</p><p>Thank you for contacting <b>{{company}}</b>. We will get back to you shortly.</p><p>Best regards</p>",
    },
    template: `
      <ui-rich-text-editor
        [(value)]="value"
        [placeholders]="placeholders"
      />
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: "<p>This editor is <b>disabled</b>.</p>",
    },
    template: `
      <ui-rich-text-editor
        [(value)]="value"
        [disabled]="true"
      />
    `,
  }),
};

export const ReadOnly: Story = {
  render: (args) => ({
    props: {
      ...args,
      value:
        "<p>This editor is <i>read-only</i>. You can see the content but cannot edit it.</p>",
    },
    template: `
      <ui-rich-text-editor
        [(value)]="value"
        [readonly]="true"
      />
    `,
  }),
};

export const MinimalToolbar: Story = {
  render: (args) => ({
    props: {
      ...args,
      toolbarActions: ["bold", "italic", "underline"],
    },
    template: `
      <ui-rich-text-editor
        [toolbarActions]="toolbarActions"
        placeholder="Basic formatting only…"
      />
    `,
  }),
};
