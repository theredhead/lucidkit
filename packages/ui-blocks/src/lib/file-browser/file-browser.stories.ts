import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIFileBrowser } from "./file-browser.component";
import type {
  FileBrowserDatasource,
  FileBrowserEntry,
  FileActivateEvent,
  DirectoryChangeEvent,
  MetadataField,
} from "./file-browser.types";

// ── Sample data ──────────────────────────────────────────────────────

interface FileMeta {
  size?: string;
  modified?: string;
  type?: string;
}

function mkDir(
  id: string,
  name: string,
  icon?: string,
): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: true, icon };
}

function mkFile(
  id: string,
  name: string,
  meta?: FileMeta,
  icon?: string,
): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: false, meta, icon };
}

const FS: Record<string, FileBrowserEntry<FileMeta>[]> = {
  root: [
    mkDir("src", "src"),
    mkDir("docs", "docs"),
    mkDir("tests", "tests"),
    mkFile("readme", "README.md", {
      size: "4.2 KB",
      modified: "2025-12-01",
      type: "Markdown",
    }),
    mkFile("pkg", "package.json", {
      size: "1.8 KB",
      modified: "2025-12-15",
      type: "JSON",
    }),
    mkFile("tsconfig", "tsconfig.json", {
      size: "0.6 KB",
      modified: "2025-11-20",
      type: "JSON",
    }),
    mkFile("license", "LICENSE", {
      size: "1.1 KB",
      modified: "2025-01-01",
      type: "Text",
    }),
  ],
  src: [
    mkDir("src-lib", "lib"),
    mkDir("src-assets", "assets"),
    mkFile("src-main", "main.ts", {
      size: "0.3 KB",
      modified: "2025-12-10",
      type: "TypeScript",
    }),
    mkFile("src-index", "index.html", {
      size: "0.5 KB",
      modified: "2025-12-10",
      type: "HTML",
    }),
    mkFile("src-styles", "styles.scss", {
      size: "1.2 KB",
      modified: "2025-12-10",
      type: "SCSS",
    }),
  ],
  "src-lib": [
    mkDir("src-lib-components", "components"),
    mkDir("src-lib-services", "services"),
    mkFile("src-lib-index", "index.ts", { size: "0.2 KB", type: "TypeScript" }),
  ],
  "src-lib-components": [
    mkFile("comp-button", "button.component.ts", {
      size: "2.1 KB",
      type: "TypeScript",
    }),
    mkFile("comp-input", "input.component.ts", {
      size: "1.8 KB",
      type: "TypeScript",
    }),
    mkFile("comp-dialog", "dialog.component.ts", {
      size: "3.0 KB",
      type: "TypeScript",
    }),
  ],
  "src-lib-services": [
    mkFile("svc-auth", "auth.service.ts", {
      size: "4.5 KB",
      type: "TypeScript",
    }),
    mkFile("svc-api", "api.service.ts", { size: "2.8 KB", type: "TypeScript" }),
  ],
  "src-assets": [
    mkFile("asset-logo", "logo.svg", { size: "3.2 KB", type: "SVG" }),
    mkFile("asset-favicon", "favicon.ico", { size: "4.2 KB", type: "Icon" }),
  ],
  docs: [
    mkFile("docs-guide", "getting-started.md", {
      size: "8.3 KB",
      type: "Markdown",
    }),
    mkFile("docs-api", "api-reference.md", {
      size: "12.1 KB",
      type: "Markdown",
    }),
    mkFile("docs-changelog", "CHANGELOG.md", {
      size: "6.7 KB",
      type: "Markdown",
    }),
  ],
  tests: [
    mkFile("test-unit", "unit.spec.ts", { size: "3.4 KB", type: "TypeScript" }),
    mkFile("test-e2e", "e2e.spec.ts", { size: "5.1 KB", type: "TypeScript" }),
  ],
};

class SampleDatasource implements FileBrowserDatasource<FileMeta> {
  public getChildren(
    parent: FileBrowserEntry<FileMeta> | null,
  ): FileBrowserEntry<FileMeta>[] {
    return FS[parent?.id ?? "root"] ?? [];
  }

  public isDirectory(entry: FileBrowserEntry<FileMeta>): boolean {
    return entry.isDirectory;
  }
}

// ── Demo components ──────────────────────────────────────────────────

const outputStyles = `
  :host { display: block; }
  .story-wrapper {
    height: 420px;
    display: flex;
    flex-direction: column;
  }
  .story-output {
    margin-top: 0.75rem; font-size: 0.78rem; padding: 0.75rem;
    background: var(--ui-surface-2, #fbfbfc);
    color: var(--ui-text, #1d232b);
    border: 1px solid var(--ui-border, #d7dce2);
    border-radius: 4px;
    font-family: var(--ui-font, monospace);
  }
`;

