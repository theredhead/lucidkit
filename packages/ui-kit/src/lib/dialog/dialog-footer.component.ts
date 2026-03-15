import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * Footer section for a dialog, typically containing action buttons.
 *
 * Use inside `<ui-dialog>` or a {@link ModalService} content component
 * to render a right-aligned footer with consistent button spacing.
 *
 * @example
 * ```html
 * <ui-dialog-footer>
 *   <ui-button variant="outlined" (click)="cancel()">Cancel</ui-button>
 *   <ui-button (click)="confirm()">OK</ui-button>
 * </ui-dialog-footer>
 * ```
 */
@Component({
  selector: "ui-dialog-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-dialog-footer" },
  template: "<ng-content />",
  styles: [
    `
      :host {
        display: flex;
        padding: 0.75rem 1.25rem 1rem;
        border-top: 1px solid var(--ui-border, #d7dce2);
        justify-content: flex-end;
        gap: 2rem;
      }
    `,
  ],
})
export class UIDialogFooter {}
