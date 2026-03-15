import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * Scrollable body section for a dialog.
 *
 * Use inside `<ui-dialog>` or a {@link ModalService} content component
 * to render the main content area with automatic overflow scrolling.
 *
 * @example
 * ```html
 * <ui-dialog-body>
 *   <p>Are you sure you want to proceed?</p>
 * </ui-dialog-body>
 * ```
 */
@Component({
  selector: "ui-dialog-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-dialog-body" },
  template: "<ng-content />",
  styles: [
    `
      :host {
        display: block;
        padding: 1rem 1.25rem;
        overflow-y: auto;
        flex: 1 1 auto;
        max-height: 80vh;
        font-size: 0.875rem;
        line-height: 1.5;
      }
    `,
  ],
})
export class UIDialogBody {}
