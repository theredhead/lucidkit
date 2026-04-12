import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  model,
} from "@angular/core";
import { UIIcon } from "../../../icon/icon.component";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A toolbar tool that toggles between checked and unchecked states.
 *
 * Emits a {@link ToolActionEvent} on each click (regardless of the new
 * checked state). The consumer can read the new state from
 * `(itemRef as UIToggleTool).checked()`.
 *
 * {@link deactivate} sets `checked` to `false`, allowing
 * {@link UIToggleGroupTool} to enforce radio-style exclusivity.
 *
 * @example
 * ```html
 * <ui-toolbar (toolAction)="onAction($event)">
 *   <ui-toggle-tool id="bold" label="Bold" [(checked)]="isBold" />
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-toggle-tool",
  standalone: true,
  imports: [UIIcon],
  providers: [
    { provide: UIToolbarItem, useExisting: forwardRef(() => UIToggleTool) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./toggle-tool.component.html",
  styleUrl: "./toggle-tool.component.scss",
  host: {
    class: "ui-toggle-tool",
    "[class.checked]": "checked()",
    "[class.disabled]": "disabled()",
  },
})
export class UIToggleTool extends UIToolbarItem {

  /** Two-way bindable checked state. */
  public readonly checked = model<boolean>(false);

  /**
   * Sets `checked` to `false`.
   *
   * Called by {@link UIToggleGroupTool} to deactivate siblings when
   * another toggle in the group is activated.
   */
  public override deactivate(): void {
    this.checked.set(false);
  }

  /** @internal */
  protected onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.checked.update((v) => !v);
      this.emitAction(event);
    }
  }
}
