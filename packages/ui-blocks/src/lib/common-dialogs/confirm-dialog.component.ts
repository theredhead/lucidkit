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
import { UISurface } from '@theredhead/foundation';

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
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-confirm-dialog",
    "[class.danger]": "variant() === 'danger'",
    "[class.warning]": "variant() === 'warning'",
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
      :host(.danger) {
        --ui-accent: #d93025;
      }
      :host(.warning) {
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
