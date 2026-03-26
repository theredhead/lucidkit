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

/**
 * Content component for a simple alert dialog.
 *
 * Displayed by {@link CommonDialogService.alert}. Shows a title,
 * message, and a single dismiss button.
 *
 * @internal — not intended for direct use; use the service instead.
 */
@Component({
  selector: "ui-alert-dialog",
  standalone: true,
  imports: [UIButton, UIDialogHeader, UIDialogBody, UIDialogFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-alert-dialog" },
  template: `
    <ui-dialog-header>{{ title() }}</ui-dialog-header>
    <ui-dialog-body>
      <p class="cd-message">{{ message() }}</p>
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button
        variant="filled"
        [ariaLabel]="buttonLabel()"
        (click)="dismiss()"
      >
        {{ buttonLabel() }}
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
    `,
  ],
})
export class UIAlertDialog {
  public readonly title = input("Alert");
  public readonly message = input("");
  public readonly buttonLabel = input("OK");

  private readonly modalRef = inject(ModalRef<void>);

  public dismiss(): void {
    this.modalRef.close(undefined);
  }
}
