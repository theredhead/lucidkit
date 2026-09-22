import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  OnInit,
} from "@angular/core";

import {
  UIButton,
  UIInput,
  UIDialogHeader,
  UIDialogBody,
  UIDialogFooter,
  ModalRef,
} from "@theredhead/lucid-kit";

import { UIFileBrowser } from "../file-browser/file-browser.component";
import type {
  FileBrowserDatasource,
  FileBrowserEntry,
  DirectoryChangeEvent,
} from "../file-browser/file-browser.types";
import type { SaveFileResult } from "./common-dialog.types";
import { UISurface } from '@theredhead/lucid-foundation';

/**
 * Content component for a save-file dialog.
 *
 * Displayed by {@link CommonDialogService.saveFile}. Embeds a
 * {@link UIFileBrowser} for directory navigation plus a file-name
 * input. Resolves to a directory + file name, or `null` if cancelled.
 *
 * @internal — not intended for direct use; use the service instead.
 */
@Component({
  selector: "ui-save-file-dialog",
  standalone: true,
  imports: [
    UIButton,
    UIInput,
    UIDialogHeader,
    UIDialogBody,
    UIDialogFooter,
    UIFileBrowser,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-save-file-dialog" },
  template: `
    <ui-dialog-header>{{ title() }}</ui-dialog-header>
    <ui-dialog-body>
      <p class="cd-instruction">Choose a folder, then enter a name for the file.</p>
      <div class="cd-browser-frame">
        <ui-file-browser
          [datasource]="datasource()"
          (directoryChange)="onDirectoryChange($event)"
          ariaLabel="Browse directories"
        />
      </div>
      <div class="cd-filename-panel">
        <div class="cd-filename-row">
          <span class="cd-filename-label">File name</span>
          <ui-input
            [(value)]="fileName"
            placeholder="Enter file name"
            ariaLabel="File name"
          />
        </div>
      </div>
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button variant="outlined" ariaLabel="Cancel file save" (click)="cancel()">
        Cancel file save
      </ui-button>
      <ui-button
        variant="filled"
        [ariaLabel]="saveLabel()"
        [disabled]="!fileName().trim()"
        (click)="save()"
      >
        {{ saveLabel() }}
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
        height: 26rem;
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
      .cd-filename-panel {
        padding: 0.625rem 0.75rem;
        border: 1px solid var(--cd-border);
        border-radius: var(--ui-radius, 0.375rem);
        color: var(--cd-text);
        background: var(--cd-surface-raised);
      }
      .cd-filename-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .cd-filename-label {
        font-weight: 600;
        font-size: 0.88rem;
        white-space: nowrap;
        color: var(--cd-text);
        background: var(--cd-surface-raised);
      }
      .cd-filename-row ui-input {
        flex: 1;
      }
    `,
  ],
})
export class UISaveFileDialog<M = unknown> implements OnInit {
  public readonly title = input("Save File");
  public readonly saveLabel = input("Save file");
  public readonly defaultName = input("");
  public readonly datasource = input.required<FileBrowserDatasource<M>>();

  protected readonly fileName = signal("");
  protected readonly currentDir = signal<FileBrowserEntry<M> | null>(null);

  private readonly modalRef = inject(ModalRef<SaveFileResult<M> | null>);

  public ngOnInit(): void {
    this.fileName.set(this.defaultName());
  }

  protected onDirectoryChange(event: DirectoryChangeEvent<M>): void {
    this.currentDir.set(event.directory);
  }

  public save(): void {
    const name = this.fileName().trim();
    if (name) {
      this.modalRef.close({ directory: this.currentDir(), name });
    }
  }

  public cancel(): void {
    this.modalRef.close(null);
  }
}