@Component({
  selector: "ui-file-browser-default-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <div class="story-wrapper">
      <ui-file-browser
        [datasource]="ds"
        (fileActivated)="onFileActivated($event)"
        (directoryChange)="onDirChange($event)"
      />
    </div>
    @if (lastEvent()) {
      <div class="story-output">{{ lastEvent() }}</div>
    }
  `,
})
class DefaultDemo {
  protected readonly ds = new SampleDatasource();
  protected readonly lastEvent = signal<string>("");

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }

  protected onDirChange(event: DirectoryChangeEvent<FileMeta>): void {
    const path = event.path.map((e) => e.name).join("/");
    this.lastEvent.set(`Navigated to: /${path || "(root)"}`);
  }
}

@Component({
  selector: "ui-file-browser-no-sidebar-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <div class="story-wrapper">
      <ui-file-browser
        [datasource]="ds"
        [showSidebar]="false"
        rootLabel="Home"
        (fileActivated)="onFileActivated($event)"
      />
    </div>
    @if (lastEvent()) {
      <div class="story-output">{{ lastEvent() }}</div>
    }
  `,
})
class NoSidebarDemo {
  protected readonly ds = new SampleDatasource();
  protected readonly lastEvent = signal<string>("");

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }
}

@Component({
  selector: "ui-file-browser-custom-template-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    outputStyles,
    `
      .custom-entry {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        font-size: 13px;
      }
      .custom-name {
        flex: 1;
        font-weight: 500;
      }
      .custom-meta {
        color: var(--ui-text-muted, #8b919a);
        font-size: 12px;
        font-weight: 400;
      }
    `,
  ],
  template: `
    <div class="story-wrapper">
      <ui-file-browser
        [datasource]="ds"
        (fileActivated)="onFileActivated($event)"
      >
        <ng-template #entryTemplate let-entry>
          <div class="custom-entry">
            <span class="custom-name">{{ entry.name }}</span>
            @if (entry.meta?.size) {
              <span class="custom-meta">{{ entry.meta.size }}</span>
            }
            @if (entry.meta?.type) {
              <span class="custom-meta">{{ entry.meta.type }}</span>
            }
          </div>
        </ng-template>
      </ui-file-browser>
    </div>
    @if (lastEvent()) {
      <div class="story-output">{{ lastEvent() }}</div>
    }
  `,
})
class CustomTemplateDemo {
  protected readonly ds = new SampleDatasource();
  protected readonly lastEvent = signal<string>("");

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(
      `Opened: ${event.entry.name} (${event.entry.meta?.type})`,
    );
  }
}

// ── Metadata provider ────────────────────────────────────────────────

function metadataProvider(entry: FileBrowserEntry<FileMeta>): MetadataField[] {
  const fields: MetadataField[] = [];
  if (entry.meta?.size) fields.push({ label: "Size", value: entry.meta.size });
  if (entry.meta?.type) fields.push({ label: "Type", value: entry.meta.type });
  if (entry.meta?.modified)
    fields.push({ label: "Modified", value: entry.meta.modified });
  return fields;
}

// ── Icon view demo ──────────────────────────────────────────────────

@Component({
  selector: "ui-file-browser-icon-view-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <div class="story-wrapper">
      <ui-file-browser
        [datasource]="ds"
        viewMode="icons"
        [showDetails]="true"
        [metadataProvider]="metadataProvider"
        (fileActivated)="onFileActivated($event)"
      />
    </div>
    @if (lastEvent()) {
      <div class="story-output">{{ lastEvent() }}</div>
    }
  `,
})
class IconViewDemo {
  protected readonly ds = new SampleDatasource();
  protected readonly lastEvent = signal<string>("");
  protected readonly metadataProvider = metadataProvider;

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }
}

// ── Detail view demo ────────────────────────────────────────────────

@Component({
  selector: "ui-file-browser-detail-view-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <div class="story-wrapper">
      <ui-file-browser
        [datasource]="ds"
        viewMode="detail"
        [showDetails]="true"
        [metadataProvider]="metadataProvider"
        (fileActivated)="onFileActivated($event)"
      />
    </div>
    @if (lastEvent()) {
      <div class="story-output">{{ lastEvent() }}</div>
    }
  `,
})
class DetailViewDemo {
  protected readonly ds = new SampleDatasource();
  protected readonly lastEvent = signal<string>("");
  protected readonly metadataProvider = metadataProvider;

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }
}

// ── Column view demo ────────────────────────────────────────────────

