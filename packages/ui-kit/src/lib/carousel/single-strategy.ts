import type { CarouselItemStyle, CarouselStrategy } from "./carousel.types";

/**
 * Single-frame carousel strategy.
 *
 * Only the active item is visible at a time. Each slide stretches to the
 * carousel viewport so projected media can fill the available space.
 *
 * For edge-to-edge imagery, pair this strategy with `object-fit: cover`
 * on the projected image element.
 *
 * @example
 * ```ts
 * readonly strategy = new SingleCarouselStrategy();
 * ```
 */
export class SingleCarouselStrategy implements CarouselStrategy {
  public readonly name = "single";

  /** @inheritdoc */
  public getItemStyle(
    itemIndex: number,
    activeIndex: number,
  ): CarouselItemStyle {
    const isActive = itemIndex === activeIndex;

    return {
      layout: "fill",
      transform: "none",
      opacity: isActive ? 1 : 0,
      zIndex: isActive ? 100 : 1,
      transition: "opacity 0.35s ease",
      pointerEvents: isActive ? "auto" : "none",
    };
  }

  /** @inheritdoc */
  public getTrackStyle(): Record<string, string> {
    return {};
  }
}
