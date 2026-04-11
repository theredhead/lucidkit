import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIButton } from "@theredhead/lucid-kit";

import { CommonDialogService } from "./common-dialog.service";
import type {
  FileBrowserDatasource,
  FileBrowserEntry,
} from "../file-browser/file-browser.types";

// ── Sample file-browser datasource (minimal for open/save demos) ──

interface FileMeta {
  size?: string;
}

function mkDir(id: string, name: string): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: true };
}

function mkFile(
  id: string,
  name: string,
  meta?: FileMeta,
): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: false, meta };
}

const FS: Record<string, FileBrowserEntry<FileMeta>[]> = {
  root: [
    mkDir("docs", "Documents"),
    mkDir("images", "Images"),
    mkFile("readme", "README.md", { size: "4.2 KB" }),
    mkFile("notes", "notes.txt", { size: "1.1 KB" }),
  ],
  docs: [
    mkFile("report", "report.pdf", { size: "2.4 MB" }),
    mkFile("slides", "presentation.pptx", { size: "8.1 MB" }),
  ],
  images: [
    mkFile("logo", "logo.svg", { size: "3.2 KB" }),
    mkFile("photo", "photo.jpg", { size: "1.5 MB" }),
  ],
};

class DemoDatasource implements FileBrowserDatasource<FileMeta> {
  public getChildren(
    parent: FileBrowserEntry<FileMeta> | null,
  ): FileBrowserEntry<FileMeta>[] {
    return FS[parent?.id ?? "root"] ?? [];
  }

  public isDirectory(entry: FileBrowserEntry<FileMeta>): boolean {
    return entry.isDirectory;
  }
}

// ── Demo component ─────────────────────────────────────────────────

