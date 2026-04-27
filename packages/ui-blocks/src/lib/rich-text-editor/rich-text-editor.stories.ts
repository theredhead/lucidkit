import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { UIRichTextEditor } from "./rich-text-editor.component";
import {
  UIButton,
  UIRichTextView,
  UISplitContainer,
  UISplitPanel,
} from "@theredhead/lucid-kit";
import type {
  RichTextPlaceholder,
  RichTextImageHandler,
} from "./rich-text-editor.types";
import type { RichTextEditorMode } from "./rich-text-editor.strategy";
import {
  MARKDOWN_PARSER,
  createMarkedParser,
  createMarkdownItParser,
  type MarkdownParser,
} from "./markdown-parser";
import { TextTemplateProcessor } from "@theredhead/lucid-foundation";

const samplePlaceholders: RichTextPlaceholder[] = [
  { key: "firstName", label: "First Name", category: "Contact" },
  { key: "lastName", label: "Last Name", category: "Contact" },
  { key: "email", label: "Email Address", category: "Contact" },
  { key: "company", label: "Company Name", category: "Account" },
  { key: "accountId", label: "Account ID", category: "Account" },
  { key: "todayDate", label: "Today's Date", category: "System" },
];

const modes: RichTextEditorMode[] = ["html", "markdown"];

const meta: Meta<UIRichTextEditor> = {
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
};
export default meta;
type Story = StoryObj<UIRichTextEditor & { mode: RichTextEditorMode }>;

/**
 * **Default** — A minimal editor in HTML mode with all toolbar actions
 * enabled. Use the Storybook controls to toggle `disabled`, `readonly`,
 * change the `mode`, or adjust the `placeholder` text.
 */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [disabled]="disabled"
        [readonly]="readonly"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
  args: {
    mode: "html",
    disabled: false,
    readonly: false,
    placeholder: "Type here…",
    ariaLabel: "Rich text editor",
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
          "| `placeholderInserted` | `RichTextPlaceholder` | Emitted when a merge-field placeholder is inserted |",
        ].join("\n"),
      },
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="html"
  placeholder="Type here…"
  ariaLabel="Rich text editor"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

// standalone: true, imports: [UIRichTextEditor]

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed — the component uses
   built-in design tokens. Override via --ui-*
   custom properties if desired. */
`,
      },
    },
  },
};

/**
 * **With placeholders** — Demonstrates the merge-field placeholder feature.
 * A dropdown in the toolbar lets users pick from categorised tokens
 * (Contact, Account, System). Inserted blocks appear as styled XML
 * badges in HTML mode.
 */
export const WithPlaceholders: Story = {
  render: (args) => ({
    props: { ...args, placeholders: samplePlaceholders },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [placeholders]="placeholders"
        [placeholder]="placeholder"
      />
    `,
  }),
  args: {
    placeholder: "Compose your email template…",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [placeholders]="placeholders"
  placeholder="Compose your email template…"
  (placeholderInserted)="onPlaceholder($event)"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIRichTextEditor, type RichTextPlaceholder } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly placeholders: RichTextPlaceholder[] = [
    { key: 'firstName', label: 'First Name', category: 'Contact' },
    { key: 'lastName',  label: 'Last Name',  category: 'Contact' },
    { key: 'email',     label: 'Email',       category: 'Contact' },
    { key: 'company',   label: 'Company',     category: 'Account' },
  ];

  onPlaceholder(p: RichTextPlaceholder): void {
    console.log('Inserted placeholder:', p.key);
  }
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **With initial content** — Pre-populated with an email template that
 * includes merge-field placeholders. Shows how two-way binding via
 * `[(value)]` works with existing HTML content.
 */
