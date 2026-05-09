import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
} from "@angular/core";
import { UIDropdownList, type SelectOption } from "../../../dropdown-list";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A toolbar **value picker** — the trigger label updates to show the
 * currently selected value, and the selection persists in the `value` model.
 *
 * **When to use `UISelectTool` vs `UIDropdownTool`:**
 *
 * | | `UISelectTool` | `UIDropdownTool` |
 * |---|---|---|
 * | Purpose | Choose a value | Execute a command |
 * | Trigger label | Updates to show current value | Always fixed (e.g. "Insert") |
 * | Persistent state | `value` model holds the selection | None — emits an action |
 * | Analogy | `<select>` element | Menu button / split button |
 *
 * Use `UISelectTool` when the user needs to pick a value that stays
 * selected (e.g. font size, colour mode, zoom level).
 * Use {@link UIDropdownTool} for command lists where the trigger label
 * never changes and no value is retained (e.g. an "Insert" menu).
 *
 * After a selection, the new value is available via
 * `(itemRef as UISelectTool).value()` in the `toolAction` handler.
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
  imports: [UIDropdownList],
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
  protected readonly selectOptions = computed(() => this.options());

  /** @internal */
  protected onSelectionChange(newValue: string): void {
    this.value.set(newValue);
    this.emitAction(null);
  }
}
