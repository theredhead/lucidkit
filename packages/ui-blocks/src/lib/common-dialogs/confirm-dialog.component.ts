import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";

import {
  UIButton,
  UIDialogHeader,
  UIDialogBody,
  UIDialogFooter,
  ModalRef,
} from "@theredhead/ui-kit";

import type { ConfirmVariant } from "./common-dialog.types";

/**
 * Content component for a confirm dialog.
 *
 * Displayed by {@link CommonDialogService.confirm}. Shows a title,
 * message, and confirm / cancel buttons. Resolves to `true` (confirm)
 * or `false` (cancel / dismiss).
 *
 * @internal — not intended for direct use; use the service instead.
 */
@Component({
  selector: "ui-confirm-dialog",
  standalone: true,
  imports: [UIButton, UIDialogHeader, UIDialogBody, UIDialogFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-confirm-dialog",
    "[class.ui-confirm-dialog--danger]": "variant() === 'danger'",
    "[class.ui-confirm-dialog--warning]": "variant() === 'warning'",
  },
  template: `
    <ui-dialog-header>{{ title() }}</ui-dialog-header>
    <ui-dialog-body>
      <p class="cd-message">{{ message() }}</p>
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button
        variant="outlined"
        [ariaLabel]="cancelLabel()"
        (click)="cancel()"
      >
        {{ cancelLabel() }}
      </ui-button>
      <ui-button
        variant="filled"
        [ariaLabel]="confirmLabel()"
        (click)="confirm()"
      >
        {{ confirmLabel() }}
      </ui-button>
    </ui-dialog-footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-width: 20rem;
      }
      .cd-message {
        margin: 0;
        line-height: 1.55;
        white-space: pre-wrap;
      }
      :host(.ui-confirm-dialog--danger)
        ::ng-deep
        ui-dialog-footer
        ui-button[variant="filled"] {
        --ui-accent: #d93025;
      }
      :host(.ui-confirm-dialog--warning)
        ::ng-deep
        ui-dialog-footer
        ui-button[variant="filled"] {
        --ui-accent: #e5a50a;
      }
    `,
  ],
})
export class UIConfirmDialog {
  public readonly title = input("Confirm");
  public readonly message = input("");
  public readonly confirmLabel = input("OK");
  public readonly cancelLabel = input("Cancel");
  public readonly variant = input<ConfirmVariant>("primary");

  private readonly modalRef = inject(ModalRef<boolean>);

  public confirm(): void {
    this.modalRef.close(true);
  }

  public cancel(): void {
    this.modalRef.close(false);
  }
}
