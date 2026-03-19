import type { CarouselItemStyle, CarouselStrategy } from "./carousel.types";

/**
 * Simple horizontal scroll strategy.
 *
 * Items are laid out in a horizontal row and translated so the
 * active item is centred. Only the active item and its immediate
 * neighbours are fully opaque; the rest fade out.
 *
 * @example
 * ```ts
 * readonly strategy = new ScrollCarouselStrategy();
 * ```
 */
export class ScrollCarouselStrategy implements CarouselStrategy {
  public readonly name = "scroll";

  /**
   * Gap between items in pixels.
   * @default 16
   */
  private readonly gap: number;

  /**
   * Width of each item in pixels.
   * @default 280
   */
  private readonly itemWidth: number;

  /**
   * Whether to progressively fade (reduce opacity of) non-active
   * items. When `false` every item stays at full opacity.
   * @default false
   */
  private readonly fade: boolean;

  public constructor(options?: {
    gap?: number;
    itemWidth?: number;
    fade?: boolean;
  }) {
    this.gap = options?.gap ?? 16;
    this.itemWidth = options?.itemWidth ?? 280;
    this.fade = options?.fade ?? false;
  }

  /** @inheritdoc */
  public getItemStyle(
    itemIndex: number,
    activeIndex: number,
    totalItems: number,
    wrap = false,
  ): CarouselItemStyle {
    let offset = itemIndex - activeIndex;

    if (wrap && totalItems > 0) {
      if (offset > totalItems / 2) offset -= totalItems;
      else if (offset < -totalItems / 2) offset += totalItems;
    }

    const translateX = offset * (this.itemWidth + this.gap);
    const distance = Math.abs(offset);

    return {
      transform: `translateX(${translateX}px)`,
      opacity: this.fade
        ? distance === 0
          ? 1
          : distance === 1
            ? 0.7
            : 0.4
        : 1,
      zIndex: 10 - distance,
      transition: "transform 0.4s ease, opacity 0.4s ease",
      pointerEvents: "auto",
    };
  }

  /** @inheritdoc */
  public getTrackStyle(): Record<string, string> {
    return {};
  }
}
