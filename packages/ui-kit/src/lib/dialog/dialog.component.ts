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
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/lucid-foundation";

/**
 * A declarative dialog component built on the native `<dialog>` element.
 *
 * Provides header / body / footer content slots. Open and close it
 * via the `open` two-way binding or by calling `show()` / `close()`.
 *
 * ## When to use `UIDialog` vs {@link ModalService}
 *
 * | Scenario | Recommended |
 * |----------|-------------|
 * | Dialog content is known at compile time | `UIDialog` |
 * | Dialog is tied to a specific view or form | `UIDialog` |
 * | You want template-driven two-way binding (`[(open)]`) | `UIDialog` |
 * | Dialog content is determined at runtime | {@link ModalService} |
 * | You need to open a dialog from a service or guard | {@link ModalService} |
 * | You need a typed result (`ModalRef.closed`) | {@link ModalService} |
 * | You want to pass dynamic inputs/outputs programmatically | {@link ModalService} |
 *
 * **Rule of thumb:** reach for `UIDialog` when you own the template and
 * the dialog lives alongside its trigger. Reach for {@link ModalService}
 * when the dialog must be spawned dynamically or from non-component code.
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
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
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
