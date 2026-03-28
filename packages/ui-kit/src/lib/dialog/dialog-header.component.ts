import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UISurface } from '@theredhead/foundation';

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
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-dialog-header" },
  templateUrl: "./dialog-header.component.html",
  styleUrl: "./dialog-header.component.scss",
})
export class UIDialogHeader {}
