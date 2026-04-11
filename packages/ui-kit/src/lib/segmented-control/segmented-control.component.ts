import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { UIIcon } from "../icon/icon.component";
import { type SegmentedItem } from "./segmented-control.types";

export type { SegmentedItem };

/**
 * An iOS-style segmented control — a compact row of mutually exclusive option
 * buttons. Suitable for 2–5 options where a full tab group would be too heavy.
 *
 * Bind `[(value)]` to track the active segment id.
 *
 * @example
 * ```html
 * <ui-segmented-control
 *   [items]="views"
 *   [(value)]="activeView"
 * />
 * ```
 */
@Component({
  selector: "ui-segmented-control",
  standalone: true,
  imports: [UIIcon],
  templateUrl: "./segmented-control.component.html",
  styleUrl: "./segmented-control.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-segmented-control",
    role: "radiogroup",
    "[class.disabled]": "disabled()",
    "[attr.aria-label]": "ariaLabel()",
    "[attr.aria-disabled]": "disabled()",
  },
})
export class UISegmentedControl {
  /** Items to render as segments. */
  public readonly items = input.required<SegmentedItem[]>();

  /** The `id` of the currently active segment (two-way). */
  public readonly value = model<string>("");

  /** Disable the entire control. */
  public readonly disabled = input<boolean>(false);

  /** Accessible label for the radiogroup. */
  public readonly ariaLabel = input<string>("Segmented control");

  /** @internal */
  protected select(item: SegmentedItem): void {
    if (!this.disabled() && !item.disabled) {
      this.value.set(item.id);
    }
  }

  /** @internal */
  protected onKeyDown(event: KeyboardEvent, item: SegmentedItem): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.select(item);
    }
  }
}
