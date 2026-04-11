import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core";
import { UIIcon } from "../../../icon/icon.component";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A simple clickable button toolbar tool.
 *
 * Emits a {@link ToolActionEvent} when the user clicks the button.
 *
 * @example
 * ```html
 * <ui-toolbar (toolAction)="onAction($event)">
 *   <ui-button-tool id="save" label="Save" [icon]="UIIcons.Lucide.File.Save" />
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-button-tool",
  standalone: true,
  imports: [UIIcon],
  providers: [
    { provide: UIToolbarItem, useExisting: forwardRef(() => UIButtonTool) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./button-tool.component.html",
  styleUrl: "./button-tool.component.scss",
  host: {
    class: "ui-button-tool",
    "[class.disabled]": "disabled()",
  },
})
export class UIButtonTool extends UIToolbarItem {
  /** @internal */
  protected onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.emitAction(event);
    }
  }
}
