import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  model,
  signal,
  viewChildren,
} from "@angular/core";
import { UIIcon } from "../icon/icon.component";
import { type SegmentedItem } from "./segmented-control.types";

export type { SegmentedItem };

/**
 * An iOS-style segmented control — a compact row of mutually exclusive option
 * buttons. Suitable for 2–5 options where a full tab group would be too heavy.
 *
 * Bind `[(value)]` to track the active segment id. The selection pill slides
 * smoothly between segments by default; set `[animateSelection]="false"` to
 * disable the animation.
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
    "[class.animated]": "animateSelection()",
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

  /**
   * Whether to animate the selection pill sliding between segments.
   * Defaults to `true`.
   */
  public readonly animateSelection = input<boolean>(true);

  private readonly segmentRefs =
    viewChildren<ElementRef<HTMLButtonElement>>("segmentBtn");

  /** @internal */
  protected readonly indicatorLeft = signal(0);

  /** @internal */
  protected readonly indicatorWidth = signal(0);

  public constructor() {
    effect(() => {
      const val = this.value();
      const refs = this.segmentRefs();
      const items = this.items();
      const idx = items.findIndex((i) => i.id === val);
      if (idx >= 0 && refs[idx]) {
        const el = refs[idx].nativeElement;
        this.indicatorLeft.set(el.offsetLeft);
        this.indicatorWidth.set(el.offsetWidth);
      }
    });
  }

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
