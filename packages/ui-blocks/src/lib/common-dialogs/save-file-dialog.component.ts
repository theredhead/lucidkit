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
      <ui-file-browser
        [datasource]="datasource()"
        (directoryChange)="onDirectoryChange($event)"
        ariaLabel="Browse directories"
      />
      <div class="cd-filename-row">
        <span class="cd-filename-label">File name:</span>
        <ui-input
          [(value)]="fileName"
          placeholder="Enter file name"
          ariaLabel="File name"
        />
      </div>
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button variant="outlined" ariaLabel="Cancel" (click)="cancel()">
        Cancel
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
        display: flex;
        flex-direction: column;
        min-width: 36rem;
      }
      :host ::ng-deep ui-dialog-body {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        height: 26rem;
        overflow: hidden;
      }
      :host ::ng-deep ui-dialog-body ui-file-browser {
        flex: 1;
        min-height: 0;
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
      }
      .cd-filename-row ui-input {
        flex: 1;
      }
    `,
  ],
})
export class UISaveFileDialog<M = unknown> implements OnInit {
  public readonly title = input("Save File");
  public readonly saveLabel = input("Save");
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
