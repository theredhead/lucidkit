import { type Meta, type StoryObj } from "@storybook/angular";
import { UIRichTextView } from "./rich-text-view.component";
import type { RichTextViewStrategy } from "./rich-text-view.component";

const strategies: RichTextViewStrategy[] = ["auto", "html", "markdown"];

const sampleHtml = `<h2>Welcome to the <em>Rich Text View</em></h2>
<p>This component renders <strong>HTML</strong> or <em>Markdown</em> content
read-only — no editing chrome required.</p>
<ul>
  <li>Safe HTML via Angular's <code>DomSanitizer</code></li>
  <li>Automatic format detection with <code>strategy="auto"</code></li>
  <li style="text-align: center">Aligned text is preserved</li>
</ul>
<blockquote>
  Simplicity is the ultimate sophistication. — Leonardo da Vinci
</blockquote>`;

const sampleMarkdown = `## Welcome to the *Rich Text View*

This component renders **HTML** or *Markdown* content read-only — no editing chrome required.

- Safe HTML via Angular's \`DomSanitizer\`
- Automatic format detection with \`strategy="auto"\`
- [Links work too](https://lucide.dev)

> Simplicity is the ultimate sophistication. — Leonardo da Vinci

\`\`\`ts
const message = "Hello, world!";
console.log(message);
\`\`\`
`;

const meta: Meta<UIRichTextView> = {
  title: "@theredhead/UI Kit/Rich Text View",
  component: UIRichTextView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          '`UIRichTextView` is a read-only renderer for HTML or Markdown content. It auto-detects the format by default (`strategy="auto"`), or you can explicitly specify `"html"` or `"markdown"`.',
      },
    },
  },
  argTypes: {
    strategy: {
      control: "select",
      options: strategies satisfies RichTextViewStrategy[],
      description:
        'Controls how `content` is interpreted. `"auto"` (default) detects HTML vs Markdown automatically.',
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the container element.",
    },
  },
};
export default meta;
type Story = StoryObj<UIRichTextView>;

/**
 * **Auto (HTML)** — Passes HTML content with `strategy="auto"`. The component
 * detects the leading `<` tag and renders it as HTML.
 */
export const AutoHtml: Story = {
  name: "Auto — HTML content",
  render: (args) => ({
    props: { ...args, content: sampleHtml },
    template: `
      <ui-rich-text-view
        [content]="content"
        [strategy]="strategy"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
  args: {
    strategy: "auto",
    ariaLabel: "Rich text content",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-rich-text-view [content]="htmlContent" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: \`<ui-rich-text-view [content]="htmlContent" />\`,
})
export class ExampleComponent {
  htmlContent = '<p>Hello <strong>world</strong></p>';
}

// ── SCSS ──
/* No custom styles needed — the component uses --ui-* tokens. */
`,
      },
    },
  },
};

/**
 * **Auto (Markdown)** — Passes Markdown content with `strategy="auto"`. The
 * component detects the absence of a leading HTML tag and converts it.
 */
export const AutoMarkdown: Story = {
  name: "Auto — Markdown content",
  render: (args) => ({
    props: { ...args, content: sampleMarkdown },
    template: `
      <ui-rich-text-view
        [content]="content"
        [strategy]="strategy"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
  args: {
    strategy: "auto",
    ariaLabel: "Markdown content",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-rich-text-view [content]="markdownContent" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: \`<ui-rich-text-view [content]="markdownContent" />\`,
})
export class ExampleComponent {
  markdownContent = '# Hello\\n**world**\\n\\nThis is a paragraph.';
}

// ── SCSS ──
/* No custom styles needed — the component uses --ui-* tokens. */
`,
      },
    },
  },
};

/**
 * **Explicit HTML** — `strategy="html"` forces HTML rendering regardless of content.
 */
export const ExplicitHtml: Story = {
  name: "Explicit HTML strategy",
  render: (args) => ({
    props: { ...args, content: sampleHtml },
    template: `
      <ui-rich-text-view
        [content]="content"
        strategy="html"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
  args: {
    ariaLabel: "Rich text content",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-rich-text-view strategy="html" [content]="htmlContent" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: \`<ui-rich-text-view strategy="html" [content]="htmlContent" />\`,
})
export class ExampleComponent {
  htmlContent = '<p>Hello <strong>world</strong></p>';
}

// ── SCSS ──
/* No custom styles needed — the component uses --ui-* tokens. */
`,
      },
    },
  },
};

/**
 * **Explicit Markdown** — `strategy="markdown"` always converts Markdown → HTML,
 * even if the content happened to start with an HTML tag.
 */
export const ExplicitMarkdown: Story = {
  name: "Explicit Markdown strategy",
  render: (args) => ({
    props: { ...args, content: sampleMarkdown },
    template: `
      <ui-rich-text-view
        [content]="content"
        strategy="markdown"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
  args: {
    ariaLabel: "Markdown content",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-rich-text-view strategy="markdown" [content]="markdownContent" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: \`<ui-rich-text-view strategy="markdown" [content]="markdownContent" />\`,
})
export class ExampleComponent {
  markdownContent = '## Hello\\n\\n**Bold**, *italic*, \`code\`.';
}

// ── SCSS ──
/* No custom styles needed — the component uses --ui-* tokens. */
`,
      },
    },
  },
};

/**
 * **Empty** — Shows the component with no content (renders nothing).
 */
export const Empty: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-rich-text-view
        [content]="content"
        [strategy]="strategy"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
  args: {
    content: "",
    strategy: "auto",
    ariaLabel: "Empty content",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-rich-text-view [content]="content" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: \`<ui-rich-text-view [content]="content" />\`,
})
export class ExampleComponent {
  content = '';
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};
