import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

/** Shape variant for the skeleton placeholder. */
export type SkeletonVariant = "text" | "rect" | "circle";

/**
 * An animated shimmer placeholder displayed while content is loading.
 *
 * Use `variant="text"` with a `lines` count for multi-line text blocks,
 * `variant="rect"` for images or cards, and `variant="circle"` for avatars.
 *
 * @example
 * ```html
 * <!-- Multi-line text placeholder -->
 * <ui-skeleton variant="text" [lines]="3" />
 *
 * <!-- Card image placeholder -->
 * <ui-skeleton variant="rect" width="100%" height="200px" />
 *
 * <!-- Avatar placeholder -->
 * <ui-skeleton variant="circle" width="3rem" height="3rem" />
 * ```
 */
@Component({
  selector: "ui-skeleton",
  standalone: true,
  templateUrl: "./skeleton.component.html",
  styleUrl: "./skeleton.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-skeleton",
    "[class.text]": "variant() === 'text'",
    "[class.rect]": "variant() === 'rect'",
    "[class.circle]": "variant() === 'circle'",
    "[class.animated]": "animated()",
    "[style.width]": "width()",
    "[style.height]": "variant() !== 'text' ? height() : null",
    "[attr.aria-label]": "ariaLabel()",
    "aria-busy": "true",
    "aria-live": "polite",
  },
})
export class UISkeleton {
  /** Shape variant. */
  public readonly variant = input<SkeletonVariant>("text");

  /** Number of text lines to render (only used when `variant="text"`). */
  public readonly lines = input<number>(1);

  /** CSS width applied to the host element. */
  public readonly width = input<string>("100%");

  /**
   * CSS height applied to the host element.
   * For `variant="text"` the height is driven by `lines` instead.
   */
  public readonly height = input<string>("1rem");

  /** Whether to play the shimmer animation. */
  public readonly animated = input<boolean>(true);

  /** Accessible label for screen readers. */
  public readonly ariaLabel = input<string>("Loading…");

  /** @internal */
  protected readonly lineArray = computed(() =>
    Array.from({ length: Math.max(1, this.lines()) }, (_, i) => i),
  );
}
