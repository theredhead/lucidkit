import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
} from "@angular/core";
import { UISelect, type SelectOption } from "../../../select/select.component";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A toolbar tool that wraps {@link UISelect} and emits a
 * {@link ToolActionEvent} when the selection changes.
 *
 * The new value is available via `(itemRef as UISelectTool).value()`
 * after a `toolAction` event fires.
 *
 * @example
 * ```html
 * <ui-toolbar (toolAction)="onAction($event)">
 *   <ui-select-tool
 *     id="font-size"
 *     label="Size"
 *     [options]="fontSizeOptions"
 *     [(value)]="fontSize"
 *   />
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-select-tool",
  standalone: true,
  imports: [UISelect],
  providers: [
    { provide: UIToolbarItem, useExisting: forwardRef(() => UISelectTool) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./select-tool.component.html",
  styleUrl: "./select-tool.component.scss",
  host: {
    class: "ui-select-tool",
    "[class.disabled]": "disabled()",
  },
})
export class UISelectTool extends UIToolbarItem {
  /** Available select options. */
  public readonly options = input<SelectOption[]>([]);

  /** Currently selected value (two-way bindable). */
  public readonly value = model<string>("");

  /** @internal */
  protected readonly selectOptions = computed(
    () => this.options() as readonly SelectOption[],
  );

  /** @internal */
  protected onSelectionChange(newValue: string): void {
    this.value.set(newValue);
    this.emitAction(null);
  }
}