@Component({
  selector: "ui-file-browser-column-view-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <div class="story-wrapper">
      <ui-file-browser
        [datasource]="ds"
        viewMode="column"
        [showDetails]="true"
        [metadataProvider]="metadataProvider"
        (fileActivated)="onFileActivated($event)"
      />
    </div>
    @if (lastEvent()) {
      <div class="story-output">{{ lastEvent() }}</div>
    }
  `,
})
class ColumnViewDemo {
  protected readonly ds = new SampleDatasource();
  protected readonly lastEvent = signal<string>("");
  protected readonly metadataProvider = metadataProvider;

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }
}

// ── Details pane demo ───────────────────────────────────────────────

@Component({
  selector: "ui-file-browser-details-pane-demo",
  standalone: true,
  imports: [UIFileBrowser],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [outputStyles],
  template: `
    <div class="story-wrapper">
      <ui-file-browser
        [datasource]="ds"
        [showDetails]="true"
        [metadataProvider]="metadataProvider"
        (fileActivated)="onFileActivated($event)"
      />
    </div>
    @if (lastEvent()) {
      <div class="story-output">{{ lastEvent() }}</div>
    }
  `,
})
class DetailsPaneDemo {
  protected readonly ds = new SampleDatasource();
  protected readonly lastEvent = signal<string>("");
  protected readonly metadataProvider = metadataProvider;

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }
}

// ── Storybook meta & stories ─────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Blocks/File Browser",
  tags: ["autodocs"],
  argTypes: {
    showSidebar: {
      control: "boolean",
      description: "Show the tree sidebar.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the file browser.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          "`UIFileBrowser` is a two-panel file explorer composing `UITreeView`, `UIBreadcrumb`, and a contents list.",
          "",
          "## Features",
          "",
          "- **Tree sidebar** \u2014 shows the folder hierarchy with expand/collapse.",
          "- **Contents panel** \u2014 displays files and sub-folders in the selected directory.",
          "- **Breadcrumb bar** \u2014 shows the current path with click-to-navigate.",
          "- **Datasource-driven** \u2014 implement `FileBrowserDatasource` to connect any storage backend.",
          "- **Custom templates** \u2014 project an `#entryTemplate` to customise how entries are rendered.",
          "- **File activation** \u2014 double-click or Enter on a file emits `fileActivated`.",
          "- **Accessible** \u2014 full keyboard navigation, ARIA roles.",
          "",
          "## CSS Custom Properties",
          "",
          "`--fb-bg`, `--fb-text`, `--fb-border`, `--fb-sidebar-bg`, `--fb-sidebar-width`, `--fb-entry-selected`",
        ].join("\n"),
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        DefaultDemo,
        NoSidebarDemo,
        CustomTemplateDemo,
        IconViewDemo,
        DetailViewDemo,
        ColumnViewDemo,
        DetailsPaneDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/**
 * **Default** — Two-panel file browser with tree sidebar, breadcrumb,
 * and contents list. Double-click folders to navigate.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-file-browser-default-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-file-browser
  [datasource]="ds"
  (fileActivated)="onOpen($event)"
  (directoryChange)="onNavigate($event)"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIFileBrowser,
  type FileBrowserDatasource,
  type FileBrowserEntry,
  type FileActivateEvent,
} from '@theredhead/ui-blocks';

class MyDatasource implements FileBrowserDatasource {
  getChildren(parent: FileBrowserEntry | null): FileBrowserEntry[] {
    // Return files/directories for the given parent
    return parent ? this.childrenOf(parent) : this.rootEntries();
  }
  isDirectory(entry: FileBrowserEntry): boolean {
    return entry.isDirectory;
  }
}

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [UIFileBrowser],
  template: \\\`
    <ui-file-browser [datasource]="ds" (fileActivated)="onOpen($event)" />
  \\\`,
  styles: [':host { display: block; height: 500px; }'],
})
export class FilesComponent {
  readonly ds = new MyDatasource();
  onOpen(event: FileActivateEvent): void {
    console.log('Opened:', event.entry.name);
  }
}

// ── SCSS ──
/* Override sidebar width or colours via CSS custom properties: */
ui-file-browser { --fb-sidebar-width: 280px; }
`,
      },
    },
  },
};

/**
 * **No Sidebar** — Contents-only view with breadcrumb navigation.
 * Set `showSidebar="false"` to hide the tree panel.
 */
export const NoSidebar: Story = {
  render: () => ({
    template: `<ui-file-browser-no-sidebar-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-file-browser
  [datasource]="ds"
  [showSidebar]="false"
  rootLabel="Home"
/>
`,
      },
    },
  },
};

/**
 * **Custom Entry Template** — Project an `#entryTemplate` to render
 * entries with metadata columns (size, type).
 */
export const CustomTemplate: Story = {
  render: () => ({
    template: `<ui-file-browser-custom-template-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-file-browser [datasource]="ds">
  <ng-template #entryTemplate let-entry>
    <span>{{ entry.name }}</span>
    <span class="meta">{{ entry.meta?.size }}</span>
    <span class="meta">{{ entry.meta?.type }}</span>
  </ng-template>
</ui-file-browser>
`,
      },
    },
  },
};

