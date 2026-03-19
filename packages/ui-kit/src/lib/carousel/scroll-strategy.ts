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

  public constructor(options?: { gap?: number; itemWidth?: number }) {
    this.gap = options?.gap ?? 16;
    this.itemWidth = options?.itemWidth ?? 280;
  }

  /** @inheritdoc */
  public getItemStyle(
    itemIndex: number,
    activeIndex: number,
    _totalItems: number,
  ): CarouselItemStyle {
    const offset = itemIndex - activeIndex;
    const translateX = offset * (this.itemWidth + this.gap);
    const distance = Math.abs(offset);

    return {
      transform: `translateX(${translateX}px)`,
      opacity: distance === 0 ? 1 : distance === 1 ? 0.7 : 0.4,
      zIndex: 10 - distance,
      transition: "transform 0.4s ease, opacity 0.4s ease",
      pointerEvents: distance === 0 ? "auto" : "none",
    };
  }

  /** @inheritdoc */
  public getTrackStyle(): Record<string, string> {
    return { overflow: "hidden" };
  }
}
