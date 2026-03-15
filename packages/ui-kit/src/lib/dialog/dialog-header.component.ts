import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * Header section for a dialog.
 *
 * Use inside `<ui-dialog>` or a {@link ModalService} content component
 * to render a styled header with a bottom border.
 *
 * @example
 * ```html
 * <ui-dialog-header>Confirm Action</ui-dialog-header>
 * ```
 */
@Component({
  selector: "ui-dialog-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-dialog-header" },
  template: "<ng-content />",
  styles: [
    `
      :host {
        display: block;
        padding: 1rem 1.25rem 0.75rem;
        font:
          600 1.125rem/1.4 system-ui,
          sans-serif;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
      }
    `,
  ],
})
export class UIDialogHeader {}