export const WithInitialContent: Story = {
  render: (args) => ({
    props: {
      ...args,
      placeholders: samplePlaceholders,
      value:
        "<p>Dear <placeholder key=\"firstName\" />,</p><p>Thank you for contacting <b><placeholder key=\"company\" /></b>. We will get back to you shortly.</p><p>Best regards</p>",
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [(value)]="value"
        [placeholders]="placeholders"
      />
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [(value)]="emailBody"
  [placeholders]="placeholders"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { UIRichTextEditor, type RichTextPlaceholder } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly emailBody = signal(
    '<p>Dear <placeholder key="firstName" />,</p>' +
    '<p>Thank you for contacting <b><placeholder key="company" /></b>.</p>'
  );

  readonly placeholders: RichTextPlaceholder[] = [
    { key: 'firstName', label: 'First Name', category: 'Contact' },
    { key: 'company',   label: 'Company',    category: 'Account' },
  ];
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Disabled** — The editor is fully non-interactive. The toolbar is
 * hidden and the content area is visually dimmed.
 */
export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      value: "<p>This editor is <b>disabled</b>.</p>",
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [(value)]="value"
        [disabled]="true"
      />
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [(value)]="content"
  [disabled]="true"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly content = signal('<p>This editor is <b>disabled</b>.</p>');
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Read-only** — Content is visible and selectable but cannot be
 * modified. The toolbar is hidden. Useful for preview or confirmation
 * screens.
 */
export const ReadOnly: Story = {
  render: (args) => ({
    props: {
      ...args,
      value:
        "<p>This editor is <i>read-only</i>. You can see the content but cannot edit it.</p>",
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [(value)]="value"
        [readonly]="true"
      />
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [(value)]="content"
  [readonly]="true"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly content = signal(
    '<p>This editor is <i>read-only</i>. Content is visible but not editable.</p>'
  );
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Minimal toolbar** — Only bold, italic, and underline actions are shown.
 * Pass a subset array to `[toolbarActions]` to restrict the available
 * formatting options.
 */
export const MinimalToolbar: Story = {
  render: (args) => ({
    props: {
      ...args,
      toolbarActions: ["bold", "italic", "underline"],
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [toolbarActions]="toolbarActions"
        placeholder="Basic formatting only…"
      />
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [toolbarActions]="toolbarActions"
  placeholder="Basic formatting only…"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly toolbarActions = ['bold', 'italic', 'underline'];
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Markdown mode** — Switches to a plain-text textarea with Markdown
 * syntax. Toolbar buttons insert Markdown markers (e.g. `**bold**`,
 * `*italic*`). The `value` model contains raw Markdown text.
 */
export const Markdown: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
  args: {
    mode: "markdown",
    placeholder: "Write Markdown here…",
    ariaLabel: "Markdown editor",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  placeholder="Write Markdown here…"
  ariaLabel="Markdown editor"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

// standalone: true, imports: [UIRichTextEditor]

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Markdown + placeholders** — Merge-field blocks work in Markdown mode
 * too. Placeholders are inserted as XML blocks that can be replaced by a
 * templating engine at render time.
 */
export const MarkdownWithPlaceholders: Story = {
  render: (args) => ({
    props: {
      ...args,
      placeholders: samplePlaceholders,
      value:
        "Dear <placeholder key=\"firstName\" />,\n\nThank you for contacting **<placeholder key=\"company\" />**. We will get back to you shortly.\n\nBest regards",
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [(value)]="value"
        [placeholders]="placeholders"
      />
    `,
  }),
  args: {
    mode: "markdown",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  [(value)]="template"
  [placeholders]="placeholders"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { UIRichTextEditor, type RichTextPlaceholder } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly template = signal(
    'Dear <placeholder key="firstName" />,\n\n' +
    'Thank you for contacting **<placeholder key="company" />**.\n\n' +
    'Best regards'
  );

  readonly placeholders: RichTextPlaceholder[] = [
    { key: 'firstName', label: 'First Name', category: 'Contact' },
    { key: 'company',   label: 'Company',    category: 'Account' },
  ];
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Compact chat composer** — A smaller chat-style editor with a floating
 * inline-format toolbar. In Markdown mode the preview starts hidden and can
 * be toggled from the floating toolbar.
 */
export const CompactChat: Story = {
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
  }),
  args: {
    mode: "markdown",
    presentation: "compact",
    placeholder: "Message…",
    ariaLabel: "Chat composer",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  presentation="compact"
  placeholder="Message…"
  ariaLabel="Chat composer"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

// standalone: true, imports: [UIRichTextEditor]

// ── SCSS ──────────────────────────────────────────────────────
/* Compact mode uses a rounded chat-style editor shell with
   a minimal floating toolbar. */
`,
      },
    },
  },
};

/**
 * **Markdown with initial content** — Pre-populated with a rich Markdown
 * document including headings, bold/italic, lists, blockquotes, code
 * blocks, and links. Demonstrates how complex Markdown is handled.
 */
export const MarkdownWithInitialContent: Story = {
  render: (args) => ({
    props: {
      ...args,
      value:
        "# Welcome\n\nThis is a **bold** and *italic* demo.\n\n- Item one\n- Item two\n- Item three\n\n> A blockquote for emphasis.\n\n```\nconst x = 42;\n```\n\nVisit [Angular](https://angular.dev) for more.",
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [(value)]="value"
      />
    `,
  }),
  args: {
    mode: "markdown",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  [(value)]="content"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly content = signal(
    '# Welcome\n\n' +
    'This is a **bold** and *italic* demo.\n\n' +
    '- Item one\n- Item two\n- Item three\n\n' +
    '> A blockquote for emphasis.'
  );
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Max length** — A character counter appears in the footer when
 * `[maxLength]` is set. The counter updates in real time and changes
 * colour when the limit is approached or exceeded.
 */
export const WithMaxLength: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [maxLength]="maxLength"
        [placeholder]="placeholder"
      />
    `,
  }),
  args: {
    maxLength: 200,
    placeholder: "Limited to 200 characters…",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [maxLength]="200"
  placeholder="Limited to 200 characters…"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

// standalone: true, imports: [UIRichTextEditor]

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. The counter changes
   colour automatically when the limit is
   approached or exceeded. */
`,
      },
    },
  },
};

/**
 * **Max length exceeded** — The editor starts with content that already
 * exceeds the 40-character limit. The counter turns red and shows a
 * visual warning to indicate the over-limit state.
 */
export const MaxLengthExceeded: Story = {
  render: (args) => ({
    props: {
      ...args,
      value:
        "<p>This content deliberately exceeds the maximum character limit to demonstrate the over-limit indicator in the footer.</p>",
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [maxLength]="maxLength"
        [(value)]="value"
      />
    `,
  }),
  args: {
    maxLength: 40,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [(value)]="content"
  [maxLength]="40"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly content = signal(
    '<p>This text exceeds the 40-character limit ' +
    'to demonstrate the over-limit indicator.</p>'
  );
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. The counter turns
   red automatically when the limit is exceeded. */
`,
      },
    },
  },
};

/**
 * **Full-featured** — All features enabled together: placeholders,
 * max-length counter, and initial HTML content. This is the most
 * realistic scenario for an email-template editor.
 */
export const FullFeatured: Story = {
  render: (args) => ({
    props: {
      ...args,
      placeholders: samplePlaceholders,
      value:
        "<p>Dear <placeholder key=\"firstName\" />,</p><p>Thank you for reaching out to <b><placeholder key=\"company\" /></b>.</p><p>We look forward to hearing from you.</p>",
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [(value)]="value"
        [placeholders]="placeholders"
        [maxLength]="maxLength"
        [placeholder]="placeholder"
      />
    `,
  }),
  args: {
    maxLength: 500,
    placeholder: "Compose your email template…",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [(value)]="emailBody"
  [placeholders]="placeholders"
  [maxLength]="500"
  placeholder="Compose your email template…"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { UIRichTextEditor, type RichTextPlaceholder } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly emailBody = signal(
    '<p>Dear <placeholder key="firstName" />,</p>' +
    '<p>Thank you for reaching out to <b><placeholder key="company" /></b>.</p>' +
    '<p>We look forward to hearing from you.</p>'
  );

  readonly placeholders: RichTextPlaceholder[] = [
    { key: 'firstName', label: 'First Name', category: 'Contact' },
    { key: 'lastName',  label: 'Last Name',  category: 'Contact' },
    { key: 'email',     label: 'Email',       category: 'Contact' },
    { key: 'company',   label: 'Company',     category: 'Account' },
    { key: 'todayDate', label: "Today's Date", category: 'System' },
  ];
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Markdown + max length** — Character counting works in Markdown mode
 * too. The count is based on the raw Markdown text length.
 */
export const MarkdownMaxLength: Story = {
  render: (args) => ({
    props: {
      ...args,
      value:
        "# Hello\n\nSome **bold** text with a [link](https://example.com).",
    },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [(value)]="value"
        [maxLength]="maxLength"
      />
    `,
  }),
  args: {
    mode: "markdown",
    maxLength: 150,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  [(value)]="content"
  [maxLength]="150"
/>

// ── TypeScript ────────────────────────────────────────────────
import { signal } from '@angular/core';
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly content = signal(
    '# Hello\n\n' +
    'Some **bold** text with a [link](https://example.com).'
  );
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Simulated image upload handler that returns a placeholder URL
 * after a short delay. In production, this would upload to a
 * real service (e.g. S3, Cloudinary).
 */
const mockImageHandler: RichTextImageHandler = (file: File) =>
  new Promise((resolve) => {
    setTimeout(
      () => resolve(`https://cdn.example.com/uploads/${file.name}`),
      500,
    );
  });

/**
 * **With image handler** — Demonstrates the image upload flow. When an
 * image is pasted or dropped, the `imageHandler` callback receives the
 * `File` and returns a URL. This mock handler simulates a 500ms upload
 * and returns a fake CDN URL. In production, this would upload to S3,
 * Cloudinary, or similar.
 */
export const WithImageHandler: Story = {
  render: (args) => ({
    props: { ...args, imageHandler: mockImageHandler },
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [imageHandler]="imageHandler"
        [placeholder]="placeholder"
      />
      <p style="margin-top: 8px; font-size: 13px; color: #666;">
        Paste or drop an image — it will be "uploaded" and inserted as an
        <code>&lt;img&gt;</code> with a mock CDN URL.
      </p>
    `,
  }),
  args: {
    placeholder: "Paste an image here…",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  [imageHandler]="handleImage"
  placeholder="Paste an image here…"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIRichTextEditor, type RichTextImageHandler } from '@theredhead/lucid-blocks';

export class MyComponent {
  readonly handleImage: RichTextImageHandler = async (file: File) => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const { url } = await res.json();
    return url; // inserted as <img src="…">
  };
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Image base64 fallback** — When no `imageHandler` is provided, pasted
 * images are embedded directly as base64 `data:` URIs. This is convenient
 * for quick prototyping but may produce very large HTML strings.
 */
export const ImageBase64Fallback: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-rich-text-editor
        [mode]="mode"
        [placeholder]="placeholder"
      />
      <p style="margin-top: 8px; font-size: 13px; color: #666;">
        No <code>imageHandler</code> set — pasted images will be embedded
        inline as base64 data URIs.
      </p>
    `,
  }),
  args: {
    placeholder: "Paste an image — it will embed as base64…",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  placeholder="Paste an image — it will embed as base64…"
/>

// ── TypeScript ────────────────────────────────────────────────
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

// No imageHandler provided — pasted images are
// automatically embedded as inline base64 data URIs.

// standalone: true, imports: [UIRichTextEditor]

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

// ═══════════════════════════════════════════════════════════════
//  Pluggable Markdown Parser stories
// ═══════════════════════════════════════════════════════════════

/**
 * Mock parser that simulates a `marked`-powered conversion.
 *
 * In a real application this would call `marked.parse(md)`. Here we
 * use a simple hand-rolled conversion so the story works without
 * installing `marked` as a dependency.
 *
 * @internal
 */
function mockMarkedParse(md: string): string {
  let html = md;
  // headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  // bold / italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<b><i>$1</i></b>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  html = html.replace(/\*(.+?)\*/g, "<i>$1</i>");
  // strikethrough
  html = html.replace(/~~(.+?)~~/g, "<s>$1</s>");
  // inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  // links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // paragraphs (simple: split on double newline)
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (
        !trimmed ||
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<blockquote")
      )
        return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join("\n");
  // single newlines → <br>
  html = html.replace(
    /(<p>(?:(?!<\/p>).)*)<br\/?>(?:(?!<\/p>).)*<\/p>/gs,
    (m) => m,
  );
  return html;
}

// ── Demo wrapper: marked ────────────────────────────────────────

@Component({
  selector: "ui-demo-marked-parser",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  providers: [
    {
      provide: MARKDOWN_PARSER,
      useValue: createMarkedParser((md) => mockMarkedParse(md)),
    },
  ],
  template: `
    <ui-rich-text-editor
      mode="markdown"
      [(value)]="value"
      placeholder="Markdown parsed by marked…"
      ariaLabel="Markdown editor with marked parser"
    />
    <details
      style="margin-top: 12px; font-size: 13px; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa); padding: 8px 12px; border-radius: 6px;"
    >
      <summary style="cursor: pointer; font-weight: 600;">
        Raw Markdown value
      </summary>
      <pre
        style="white-space: pre-wrap; margin-top: 8px; color: var(--ui-text, #1d232b); background: var(--ui-surface-alt, #eef0f4); padding: 8px; border-radius: 4px;"
        >{{ value() }}</pre
      >
    </details>
  `,
})
class DemoMarkedParser {
  protected readonly value = signal(
    "# Hello from marked\n\n" +
      "This editor uses a **custom `MarkdownParser`** provided via the " +
      "`MARKDOWN_PARSER` injection token.\n\n" +
      "In a real app the `createMarkedParser` factory wraps `marked.parse()` — " +
      "here we use a lightweight mock so the story works without installing `marked`.\n\n" +
      "## Features\n\n" +
      "- Full CommonMark support\n" +
      "- GFM tables, task lists, autolinks\n" +
      "- Zero config — just provide the token\n\n" +
      "> The built-in converter is still used as a fallback " +
      "when no `MARKDOWN_PARSER` is provided.",
  );
}

/**
 * **Custom Markdown Parser — `marked`** — Demonstrates how to replace
 * the built-in Markdown → HTML converter with the popular
 * [`marked`](https://www.npmjs.com/package/marked) library.
 *
 * The library itself has **zero dependency** on `marked`. The consumer
 * installs `marked` in their own project and provides the parser via
 * the `MARKDOWN_PARSER` injection token using the `createMarkedParser`
 * factory function.
 *
 * ### How it works
 *
 * 1. The consumer installs `marked`: `npm install marked`
 * 2. A `MarkdownParser` is created via `createMarkedParser(fn)`
 * 3. The parser is provided at any injector level (component, route,
 *    or root) using the `MARKDOWN_PARSER` token
 * 4. `MarkdownEditingStrategy` automatically picks it up and uses it
 *    for the live preview pane
 *
 * ### What stays the same
 *
 * - Toolbar actions still insert raw Markdown syntax (`**bold**`, etc.)
 * - The `value` model still contains raw Markdown text
 * - Placeholder `{{key}}` tokens are expanded in the preview
 * - HTML sanitisation is still applied to the preview output
 *
 * ### Fallback behaviour
 *
 * When no `MARKDOWN_PARSER` is provided, the editor falls back to its
 * built-in lightweight converter which covers headings, bold, italic,
 * lists, links, images, code blocks, and blockquotes.
 */
export const CustomParserMarked: Story = {
  render: () => ({
    template: `<ui-demo-marked-parser />`,
  }),
  decorators: [
    moduleMetadata({
      imports: [DemoMarkedParser],
    }),
  ],
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
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  [(value)]="content"
  placeholder="Markdown parsed by marked…"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, signal } from '@angular/core';
import { marked } from 'marked';
import {
  UIRichTextEditor,
  MARKDOWN_PARSER,
  createMarkedParser,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-my-editor',
  standalone: true,
  imports: [UIRichTextEditor],
  providers: [
    {
      provide: MARKDOWN_PARSER,
      useValue: createMarkedParser(
        (md) => marked.parse(md) as string
      ),
    },
  ],
  template: \`
    <ui-rich-text-editor
      mode="markdown"
      [(value)]="content"
    />
  \`,
})
export class MyEditorComponent {
  readonly content = signal('# Hello\n\nPowered by **marked**.');
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed — the preview pane renders
   whatever HTML the parser produces. The editor still
   sanitises the output. */
`,
      },
    },
  },
};

// ── Demo wrapper: markdown-it ───────────────────────────────────

@Component({
  selector: "ui-demo-markdownit-parser",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  providers: [
    {
      provide: MARKDOWN_PARSER,
      useValue: createMarkdownItParser((md) => mockMarkedParse(md)),
    },
  ],
  template: `
    <ui-rich-text-editor
      mode="markdown"
      [(value)]="value"
      placeholder="Markdown parsed by markdown-it…"
      ariaLabel="Markdown editor with markdown-it parser"
    />
    <details
      style="margin-top: 12px; font-size: 13px; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa); padding: 8px 12px; border-radius: 6px;"
    >
      <summary style="cursor: pointer; font-weight: 600;">
        Raw Markdown value
      </summary>
      <pre
        style="white-space: pre-wrap; margin-top: 8px; color: var(--ui-text, #1d232b); background: var(--ui-surface-alt, #eef0f4); padding: 8px; border-radius: 4px;"
        >{{ value() }}</pre
      >
    </details>
  `,
})
class DemoMarkdownItParser {
  protected readonly value = signal(
    "# Hello from markdown-it\n\n" +
      "This editor uses a **custom `MarkdownParser`** backed by " +
      "`markdown-it` via the `createMarkdownItParser` factory.\n\n" +
      "### Why markdown-it?\n\n" +
      "- Pluggable syntax via plugins\n" +
      "- Full CommonMark compliance\n" +
      "- Active ecosystem (`markdown-it-emoji`, `markdown-it-footnote`, …)\n\n" +
      "> As with `marked`, the library itself has *no dependency* on " +
      "`markdown-it`. The consumer installs and configures it.",
  );
}

/**
 * **Custom Markdown Parser — `markdown-it`** — Shows how to integrate
 * [`markdown-it`](https://www.npmjs.com/package/markdown-it) as the
 * Markdown → HTML converter.
 *
 * The approach is identical to the `marked` story: install the package
 * in your project, create a parser with `createMarkdownItParser`, and
 * provide it via `MARKDOWN_PARSER`.
 *
 * ### Why choose `markdown-it` over `marked`?
 *
 * - **Plugin ecosystem** — `markdown-it` supports plugins for footnotes,
 *   emoji, task lists, table of contents, and more
 * - **Fine-grained configuration** — enable/disable individual rules
 * - **CommonMark-first** — strict compliance out of the box
 *
 * Use whichever parser fits your project. The editor doesn't care —
 * it just calls `toHtml(markdown)` on whatever you provide.
 */
export const CustomParserMarkdownIt: Story = {
  render: () => ({
    template: `<ui-demo-markdownit-parser />`,
  }),
  decorators: [
    moduleMetadata({
      imports: [DemoMarkdownItParser],
    }),
  ],
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  [(value)]="content"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, signal } from '@angular/core';
import MarkdownIt from 'markdown-it';
import {
  UIRichTextEditor,
  MARKDOWN_PARSER,
  createMarkdownItParser,
} from '@theredhead/lucid-blocks';

const mdit = new MarkdownIt({
  html: false,        // disable raw HTML input
  linkify: true,      // auto-detect URLs
  typographer: true,  // smart quotes, dashes
});

@Component({
  selector: 'app-my-editor',
  standalone: true,
  imports: [UIRichTextEditor],
  providers: [
    {
      provide: MARKDOWN_PARSER,
      useValue: createMarkdownItParser(
        (md) => mdit.render(md)
      ),
    },
  ],
  template: \`
    <ui-rich-text-editor
      mode="markdown"
      [(value)]="content"
    />
  \`,
})
export class MyEditorComponent {
  readonly content = signal('# Hello\n\nPowered by **markdown-it**.');
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

// ── Demo wrapper: fully custom parser ───────────────────────────

/**
 * A deliberately minimal custom parser that demonstrates
 * implementing the `MarkdownParser` interface from scratch.
 * It uppercases headings and wraps paragraphs — nothing more.
 *
 * @internal
 */
const customParser: MarkdownParser = {
  toHtml(markdown: string): string {
    return markdown
      .split(/\n{2,}/)
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        const h1 = /^# (.+)$/.exec(trimmed);
        if (h1) return `<h1>${h1[1].toUpperCase()}</h1>`;
        const h2 = /^## (.+)$/.exec(trimmed);
        if (h2) return `<h2>${h2[1].toUpperCase()}</h2>`;
        return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
      })
      .join("\n");
  },
};

@Component({
  selector: "ui-demo-custom-parser",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  providers: [
    {
      provide: MARKDOWN_PARSER,
      useValue: customParser,
    },
  ],
  template: `
    <ui-rich-text-editor
      mode="markdown"
      [(value)]="value"
      placeholder="Custom parser — headings are uppercased…"
      ariaLabel="Markdown editor with custom parser"
    />
    <details
      style="margin-top: 12px; font-size: 13px; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa); padding: 8px 12px; border-radius: 6px;"
    >
      <summary style="cursor: pointer; font-weight: 600;">
        Raw Markdown value
      </summary>
      <pre
        style="white-space: pre-wrap; margin-top: 8px; color: var(--ui-text, #1d232b); background: var(--ui-surface-alt, #eef0f4); padding: 8px; border-radius: 4px;"
        >{{ value() }}</pre
      >
    </details>
  `,
})
class DemoCustomParser {
  protected readonly value = signal(
    "# Custom parser demo\n\n" +
      "This editor uses a fully custom `MarkdownParser` that\n" +
      "uppercases all headings in the preview.\n\n" +
      "## Try editing this\n\n" +
      "Any heading you type will appear in UPPERCASE in the preview pane, " +
      "while the raw Markdown value stays as-is.",
  );
}

/**
 * **Custom Parser (manual)** — You don't need `marked` or `markdown-it`.
 * Any object implementing `MarkdownParser` works:
 *
 * ```ts
 * interface MarkdownParser {
 *   toHtml(markdown: string): string;
 * }
 * ```
 *
 * This story demonstrates a toy parser that uppercases all headings.
 * In production you might use this for a DSL, a wiki syntax, or a
 * sanitisation layer that pre-processes Markdown before conversion.
 */
export const CustomParserManual: Story = {
  render: () => ({
    template: `<ui-demo-custom-parser />`,
  }),
  decorators: [
    moduleMetadata({
      imports: [DemoCustomParser],
    }),
  ],
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  [(value)]="content"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, signal } from '@angular/core';
import {
  UIRichTextEditor,
  MARKDOWN_PARSER,
  type MarkdownParser,
} from '@theredhead/lucid-blocks';

// Implement the interface directly — no external dependency needed
const myParser: MarkdownParser = {
  toHtml(markdown: string): string {
    // Your custom conversion logic here
    return markdown
      .split(/\n{2,}/)
      .map(block => \`<p>\${block.trim()}</p>\`)
      .join('\n');
  },
};

@Component({
  selector: 'app-my-editor',
  standalone: true,
  imports: [UIRichTextEditor],
  providers: [
    { provide: MARKDOWN_PARSER, useValue: myParser },
  ],
  template: \`
    <ui-rich-text-editor
      mode="markdown"
      [(value)]="content"
    />
  \`,
})
export class MyEditorComponent {
  readonly content = signal('# Hello\n\nCustom parsed content.');
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

// ── Mail-merge story ───────────────────────────────────────────────────────

interface InvoiceLine {
  description: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
}

interface MailMergeRecord {
  firstName: string;
  lastName: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  birthdate: string;
  email: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  accountRef: string;
  orderId: string;
  lines: InvoiceLine[];
  totalExVat: string;
  vatAmount: string;
  totalIncVat: string;
}

const mailMergeMembers: MailMergeRecord[] = [
  {
    firstName: "Alice",
    lastName: "Hartwell",
    fullName: "Alice Hartwell",
    addressLine1: "14 Maple Street",
    addressLine2: "Brighton BN1 4JT",
    birthdate: "12 March 1985",
    email: "alice.hartwell@example.com",
    invoiceNumber: "INV-2026-0041",
    invoiceDate: "18 April 2026",
    dueDate: "18 May 2026",
    accountRef: "ACT-00142",
    orderId: "ORD-88421",
    lines: [
      {
        description: "Professional License — LucidKit UI",
        quantity: "1",
        unitPrice: "£249.00",
        lineTotal: "£249.00",
      },
      {
        description: "Priority Support (12 months)",
        quantity: "1",
        unitPrice: "£49.00",
        lineTotal: "£49.00",
      },
    ],
    totalExVat: "£298.00",
    vatAmount: "£59.60",
    totalIncVat: "£357.60",
  },
  {
    firstName: "Benjamin",
    lastName: "Okafor",
    fullName: "Benjamin Okafor",
    addressLine1: "Flat 3, Ashdown House",
    addressLine2: "Manchester M4 2LG",
    birthdate: "7 August 1979",
    email: "b.okafor@example.com",
    invoiceNumber: "INV-2026-0042",
    invoiceDate: "18 April 2026",
    dueDate: "18 May 2026",
    accountRef: "ACT-00198",
    orderId: "ORD-88434",
    lines: [
      {
        description: "Enterprise License — LucidKit UI (×3 seats)",
        quantity: "3",
        unitPrice: "£599.00",
        lineTotal: "£1,797.00",
      },
      {
        description: "Onboarding Workshop (half day)",
        quantity: "1",
        unitPrice: "£395.00",
        lineTotal: "£395.00",
      },
      {
        description: "Priority Support (12 months)",
        quantity: "3",
        unitPrice: "£49.00",
        lineTotal: "£147.00",
      },
    ],
    totalExVat: "£2,339.00",
    vatAmount: "£467.80",
    totalIncVat: "£2,806.80",
  },
  {
    firstName: "Chloé",
    lastName: "Dupont",
    fullName: "Chloé Dupont",
    addressLine1: "22 rue des Lilas",
    addressLine2: "Paris 75011",
    birthdate: "30 November 1992",
    email: "chloe.dupont@example.fr",
    invoiceNumber: "INV-2026-0043",
    invoiceDate: "18 April 2026",
    dueDate: "18 May 2026",
    accountRef: "ACT-00207",
    orderId: "ORD-88451",
    lines: [
      {
        description: "Starter License — LucidKit UI",
        quantity: "1",
        unitPrice: "€89.00",
        lineTotal: "€89.00",
      },
    ],
    totalExVat: "€89.00",
    vatAmount: "€17.80",
    totalIncVat: "€106.80",
  },
  {
    firstName: "Tariq",
    lastName: "Al-Rashid",
    fullName: "Tariq Al-Rashid",
    addressLine1: "9 Westfield Gardens",
    addressLine2: "Edinburgh EH3 7SN",
    birthdate: "22 June 1988",
    email: "tariq.alrashid@example.com",
    invoiceNumber: "INV-2026-0044",
    invoiceDate: "18 April 2026",
    dueDate: "18 May 2026",
    accountRef: "ACT-00231",
    orderId: "ORD-88463",
    lines: [
      {
        description: "Professional License — LucidKit UI",
        quantity: "2",
        unitPrice: "£249.00",
        lineTotal: "£498.00",
      },
      {
        description: "Component Customisation Pack",
        quantity: "1",
        unitPrice: "£125.00",
        lineTotal: "£125.00",
      },
      {
        description: "Extended Support (6 months)",
        quantity: "2",
        unitPrice: "£29.00",
        lineTotal: "£58.00",
      },
    ],
    totalExVat: "£681.00",
    vatAmount: "£136.20",
    totalIncVat: "£817.20",
  },
];

const mailMergePlaceholders: RichTextPlaceholder[] = [
  { key: "firstName", label: "First Name", category: "Contact" },
  { key: "lastName", label: "Last Name", category: "Contact" },
  { key: "fullName", label: "Full Name", category: "Contact" },
  { key: "addressLine1", label: "Address Line 1", category: "Contact" },
  { key: "addressLine2", label: "Address Line 2", category: "Contact" },
  { key: "birthdate", label: "Date of Birth", category: "Contact" },
  { key: "email", label: "Email Address", category: "Contact" },
  { key: "invoiceNumber", label: "Invoice Number", category: "Invoice" },
  { key: "invoiceDate", label: "Invoice Date", category: "Invoice" },
  { key: "dueDate", label: "Due Date", category: "Invoice" },
  { key: "accountRef", label: "Account Reference", category: "Invoice" },
  { key: "orderId", label: "Order ID", category: "Invoice" },
  { key: "totalExVat", label: "Total (ex. VAT)", category: "Totals" },
  { key: "vatAmount", label: "VAT Amount", category: "Totals" },
  { key: "totalIncVat", label: "Total (inc. VAT)", category: "Totals" },
];

const mailMergeTemplate = [
  "**<placeholder key=\"fullName\" />**  ",
  "<placeholder key=\"addressLine1\" />  ",
  "<placeholder key=\"addressLine2\" />  ",
  "DOB: <placeholder key=\"birthdate\" />  ",
  "<placeholder key=\"email\" />",
  "",
  "---",
  "",
  "# Invoice <placeholder key=\"invoiceNumber\" />",
  "",
  "**Invoice date:** <placeholder key=\"invoiceDate\" />  ",
  "**Due date:** <placeholder key=\"dueDate\" />  ",
  "**Account ref:** <placeholder key=\"accountRef\" />  ",
  "**Order:** <placeholder key=\"orderId\" />",
  "",
  "---",
  "",
  "| Description | Qty | Unit Price | Total (ex. VAT) |",
  "| :--- | :---: | ---: | ---: |",
  "<loop items=\"lines\">| <placeholder key=\"description\" /> | <placeholder key=\"quantity\" /> | <placeholder key=\"unitPrice\" /> | <placeholder key=\"lineTotal\" /> |</loop>",
  "---",
  "",
  "| | |",
  "| ---: | ---: |",
  "| Subtotal | <placeholder key=\"totalExVat\" /> |",
  "| VAT (20%) | <placeholder key=\"vatAmount\" /> |",
  "| **Total due** | **<placeholder key=\"totalIncVat\" />** |",
  "",
  "---",
  "",
  "Please arrange payment by **<placeholder key=\"dueDate\" />**.",
  "",
  "Thank you for your business, <placeholder key=\"firstName\" />.",
].join("\n");

const mailMergeProcessor = new TextTemplateProcessor({ missingKey: "keep" });

const htmlMailMergeTemplate = [
  "<section>",
  "  <p>",
  "    <strong><placeholder key=\"fullName\" /></strong><br />",
  "    <placeholder key=\"addressLine1\" /><br />",
  "    <placeholder key=\"addressLine2\" />",
  "  </p>",
  "  <p>",
  "    DOB: <placeholder key=\"birthdate\" /><br />",
  "    <placeholder key=\"email\" />",
  "  </p>",
  "  <hr />",
  "  <h2>Invoice <placeholder key=\"invoiceNumber\" /></h2>",
  "  <p>",
  "    <strong>Invoice date:</strong> <placeholder key=\"invoiceDate\" /><br />",
  "    <strong>Due date:</strong> <placeholder key=\"dueDate\" /><br />",
  "    <strong>Account ref:</strong> <placeholder key=\"accountRef\" /><br />",
  "    <strong>Order:</strong> <placeholder key=\"orderId\" />",
  "  </p>",
  "  <h3>Line items</h3>",
  "  <table>",
  "    <thead>",
  "      <tr>",
  "        <th>Description</th>",
  "        <th>Qty</th>",
  "        <th>Unit Price</th>",
  "        <th>Total</th>",
  "      </tr>",
  "    </thead>",
  "    <tbody>",
  "      <loop items=\"lines\">",
  "        <tr>",
  "          <td><placeholder key=\"description\" /></td>",
  "          <td><placeholder key=\"quantity\" /></td>",
  "          <td><placeholder key=\"unitPrice\" /></td>",
  "          <td><placeholder key=\"lineTotal\" /></td>",
  "        </tr>",
  "      </loop>",
  "    </tbody>",
  "    <tfoot>",
  "      <tr>",
  "        <td colspan=\"3\">Subtotal</td>",
  "        <td><placeholder key=\"totalExVat\" /></td>",
  "      </tr>",
  "      <tr>",
  "        <td colspan=\"3\">VAT (20%)</td>",
  "        <td><placeholder key=\"vatAmount\" /></td>",
  "      </tr>",
  "      <tr>",
  "        <td colspan=\"3\"><strong>Total due</strong></td>",
  "        <td><strong><placeholder key=\"totalIncVat\" /></strong></td>",
  "      </tr>",
  "    </tfoot>",
  "  </table>",
  "  <p>Please arrange payment by <strong><placeholder key=\"dueDate\" /></strong>.</p>",
  "  <p>Thank you for your business, <placeholder key=\"firstName\" />.</p>",
  "</section>",
].join("\n");

@Component({
  selector: "ui-demo-mail-merge",
  standalone: true,
  imports: [
    UIRichTextEditor,
    UIRichTextView,
    UIButton,
    UISplitContainer,
    UISplitPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style:
      "display: flex; flex-direction: column; height: 100vh; overflow: hidden;",
  },
  template: `
    <ui-split-container
      name="mail-merge-demo"
      orientation="horizontal"
      style="flex: 1; min-height: 0; display: flex;"
    >
      <ui-split-panel>
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div
            style="padding: 6px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ui-text-muted, #5a6470); background: var(--ui-surface-2, #f0f2f5); border-bottom: 1px solid var(--ui-border, #d0d5dd);"
          >
            Template
          </div>
          <ui-rich-text-editor
            mode="markdown"
            [(value)]="content"
            [placeholders]="placeholders"
            [placeholderContext]="placeholderContext"
            placeholder="Edit your invoice template…"
            ariaLabel="Mail-merge invoice template"
            style="flex: 1; min-height: 0; display: flex; flex-direction: column;"
          />
        </div>
      </ui-split-panel>

      <ui-split-panel>
        <div style="display: flex; flex-direction: column; height: 100%;">
          <!-- Member navigator -->
          <div
            style="display: flex; align-items: center; gap: 8px; padding: 4px 8px; background: var(--ui-surface-2, #f0f2f5); border-bottom: 1px solid var(--ui-border, #d0d5dd);"
          >
            <ui-button
              variant="ghost"
              size="small"
              [disabled]="currentIndex() === 0"
              ariaLabel="Previous member"
              (click)="prev()"
              >←</ui-button
            >
            <span
              style="flex: 1; text-align: center; font-size: 12px; font-weight: 600; color: var(--ui-text, #1d232b);"
            >
              {{ members[currentIndex()].fullName }}
              <span
                style="font-weight: 400; color: var(--ui-text-muted, #5a6470);"
                >({{ currentIndex() + 1 }} / {{ members.length }})</span
              >
            </span>
            <ui-button
              variant="ghost"
              size="small"
              [disabled]="currentIndex() === members.length - 1"
              ariaLabel="Next member"
              (click)="next()"
              >→</ui-button
            >
          </div>
          <!-- Rendered invoice -->
          <div
            style="flex: 1; overflow: auto; padding: 16px; background: var(--ui-surface, #f7f8fa); color: var(--ui-text, #1d232b);"
          >
            <ui-rich-text-view
              [content]="renderedContent()"
              strategy="markdown"
              ariaLabel="Invoice preview"
            />
          </div>
        </div>
      </ui-split-panel>
    </ui-split-container>
  `,
})
class DemoMailMerge {
  protected readonly currentIndex = signal(0);

  protected readonly content = signal(mailMergeTemplate);

  protected readonly renderedContent = computed(() => {
    const member = this.members[this.currentIndex()] as unknown as Record<
      string,
      unknown
    >;
    return mailMergeProcessor.expand(this.content(), member);
  });

  protected readonly members = mailMergeMembers;

  protected readonly placeholders = mailMergePlaceholders;

  protected readonly placeholderContext = mailMergeMembers[0];

  protected prev(): void {
    this.currentIndex.update((i) => Math.max(0, i - 1));
  }

  protected next(): void {
    this.currentIndex.update((i) => Math.min(this.members.length - 1, i + 1));
  }
}

/**
 * **Mail-merge** — A complete mail-merge workflow built entirely from
 * `UIRichTextEditor` + `UIRichTextView`. Edit the Markdown invoice template
 * on the left (inserting merge-field tokens via the toolbar placeholder
 * picker), then page through the four fictional members on the right to see
 * each personalised invoice rendered live.
 *
 * The template uses GFM tables for the line-item and totals rows.
 * All token replacement is a single `computed()` — no loops or server
 * round-trips required.
 */
export const MailMerge: Story = {
  name: "Mail-merge — invoice demo",
  render: () => ({
    template: `<ui-demo-mail-merge />`,
  }),
  decorators: [
    moduleMetadata({
      imports: [DemoMailMerge],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  [(value)]="template"
  [placeholders]="placeholders"
  [placeholderContext]="currentMember()"
/>

<!-- Rendered preview for the selected member -->
<ui-rich-text-view
  [content]="renderedContent()"
  strategy="markdown"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, computed, signal } from '@angular/core';
import { TextTemplateProcessor } from '@theredhead/lucid-foundation';
import { UIRichTextView } from '@theredhead/lucid-kit';
import {
  UIRichTextEditor,
  type RichTextPlaceholder,
} from '@theredhead/lucid-blocks';

@Component({
  standalone: true,
  imports: [UIRichTextEditor, UIRichTextView],
  templateUrl: './mail-merge.component.html',
})
export class MailMergeComponent {
  readonly template = signal(
    'Dear <placeholder key="fullName" />,\\n\\n' +
    '<loop items="lines">- <placeholder key="description" />\\n</loop>'
  );

  readonly currentMember = signal({
    fullName: 'Alice Hartwell',
    invoiceNumber: 'INV-001',
    lines: [{ description: 'Professional License' }],
  });

  readonly placeholders: RichTextPlaceholder[] = [
    { key: 'fullName',      label: 'Full Name',      category: 'Contact' },
    { key: 'invoiceNumber', label: 'Invoice Number', category: 'Invoice' },
    // …
  ];

  readonly renderedContent = computed(() => {
    return new TextTemplateProcessor({ missingKey: 'keep' }).expand(
      this.template(),
      this.currentMember(),
    );
  });
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed — layout handled by host flexbox. */
`,
      },
    },
  },
};

@Component({
  selector: "ui-demo-html-mail-merge",
  standalone: true,
  imports: [
    UIRichTextEditor,
    UIRichTextView,
    UIButton,
    UISplitContainer,
    UISplitPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style:
      "display: flex; flex-direction: column; height: 100vh; overflow: hidden;",
  },
  template: `
    <ui-split-container
      name="html-mail-merge-demo"
      orientation="horizontal"
      style="flex: 1; min-height: 0; display: flex;"
    >
      <ui-split-panel>
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div
            style="padding: 6px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ui-text-muted, #5a6470); background: var(--ui-surface-2, #f0f2f5); border-bottom: 1px solid var(--ui-border, #d0d5dd);"
          >
            HTML Template
          </div>
          <ui-rich-text-editor
            mode="html"
            [(value)]="content"
            [placeholders]="placeholders"
            [placeholderContext]="placeholderContext"
            placeholder="Edit your HTML invoice template…"
            ariaLabel="HTML mail-merge invoice template"
            style="flex: 1; min-height: 0; display: flex; flex-direction: column;"
          />
        </div>
      </ui-split-panel>

      <ui-split-panel>
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div
            style="display: flex; align-items: center; gap: 8px; padding: 4px 8px; background: var(--ui-surface-2, #f0f2f5); border-bottom: 1px solid var(--ui-border, #d0d5dd);"
          >
            <ui-button
              variant="ghost"
              size="small"
              [disabled]="currentIndex() === 0"
              ariaLabel="Previous member"
              (click)="prev()"
              >Previous</ui-button
            >
            <span
              style="flex: 1; text-align: center; font-size: 12px; font-weight: 600; color: var(--ui-text, #1d232b);"
            >
              {{ members[currentIndex()].fullName }}
              <span
                style="font-weight: 400; color: var(--ui-text-muted, #5a6470);"
                >({{ currentIndex() + 1 }} / {{ members.length }})</span
              >
            </span>
            <ui-button
              variant="ghost"
              size="small"
              [disabled]="currentIndex() === members.length - 1"
              ariaLabel="Next member"
              (click)="next()"
              >Next</ui-button
            >
          </div>
          <div
            style="flex: 1; overflow: auto; padding: 16px; background: var(--ui-surface, #f7f8fa); color: var(--ui-text, #1d232b);"
          >
            <ui-rich-text-view
              [content]="renderedContent()"
              strategy="html"
              ariaLabel="HTML invoice preview"
            />
          </div>
        </div>
      </ui-split-panel>
    </ui-split-container>
  `,
})
class DemoHtmlMailMerge {
  protected readonly currentIndex = signal(0);

  protected readonly content = signal(htmlMailMergeTemplate);

  protected readonly renderedContent = computed(() => {
    const member = this.members[this.currentIndex()] as unknown as Record<
      string,
      unknown
    >;
    return mailMergeProcessor.expand(this.content(), member);
  });

  protected readonly members = mailMergeMembers;

  protected readonly placeholders = mailMergePlaceholders;

  protected readonly placeholderContext = mailMergeMembers[0];

  protected prev(): void {
    this.currentIndex.update((i) => Math.max(0, i - 1));
  }

  protected next(): void {
    this.currentIndex.update((i) => Math.min(this.members.length - 1, i + 1));
  }
}

/**
 * **HTML mail-merge** — The same invoice workflow as the Markdown example,
 * but authored as XML-compatible HTML. Template blocks still use the same
 * foundation XML block provider registry.
 */
export const HtmlMailMerge: Story = {
  name: "Mail-merge — HTML invoice demo",
  render: () => ({
    template: `<ui-demo-html-mail-merge />`,
  }),
  decorators: [
    moduleMetadata({
      imports: [DemoHtmlMailMerge],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="html"
  [(value)]="template"
  [placeholders]="placeholders"
  [placeholderContext]="currentMember()"
/>

<ui-rich-text-view
  [content]="renderedContent()"
  strategy="html"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, computed, signal } from '@angular/core';
import { TextTemplateProcessor } from '@theredhead/lucid-foundation';
import { UIRichTextView } from '@theredhead/lucid-kit';
import {
  UIRichTextEditor,
  type RichTextPlaceholder,
} from '@theredhead/lucid-blocks';

export class HtmlMailMergeComponent {
  readonly template = signal(
    '<h2>Invoice <placeholder key="invoiceNumber" /></h2>' +
    '<p>Dear <placeholder key="fullName" />,</p>' +
    '<loop items="lines"><p><placeholder key="description" />: <placeholder key="lineTotal" /></p></loop>'
  );

  readonly currentMember = signal({
    fullName: 'Alice Hartwell',
    invoiceNumber: 'INV-001',
    lines: [{ description: 'Professional License', lineTotal: '€249.00' }],
  });

  readonly placeholders: RichTextPlaceholder[] = [
    { key: 'fullName',      label: 'Full Name',      category: 'Contact' },
    { key: 'invoiceNumber', label: 'Invoice Number', category: 'Invoice' },
  ];

  readonly renderedContent = computed(() =>
    new TextTemplateProcessor({ missingKey: 'keep' }).expand(
      this.template(),
      this.currentMember(),
    )
  );
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

const sampleTableMarkdown = [
  "## Package Comparison",
  "",
  "| Package | Purpose | Standalone |",
  "| :--- | :--- | :---: |",
  "| `lucid-foundation` | Core utilities & logger | Yes |",
  "| `lucid-theme` | Design tokens & dark mode | Yes |",
  "| `lucid-kit` | UI primitives | Yes |",
  "| `lucid-blocks` | Composite views | Yes |",
  "| `lucid-forms` | Schema-driven forms | Yes |",
  "",
  "### Alignment demo",
  "",
  "| Left | Center | Right |",
  "| :--- | :---: | ---: |",
  "| apple | banana | cherry |",
  "| 1 | 2 | 3 |",
].join("\n");

/**
 * **Markdown Table** — The editor in Markdown mode with a pre-populated
 * GFM pipe table. The split-pane preview renders column alignment correctly.
 * Edit any cell value and watch the preview update live.
 */
export const MarkdownTable: Story = {
  name: "Markdown — table support",
  render: (args) => ({
    props: { ...args, initialValue: sampleTableMarkdown },
    template: `
      <ui-rich-text-editor
        mode="markdown"
        [value]="initialValue"
        splitDirection="horizontal"
        placeholder="Write Markdown…"
        ariaLabel="Markdown table demo"
        style="height: 420px; display: block;"
      />
    `,
  }),
  args: {},
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-rich-text-editor
  mode="markdown"
  [(value)]="content"
  splitDirection="horizontal"
/>

// ── TypeScript ────────────────────────────────────────────────
import { Component, signal } from '@angular/core';
import { UIRichTextEditor } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextEditor],
  template: \`
    <ui-rich-text-editor
      mode="markdown"
      [(value)]="content"
      splitDirection="horizontal"
    />
  \`,
})
export class ExampleComponent {
  readonly content = signal(
    '| Name | Role |\\n| :--- | ---: |\\n| Alice | Admin |'
  );
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};