/**
 * **Icon View** — Displays entries as a grid of large icons.
 * Set `viewMode="icons"` and optionally enable `showDetails` for a
 * metadata sidebar.
 */
export const IconView: Story = {
  render: () => ({
    template: `<ui-file-browser-icon-view-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-file-browser
  [datasource]="ds"
  viewMode="icons"
  [showDetails]="true"
  [metadataProvider]="metadataProvider"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIFileBrowser,
  type FileBrowserEntry,
  type MetadataField,
} from '@theredhead/ui-blocks';

@Component({
  selector: 'app-icon-view',
  standalone: true,
  imports: [UIFileBrowser],
  template: \\\`
    <ui-file-browser
      [datasource]="ds"
      viewMode="icons"
      [showDetails]="true"
      [metadataProvider]="metadataProvider"
    />
  \\\`,
  styles: [':host { display: block; height: 500px; }'],
})
export class IconViewComponent {
  readonly ds = new MyDatasource();
  metadataProvider(entry: FileBrowserEntry): MetadataField[] {
    return [{ label: 'Size', value: entry.meta?.size }];
  }
}

// ── SCSS ──
/* No custom styles needed — uses built-in icon grid layout. */
`,
      },
    },
  },
};

/**
 * **Detail View** — Table-like layout showing Name, Size, Type, and
 * Modified columns. Best for file listings where metadata matters.
 */
export const DetailView: Story = {
  render: () => ({
    template: `<ui-file-browser-detail-view-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-file-browser
  [datasource]="ds"
  viewMode="detail"
  [showDetails]="true"
  [metadataProvider]="metadataProvider"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIFileBrowser } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [UIFileBrowser],
  template: \\\`
    <ui-file-browser [datasource]="ds" viewMode="detail" />
  \\\`,
  styles: [':host { display: block; height: 500px; }'],
})
export class DetailViewComponent {
  readonly ds = new MyDatasource();
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Column View** — NeXTSTEP / macOS Finder-style multi-column browser.
 * Each directory click appends a new column to the right.
 */
export const ColumnView: Story = {
  render: () => ({
    template: `<ui-file-browser-column-view-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-file-browser
  [datasource]="ds"
  viewMode="column"
  [showDetails]="true"
  [metadataProvider]="metadataProvider"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIFileBrowser } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-column-view',
  standalone: true,
  imports: [UIFileBrowser],
  template: \\\`
    <ui-file-browser [datasource]="ds" viewMode="column" />
  \\\`,
  styles: [':host { display: block; height: 500px; }'],
})
export class ColumnViewComponent {
  readonly ds = new MyDatasource();
}

// ── SCSS ──
/* Adjust column width: */
ui-file-browser { --fb-column-width: 260px; }
`,
      },
    },
  },
};

/**
 * **Details Pane** — Enable `[showDetails]="true"` with a metadata provider
 * to show a sidebar with file/folder properties when an entry is selected.
 */
export const DetailsPane: Story = {
  render: () => ({
    template: `<ui-file-browser-details-pane-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-file-browser
  [datasource]="ds"
  [showDetails]="true"
  [metadataProvider]="metadataProvider"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIFileBrowser,
  type FileBrowserEntry,
  type MetadataField,
} from '@theredhead/ui-blocks';

@Component({
  selector: 'app-details-pane',
  standalone: true,
  imports: [UIFileBrowser],
  template: \\\`
    <ui-file-browser
      [datasource]="ds"
      [showDetails]="true"
      [metadataProvider]="metadataProvider"
    />
  \\\`,
  styles: [':host { display: block; height: 500px; }'],
})
export class DetailsPaneComponent {
  readonly ds = new MyDatasource();
  metadataProvider(entry: FileBrowserEntry): MetadataField[] {
    return [
      { label: 'Size', value: entry.meta?.size ?? 'N/A' },
      { label: 'Type', value: entry.meta?.type ?? 'Unknown' },
    ];
  }
}

// ── SCSS ──
/* Adjust details width: */
ui-file-browser { --fb-details-width: 260px; }
`,
      },
    },
  },
};
