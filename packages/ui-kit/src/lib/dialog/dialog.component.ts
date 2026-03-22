import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";

/**
 * A declarative dialog component built on the native `<dialog>` element.
 *
 * Provides header / body / footer content slots. Open and close it
 * via the `open` two-way binding or by calling `show()` / `close()`.
 *
 * For programmatic service-based modals see {@link ModalService}.
 *
 * @example
 * ```html
 * <ui-dialog [(open)]="showDialog" ariaLabel="Confirm action">
 *   <ui-dialog-header>Confirm</ui-dialog-header>
 *   <ui-dialog-body>
 *     <p>Are you sure you want to proceed?</p>
 *   </ui-dialog-body>
 *   <ui-dialog-footer>
 *     <ui-button variant="outlined" (click)="showDialog = false">Cancel</ui-button>
 *     <ui-button (click)="confirm()">OK</ui-button>
 *   </ui-dialog-footer>
 * </ui-dialog>
 * ```
 */
@Component({
  selector: "ui-dialog",
  standalone: true,
  templateUrl: "./dialog.component.html",
  styleUrl: "./dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-dialog",
  },
})
export class UIDialog {
  /** Whether the dialog is open. Supports two-way binding. */
  public readonly open = model(false);

  /** Whether clicking the backdrop closes the dialog. */
  public readonly closeOnBackdropClick = input(true);

  /** Whether pressing Escape closes the dialog. */
  public readonly closeOnEscape = input(true);

  /** Accessible label for the dialog. */
  public readonly ariaLabel = input<string>("Dialog");

  /** Emitted when the dialog is closed. */
  public readonly closed = output<void>();

  /** @internal */
  protected readonly dialogEl =
    viewChild<ElementRef<HTMLDialogElement>>("dialogRef");

  public constructor() {
    effect(() => {
      const isOpen = this.open();
      const el = this.dialogEl()?.nativeElement;
      if (!el) return;
      if (isOpen && !el.open) {
        el.showModal();
      } else if (!isOpen && el.open) {
        el.close();
      }
    });
  }

  /** Show the dialog. */
  public show(): void {
    this.open.set(true);
  }

  /** Close the dialog. */
  public close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  /** @internal — native close event (Escape key). */
  protected onNativeClose(): void {
    if (this.open()) {
      this.open.set(false);
      this.closed.emit();
    }
  }

  /** @internal — prevent Escape when configured. */
  protected onCancel(event: Event): void {
    if (!this.closeOnEscape()) {
      event.preventDefault();
    }
  }

  /** @internal — backdrop click detection. */
  protected onDialogClick(event: MouseEvent): void {
    const el = this.dialogEl()?.nativeElement;
    if (this.closeOnBackdropClick() && event.target === el) {
      this.close();
    }
  }
}
