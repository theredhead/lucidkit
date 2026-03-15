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
  parameters: {
    docs: {
      description: {
        component:
          "File upload component with a drag-and-drop zone and click-to-browse " +
          "button. Supports file type filtering (`accept`), size limits " +
          "(`maxFileSize`), single or multi-file selection, and a two-way " +
          "`files` model signal.\n\n" +
          "**CSS custom properties** — inherited from `--ui-*` theme tokens:\n" +
          "- `--ui-border` — drop zone border\n" +
          "- `--ui-accent` — hover / drag highlight\n" +
          "- `--ui-bg` — drop zone background\n" +
          "- `--ui-surface` — file list item background\n" +
          "- `--ui-text` / `--ui-text-muted` — text colours",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
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

/** Default single-file upload with event logging. */
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

/** Multi-file image-only upload with rejection logging. */
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

/** Multi-file upload with a 1 MB size limit per file. */
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

/** Disabled state — interactions are blocked. */
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

/** Accept only document file extensions. */
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
