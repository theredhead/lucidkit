import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIFileUpload, type UIFileEntry } from "./file-upload.component";

// ── Demo wrappers ──────────────────────────────────────────────────

@Component({
  selector: "ui-file-upload-default-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-file-upload
      [(files)]="files"
      (fileAdded)="onAdded($event)"
      (fileRemoved)="onRemoved($event)"
    />
    @if (log().length) {
      <pre class="story-log">{{ log().join("\\n") }}</pre>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
      }
      .story-log {
        margin-top: 0.75rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        background: var(--ui-surface-2, #f0f2f5);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        white-space: pre-wrap;
        color: var(--ui-text, #1d232b);
      }
    `,
  ],
})
class DefaultDemo {
  protected readonly files = signal<readonly UIFileEntry[]>([]);
  protected readonly log = signal<string[]>([]);

  protected onAdded(entry: UIFileEntry): void {
    this.log.update((l) => [...l, `+ Added: ${entry.file.name}`]);
  }

  protected onRemoved(entry: UIFileEntry): void {
    this.log.update((l) => [...l, `- Removed: ${entry.file.name}`]);
  }
}

@Component({
  selector: "ui-file-upload-images-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-file-upload
      accept="image/*"
      [multiple]="true"
      label="Drop images here or click to browse"
      [(files)]="files"
      (fileRejected)="onRejected($event)"
    />
    @if (rejections().length) {
      <pre class="story-log">{{ rejections().join("\\n") }}</pre>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
      }
      .story-log {
        margin-top: 0.75rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        background: var(--ui-surface-2, #f0f2f5);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        white-space: pre-wrap;
        color: var(--ui-text, #1d232b);
      }
    `,
  ],
})
class ImagesDemo {
  protected readonly files = signal<readonly UIFileEntry[]>([]);
  protected readonly rejections = signal<string[]>([]);

  protected onRejected(event: { file: File; reason: string }): void {
    this.rejections.update((l) => [
      ...l,
      `✗ ${event.file.name}: ${event.reason}`,
    ]);
  }
}

@Component({
  selector: "ui-file-upload-size-limit-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-file-upload
      [multiple]="true"
      [maxFileSize]="maxSize"
      label="Drop files (max 1 MB each)"
      [(files)]="files"
      (fileRejected)="onRejected($event)"
    />
    @if (rejections().length) {
      <pre class="story-log">{{ rejections().join("\\n") }}</pre>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
      }
      .story-log {
        margin-top: 0.75rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        background: var(--ui-surface-2, #f0f2f5);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        white-space: pre-wrap;
        color: var(--ui-text, #1d232b);
      }
    `,
  ],
})
class SizeLimitDemo {
  protected readonly maxSize = 1024 * 1024; // 1 MB
  protected readonly files = signal<readonly UIFileEntry[]>([]);
  protected readonly rejections = signal<string[]>([]);

  protected onRejected(event: { file: File; reason: string }): void {
    this.rejections.update((l) => [
      ...l,
      `✗ ${event.file.name}: ${event.reason}`,
    ]);
  }
}

@Component({
  selector: "ui-file-upload-disabled-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ui-file-upload [disabled]="true" label="Upload is disabled" /> `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
      }
    `,
  ],
})
class DisabledDemo {}

@Component({
  selector: "ui-file-upload-documents-demo",
  standalone: true,
  imports: [UIFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-file-upload
      accept=".pdf,.doc,.docx,.txt"
      [multiple]="true"
      label="Drop documents here (.pdf, .doc, .txt)"
      [(files)]="files"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
      }
    `,
  ],
})
class DocumentsDemo {
  protected readonly files = signal<readonly UIFileEntry[]>([]);
}

// ── Storybook meta ─────────────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Kit/File Upload",
  tags: ["autodocs"],
  argTypes: {
    accept: {
      control: "text",
      description: "Accepted file types (MIME or extension, e.g. `image/*`, `.pdf,.docx`).",
    },
    multiple: {
      control: "boolean",
      description: "Allow selecting multiple files.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the upload zone.",
    },
    label: {
      control: "text",
      description: "Label text displayed inside the drop zone.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "`UIFileUpload` provides a drag-and-drop zone with a click-to-browse fallback for selecting files. It supports file-type filtering, size limits, single or multi-file selection, and a two-way `files` model.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        UIFileUpload,
        DefaultDemo,
        ImagesDemo,
        SizeLimitDemo,
        DisabledDemo,
        DocumentsDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/**
 * Interactive playground — adjust every input via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-file-upload
      [accept]="accept"
      [multiple]="multiple"
      [disabled]="disabled"
      [label]="label"
      [ariaLabel]="ariaLabel"
    />`,
  }),
  args: {
    accept: "",
    multiple: false,
    disabled: false,
    label: "Drop files here or click to browse",
    ariaLabel: "Upload file",
  },
};

/**
 * **Default** — A single-file upload zone with event logging. Drop a file
 * or click to browse. The log below shows `fileAdded` and `fileRemoved`
 * events as they fire.
 */
export const Default: Story = {
  render: () => ({ template: `<ui-file-upload-default-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-file-upload
  [(files)]="files"
  (fileAdded)="onAdded($event)"
  (fileRemoved)="onRemoved($event)"
/>

<!-- readonly files = signal<readonly UIFileEntry[]>([]); -->`,
        language: "html",
      },
    },
  },
};

/**
 * **Images only** — Multi-file upload restricted to `image/*` MIME types.
 * Non-image files are rejected and the rejection reason is logged below
 * via the `fileRejected` output.
 */
export const ImagesOnly: Story = {
  render: () => ({ template: `<ui-file-upload-images-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-file-upload
  accept="image/*"
  [multiple]="true"
  label="Drop images here or click to browse"
  [(files)]="files"
  (fileRejected)="onRejected($event)"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Size limit** — Multi-file upload with a 1 MB (`1048576` bytes) per-file
 * limit. Files exceeding this size are rejected with a descriptive message.
 */
export const SizeLimit: Story = {
  render: () => ({ template: `<ui-file-upload-size-limit-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-file-upload
  [multiple]="true"
  [maxFileSize]="1048576"
  label="Drop files (max 1 MB each)"
  [(files)]="files"
  (fileRejected)="onRejected($event)"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Disabled** — The drop zone is visually dimmed and does not respond to
 * drag, drop, or click interactions.
 */
export const Disabled: Story = {
  render: () => ({ template: `<ui-file-upload-disabled-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-file-upload [disabled]="true" label="Upload is disabled" />`,
        language: "html",
      },
    },
  },
};

/**
 * **Documents** — Restricts accepted files to specific extensions:
 * `.pdf`, `.doc`, `.docx`, and `.txt`. Other file types are rejected.
 */
export const Documents: Story = {
  render: () => ({ template: `<ui-file-upload-documents-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-file-upload
  accept=".pdf,.doc,.docx,.txt"
  [multiple]="true"
  label="Drop documents here (.pdf, .doc, .txt)"
  [(files)]="files"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * _API Reference_ — features, inputs, model, outputs, and CSS tokens.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Drag & drop** — visually highlights when files are dragged over the zone",
          "- **Click to browse** — a native file picker opens on click",
          "- **Accept filter** — restrict by MIME type (`image/*`) or extension (`.pdf,.docx`)",
          "- **Size limit** — reject files exceeding `maxFileSize` bytes",
          "- **Multi-file** — toggle `[multiple]` for batch uploads",
          "- **Events** — `fileAdded`, `fileRemoved`, `fileRejected` outputs for logging and feedback",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          '| `accept` | `string` | `"*"` | Accepted file types (MIME or extensions) |',
          "| `multiple` | `boolean` | `false` | Allow selecting multiple files |",
          "| `maxFileSize` | `number` | — | Maximum file size in bytes |",
          "| `disabled` | `boolean` | `false` | Disables the drop zone |",
          '| `label` | `string` | `"Drop files here…"` | Instruction text shown in the zone |',
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `files` | `readonly UIFileEntry[]` | Two-way bound array of selected files |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `fileAdded` | `UIFileEntry` | Emitted when a file is accepted |",
          "| `fileRemoved` | `UIFileEntry` | Emitted when a file is removed from the list |",
          "| `fileRejected` | `{ file: File; reason: string }` | Emitted when a file is rejected (wrong type or too large) |",
          "",
          "**CSS custom properties** — inherited from `--ui-*` theme tokens:",
          "`--ui-border`, `--ui-accent`, `--ui-bg`, `--ui-surface`, `--ui-text`, `--ui-text-muted`",
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};
