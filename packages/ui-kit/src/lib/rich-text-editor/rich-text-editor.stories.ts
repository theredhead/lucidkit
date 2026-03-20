import { type Meta, type StoryObj } from "@storybook/angular";
import { UIRichTextEditor } from "./rich-text-editor.component";
import type {
  RichTextPlaceholder,
  RichTextImageHandler,
} from "./rich-text-editor.types";
import type { RichTextEditorMode } from "./rich-text-editor.strategy";

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
  title: "@Theredhead/UI Kit/Rich Text Editor",
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
          "- **Merge-field placeholders** \u2014 supply a `RichTextPlaceholder[]` array and users can insert `{{key}}` tokens from a categorised dropdown",
          "- **Image support** \u2014 paste or drop images; provide an `imageHandler` callback to upload and return a URL, or fall back to inline base64",
          "- **Max-length indicator** \u2014 optional character counter with over-limit visual feedback",
          "- **Sanitisation** \u2014 configurable `sanitise` function for stripping unsafe HTML on paste",
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
          "| `sanitise` | `(html: string) => string` | identity | Sanitisation function applied on paste |",
          "| `maxLength` | `number` | \u2014 | Maximum character count (plain-text length) |",
          "| `imageHandler` | `RichTextImageHandler` | \u2014 | Async function `(file: File) => Promise<string>` for uploading pasted images |",
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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
 * (Contact, Account, System). Inserted tokens appear as styled `{{key}}`
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
import { UIRichTextEditor, type RichTextPlaceholder } from '@theredhead/ui-kit';

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
        "<p>Dear {{firstName}},</p><p>Thank you for contacting <b>{{company}}</b>. We will get back to you shortly.</p><p>Best regards</p>",
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
import { UIRichTextEditor, type RichTextPlaceholder } from '@theredhead/ui-kit';

export class MyComponent {
  readonly emailBody = signal(
    '<p>Dear {{firstName}},</p>' +
    '<p>Thank you for contacting <b>{{company}}</b>.</p>'
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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
import { UIRichTextEditor } from '@theredhead/ui-kit';

// standalone: true, imports: [UIRichTextEditor]

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Markdown + placeholders** — Merge-field tokens work in Markdown mode
 * too. Placeholders are inserted as `{{key}}` text that can be replaced
 * by a templating engine at render time.
 */
export const MarkdownWithPlaceholders: Story = {
  render: (args) => ({
    props: {
      ...args,
      placeholders: samplePlaceholders,
      value:
        "Dear {{firstName}},\n\nThank you for contacting **{{company}}**. We will get back to you shortly.\n\nBest regards",
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
import { UIRichTextEditor, type RichTextPlaceholder } from '@theredhead/ui-kit';

export class MyComponent {
  readonly template = signal(
    'Dear {{firstName}},\n\n' +
    'Thank you for contacting **{{company}}**.\n\n' +
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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
        "<p>Dear {{firstName}},</p><p>Thank you for reaching out to <b>{{company}}</b>.</p><p>We look forward to hearing from you.</p>",
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
import { UIRichTextEditor, type RichTextPlaceholder } from '@theredhead/ui-kit';

export class MyComponent {
  readonly emailBody = signal(
    '<p>Dear {{firstName}},</p>' +
    '<p>Thank you for reaching out to <b>{{company}}</b>.</p>' +
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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
import { UIRichTextEditor, type RichTextImageHandler } from '@theredhead/ui-kit';

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
import { UIRichTextEditor } from '@theredhead/ui-kit';

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
