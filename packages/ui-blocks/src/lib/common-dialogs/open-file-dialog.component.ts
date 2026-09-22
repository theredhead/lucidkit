import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";

import {
  UIButton,
  UIDialogHeader,
  UIDialogBody,
  UIDialogFooter,
  ModalRef,
} from "@theredhead/lucid-kit";

import { UIFileBrowser } from "../file-browser/file-browser.component";
import type {
  FileBrowserDatasource,
  FileBrowserEntry,
  FileActivateEvent,
} from "../file-browser/file-browser.types";
import type { OpenFileResult } from "./common-dialog.types";
import { UISurface } from '@theredhead/lucid-foundation';

/**
 * Content component for an open-file dialog.
 *
 * Displayed by {@link CommonDialogService.openFile}. Embeds a
 * {@link UIFileBrowser} and resolves to the selected file(s) or
 * `null` if cancelled.
 *
 * @internal — not intended for direct use; use the service instead.
 */
@Component({
  selector: "ui-open-file-dialog",
  standalone: true,
  imports: [
    UIButton,
    UIDialogHeader,
    UIDialogBody,
    UIDialogFooter,
    UIFileBrowser,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-open-file-dialog" },
  template: `
    <ui-dialog-header>{{ title() }}</ui-dialog-header>
    <ui-dialog-body>
      <p class="cd-instruction">Select a file to open.</p>
      <div class="cd-browser-frame">
        <ui-file-browser
          [datasource]="datasource()"
          [(selectedEntry)]="selectedFile"
          (fileActivated)="onFileActivated($event)"
          ariaLabel="Browse files"
        />
      </div>
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button variant="outlined" ariaLabel="Cancel file selection" (click)="cancel()">
        Cancel file selection
      </ui-button>
      <ui-button
        variant="filled"
        [ariaLabel]="openLabel()"
        [disabled]="!selectedFile() || selectedFile()!.isDirectory"
        (click)="open()"
      >
        {{ openLabel() }}
      </ui-button>
    </ui-dialog-footer>
  `,
  styles: [
    `
      :host {
        --cd-surface: var(--ui-surface, #f7f8fa);
        --cd-surface-raised: var(--ui-surface-2, #eef2f6);
        --cd-border: var(--ui-border, #d7dce2);
        --cd-text: var(--ui-text, #1d232b);
        --cd-muted: var(--ui-text-muted, #5c6875);

        display: flex;
        flex-direction: column;
        min-width: 36rem;
        color: var(--cd-text);
        background: var(--cd-surface);
      }
      :host ::ng-deep ui-dialog-body {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        height: 24rem;
        overflow: hidden;
      }
      .cd-instruction {
        margin: 0;
        color: var(--cd-muted);
        background: var(--cd-surface);
        font-size: 0.8125rem;
      }
      .cd-browser-frame {
        flex: 1;
        min-height: 0;
        overflow: hidden;
        border: 1px solid var(--cd-border);
        border-radius: var(--ui-radius, 0.375rem);
        color: var(--cd-text);
        background: var(--cd-surface-raised);
      }
      :host ::ng-deep ui-dialog-body ui-file-browser {
        height: 100%;
      }
    `,
  ],
})
export class UIOpenFileDialog<M = unknown> {
  public readonly title = input("Open File");
  public readonly openLabel = input("Open selected file");
  public readonly datasource = input.required<FileBrowserDatasource<M>>();

  protected readonly selectedFile = signal<FileBrowserEntry<M> | null>(null);

  private readonly modalRef = inject(ModalRef<OpenFileResult<M> | null>);

  protected onFileActivated(_event: FileActivateEvent<M>): void {
    const entry = this.selectedFile();
    if (entry && !entry.isDirectory) {
      this.modalRef.close({ files: [entry] });
    }
  }

  public open(): void {
    const entry = this.selectedFile();
    if (entry && !entry.isDirectory) {
      this.modalRef.close({ files: [entry] });
    }
  }

  public cancel(): void {
    this.modalRef.close(null);
  }
}
