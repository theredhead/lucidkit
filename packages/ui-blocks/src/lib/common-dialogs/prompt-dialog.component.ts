import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal, OnInit,
} from "@angular/core";

import {
  UIButton,
  UIInput,
  UIDialogHeader,
  UIDialogBody,
  UIDialogFooter,
  ModalRef,
} from "@theredhead/ui-kit";

/**
 * Content component for a prompt dialog.
 *
 * Displayed by {@link CommonDialogService.prompt}. Shows a title,
 * message, a text input, and OK / Cancel buttons. Resolves to the
 * entered string or `null` if cancelled.
 *
 * @internal — not intended for direct use; use the service instead.
 */
@Component({
  selector: "ui-prompt-dialog",
  standalone: true,
  imports: [UIButton, UIInput, UIDialogHeader, UIDialogBody, UIDialogFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-prompt-dialog" },
  template: `
    <ui-dialog-header>{{ title() }}</ui-dialog-header>
    <ui-dialog-body>
      <p class="cd-message">{{ message() }}</p>
      <ui-input
        [(value)]="inputValue"
        [placeholder]="placeholder()"
        ariaLabel="Prompt input"
      />
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button
        variant="outlined"
        [ariaLabel]="cancelLabel()"
        (click)="cancel()"
      >
        {{ cancelLabel() }}
      </ui-button>
      <ui-button variant="filled" [ariaLabel]="okLabel()" (click)="ok()">
        {{ okLabel() }}
      </ui-button>
    </ui-dialog-footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-width: 24rem;
      }
      .cd-message {
        margin: 0 0 0.75rem;
        line-height: 1.55;
        white-space: pre-wrap;
      }
    `,
  ],
})
export class UIPromptDialog implements OnInit {
  public readonly title = input("Prompt");
  public readonly message = input("");
  public readonly defaultValue = input("");
  public readonly placeholder = input("");
  public readonly okLabel = input("OK");
  public readonly cancelLabel = input("Cancel");

  protected readonly inputValue = signal("");

  private readonly modalRef = inject(ModalRef<string | null>);

  public ngOnInit(): void {
    this.inputValue.set(this.defaultValue());
  }

  public ok(): void {
    this.modalRef.close(this.inputValue());
  }

  public cancel(): void {
    this.modalRef.close(null);
  }
}
