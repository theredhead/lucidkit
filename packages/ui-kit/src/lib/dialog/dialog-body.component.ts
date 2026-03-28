import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UISurface } from '@theredhead/foundation';

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
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-dialog-body" },
  templateUrl: "./dialog-body.component.html",
  styleUrl: "./dialog-body.component.scss",
})
export class UIDialogBody {}