@Component({
  selector: "ui-demo-common-dialogs",
  standalone: true,
  imports: [UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-grid">
      <section>
        <h3>Alert</h3>
        <ui-button (click)="showAlert()" ariaLabel="Show alert">
          Show Alert
        </ui-button>
      </section>

      <section>
        <h3>Confirm</h3>
        <div class="demo-row">
          <ui-button
            (click)="showConfirm('primary')"
            ariaLabel="Confirm primary"
          >
            Confirm
          </ui-button>
          <ui-button (click)="showConfirm('danger')" ariaLabel="Confirm danger">
            Confirm (Danger)
          </ui-button>
          <ui-button
            (click)="showConfirm('warning')"
            ariaLabel="Confirm warning"
          >
            Confirm (Warning)
          </ui-button>
        </div>
      </section>

      <section>
        <h3>Prompt</h3>
        <ui-button (click)="showPrompt()" ariaLabel="Show prompt">
          Show Prompt
        </ui-button>
      </section>

      <section>
        <h3>Open File</h3>
        <ui-button (click)="showOpenFile()" ariaLabel="Open file">
          Open File...
        </ui-button>
      </section>

      <section>
        <h3>Save File</h3>
        <ui-button (click)="showSaveFile()" ariaLabel="Save file">
          Save File...
        </ui-button>
      </section>

      <section>
        <h3>About</h3>
        <ui-button (click)="showAbout()" ariaLabel="About">
          About...
        </ui-button>
      </section>

      @if (lastResult()) {
        <section class="demo-result">
          <h4>Last result</h4>
          <pre>{{ lastResult() }}</pre>
        </section>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 2rem;
      }
      .demo-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 32rem;
      }
      .demo-grid h3 {
        margin: 0 0 0.5rem;
        font-size: 0.92rem;
        font-weight: 600;
      }
      .demo-row {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .demo-result {
        border-top: 1px solid var(--ui-border, #d7dce2);
        padding-top: 1rem;
      }
      .demo-result h4 {
        margin: 0 0 0.5rem;
        font-size: 0.85rem;
        font-weight: 600;
        opacity: 0.65;
      }
      .demo-result pre {
        margin: 0;
        font-size: 0.82rem;
        white-space: pre-wrap;
        word-break: break-all;
      }
    `,
  ],
})
class UIDemoCommonDialogs {
  protected readonly lastResult = signal("");

  private readonly dialogs = inject(CommonDialogService);
  private readonly ds = new DemoDatasource();

  protected async showAlert(): Promise<void> {
    await this.dialogs.alert({
      title: "Update Available",
      message:
        "A new version of the application is available.\nPlease restart to apply the update.",
    });
    this.lastResult.set("Alert dismissed");
  }

  protected async showConfirm(
    variant: "primary" | "danger" | "warning",
  ): Promise<void> {
    const result = await this.dialogs.confirm({
      title:
        variant === "danger"
          ? "Delete Project?"
          : variant === "warning"
            ? "Unsaved Changes"
            : "Confirm Action",
      message:
        variant === "danger"
          ? "This will permanently delete the project and all its data.\nThis action cannot be undone."
          : variant === "warning"
            ? "You have unsaved changes. Do you want to discard them?"
            : "Are you sure you want to proceed?",
      variant,
      confirmLabel: variant === "danger" ? "Delete" : "OK",
    });
    this.lastResult.set(`Confirm (${variant}): ${result}`);
  }

  protected async showPrompt(): Promise<void> {
    const result = await this.dialogs.prompt({
      title: "Rename File",
      message: "Enter a new name for this file:",
      defaultValue: "document.txt",
      placeholder: "file name",
    });
    this.lastResult.set(`Prompt: ${JSON.stringify(result)}`);
  }

  protected async showOpenFile(): Promise<void> {
    const result = await this.dialogs.openFile({
      datasource: this.ds,
    });
    this.lastResult.set(`Open file: ${JSON.stringify(result)}`);
  }

  protected async showSaveFile(): Promise<void> {
    const result = await this.dialogs.saveFile({
      datasource: this.ds,
      defaultName: "untitled.txt",
    });
    this.lastResult.set(`Save file: ${JSON.stringify(result)}`);
  }

  protected async showAbout(): Promise<void> {
    await this.dialogs.about({
      appName: "ConnectHub",
      version: "3.2.1",
      description:
        "A unified communication and collaboration platform for modern teams.",
      copyright: "\u00a9 2026 Acme Corporation",
      credits: ["Angular Team", "Lucide Icons", "@theredhead UI Library"],
    });
    this.lastResult.set("About dismissed");
  }
}

// ── Storybook meta ─────────────────────────────────────────────────

const meta: Meta<UIDemoCommonDialogs> = {
  title: "@theredhead/UI Blocks/Common Dialogs",
  component: UIDemoCommonDialogs,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [UIDemoCommonDialogs],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          "`CommonDialogService` provides a set of standard application dialogs:",
          "",
          "- **Alert** — simple informational message with a dismiss button",
          "- **Confirm** — yes/no decision with primary, danger, and warning variants",
          "- **Prompt** — text input with OK/Cancel",
          "- **Open File** — file browser for selecting file(s)",
          "- **Save File** — file browser with a file-name input",
          "- **About** — application information with logo, version, credits",
          "",
          "All methods are `async` and return `Promise`-based results.",
          "The service uses `ModalService` from `@theredhead/lucid-kit` internally.",
        ].join("\n"),
      },
    },
  },
};
export default meta;

type Story = StoryObj<UIDemoCommonDialogs>;

/**
 * Interactive demo of all six common dialogs. Click each button to
 * open the corresponding dialog. The result is displayed below.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-demo-common-dialogs />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Alert -->
<ui-button (click)="showAlert()">Show Alert</ui-button>

<!-- Confirm (danger variant) -->
<ui-button (click)="showConfirm()">Delete...</ui-button>

<!-- Prompt -->
<ui-button (click)="showPrompt()">Rename...</ui-button>

<!-- Open File -->
<ui-button (click)="showOpenFile()">Open File...</ui-button>

<!-- Save File -->
<ui-button (click)="showSaveFile()">Save File...</ui-button>

<!-- About -->
<ui-button (click)="showAbout()">About...</ui-button>

// ── TypeScript ──
import { Component, inject } from '@angular/core';
import { UIButton } from '@theredhead/lucid-kit';
import {
  CommonDialogService,
  type FileBrowserDatasource,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIButton],
  template: \\\`
    <ui-button (click)="showAlert()">Alert</ui-button>
    <ui-button (click)="showConfirm()">Confirm</ui-button>
    <ui-button (click)="showPrompt()">Prompt</ui-button>
  \\\`,
})
export class ExampleComponent {
  private readonly dialogs = inject(CommonDialogService);

  async showAlert() {
    await this.dialogs.alert({
      title: 'Update Available',
      message: 'A new version is available.',
    });
  }

  async showConfirm() {
    const confirmed = await this.dialogs.confirm({
      title: 'Delete Project?',
      message: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
    });
    if (confirmed) { /* delete */ }
  }

  async showPrompt() {
    const name = await this.dialogs.prompt({
      title: 'Rename File',
      message: 'Enter a new name:',
      defaultValue: 'document.txt',
    });
    if (name !== null) { /* rename */ }
  }

  async showOpenFile() {
    const result = await this.dialogs.openFile({
      datasource: myDatasource,
    });
    if (result) { /* use result.files */ }
  }

  async showSaveFile() {
    const result = await this.dialogs.saveFile({
      datasource: myDatasource,
      defaultName: 'untitled.txt',
    });
    if (result) { /* use result.directory, result.name */ }
  }

  async showAbout() {
    await this.dialogs.about({
      appName: 'MyApp',
      version: '1.0.0',
      description: 'A great application.',
      copyright: '© 2026 Acme Corp',
      credits: ['Angular Team', 'Lucide Icons'],
    });
  }
}

// ── SCSS ──
/* No custom styles needed — CommonDialogService handles presentation. */
`,
      },
    },
  },
};
