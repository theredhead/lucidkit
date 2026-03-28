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
} from "@theredhead/ui-kit";

import { UIFileBrowser } from "../file-browser/file-browser.component";
import type {
  FileBrowserDatasource,
  FileBrowserEntry,
  FileActivateEvent,
} from "../file-browser/file-browser.types";
import type { OpenFileResult } from "./common-dialog.types";
import { UISurface } from '@theredhead/foundation';

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
      <ui-file-browser
        [datasource]="datasource()"
        [(selectedEntry)]="selectedFile"
        (fileActivated)="onFileActivated($event)"
        ariaLabel="Browse files"
      />
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button variant="outlined" ariaLabel="Cancel" (click)="cancel()">
        Cancel
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
        display: flex;
        flex-direction: column;
        min-width: 36rem;
      }
      :host ::ng-deep ui-dialog-body {
        height: 24rem;
        overflow: hidden;
      }
      :host ::ng-deep ui-dialog-body ui-file-browser {
        height: 100%;
      }
    `,
  ],
})
export class UIOpenFileDialog<M = unknown> {
  public readonly title = input("Open File");
  public readonly openLabel = input("Open");
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
