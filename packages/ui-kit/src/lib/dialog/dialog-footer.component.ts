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
  templateUrl: "./dialog-footer.component.html",
  styleUrl: "./dialog-footer.component.scss",
})
export class UIDialogFooter {}
