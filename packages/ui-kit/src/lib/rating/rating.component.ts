import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from "@angular/core";
import type { RatingSize } from "./rating.types";

export type { RatingSize };

/**
 * A star rating input that supports read-only display and interactive selection.
 *
 * Bind `[(value)]` for two-way control. Set `[readonly]="true"` to use as a
 * display-only indicator (e.g. in table cells or review cards).
 *
 * @example
 * ```html
 * <!-- Interactive -->
 * <ui-rating [(value)]="stars" />
 *
 * <!-- Read-only display -->
 * <ui-rating [value]="3.5" [readonly]="true" />
 * ```
 */
@Component({
  selector: "ui-rating",
  standalone: true,
  templateUrl: "./rating.component.html",
  styleUrl: "./rating.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-rating",
    "[class.readonly]": "readonly()",
    "[class.disabled]": "disabled()",
    "[class.small]": "size() === 'small'",
    "[class.medium]": "size() === 'medium'",
    "[class.large]": "size() === 'large'",
    role: "radiogroup",
    "[attr.aria-label]": "ariaLabel()",
    "[attr.aria-disabled]": "disabled()",
  },
})
export class UIRating {

  /** Current rating value (two-way). */
  public readonly value = model<number>(0);

  /** Maximum number of stars. */
  public readonly max = input<number>(5);

  /** Render as a display indicator — no interaction. */
  public readonly readonly = input<boolean>(false);

  /** Disable the rating input. */
  public readonly disabled = input<boolean>(false);

  /** Visual size. */
  public readonly size = input<RatingSize>("medium");

  /** Accessible label for the radiogroup. */
  public readonly ariaLabel = input<string>("Rating");

  /** @internal — hovered star index (1-based, 0 = none). */
  protected readonly hovered = signal(0);

  /** @internal — resolved display value (hover overrides committed value). */
  protected readonly displayValue = computed(() =>
    this.hovered() > 0 ? this.hovered() : this.value(),
  );

  /** @internal */
  protected readonly stars = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i + 1),
  );

  /** @internal */
  protected isFilled(star: number): boolean {
    return star <= this.displayValue();
  }

  /** @internal */
  protected select(star: number): void {
    if (!this.readonly() && !this.disabled()) {
      this.value.set(star);
      this.hovered.set(0);
    }
  }

  /** @internal */
  protected onHover(star: number): void {
    if (!this.readonly() && !this.disabled()) {
      this.hovered.set(star);
    }
  }

  /** @internal */
  protected onLeave(): void {
    this.hovered.set(0);
  }

  /** @internal */
  protected onKeyDown(event: KeyboardEvent, star: number): void {
    if (this.readonly() || this.disabled()) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.select(star);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      this.value.update((v) => Math.min(v + 1, this.max()));
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      this.value.update((v) => Math.max(v - 1, 0));
    }
  }
}
