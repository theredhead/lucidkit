/**
 * Style values applied to each carousel item by a {@link CarouselStrategy}.
 *
 * Every property is optional — the component applies only the
 * properties that the strategy returns.
 */
export interface CarouselItemStyle {
  readonly layout?: "centered" | "fill";
  readonly transform?: string;
  readonly opacity?: number;
  readonly zIndex?: number;
  readonly transition?: string;
  readonly pointerEvents?: "auto" | "none";
  readonly filter?: string;
}

/**
 * Strategy that controls how carousel items are laid out and
 * animated when the active index changes.
 *
 * Two built-in implementations ship with the library:
 *
 * - {@link SingleCarouselStrategy} — one visible item filling the viewport
 * - {@link ScrollCarouselStrategy} — simple slide-by-slide scroll
 * - {@link CoverflowCarouselStrategy} — 3D perspective coverflow
 *
 * Consumers may implement custom strategies by conforming to this
 * interface.
 */
export interface CarouselStrategy {

  /** Human-readable name (useful for debugging / stories). */
  readonly name: string;

  /**
   * Compute the CSS styles for a single item.
   *
   * @param itemIndex  — the item's position in the array
   * @param activeIndex — the currently centred / active index
   * @param totalItems  — total number of items
   */
  getItemStyle(
    itemIndex: number,
    activeIndex: number,
    totalItems: number,
    wrap?: boolean,
  ): CarouselItemStyle;

  /**
   * Returns the CSS style object for the track container itself.
   * Strategies may set `perspective`, `overflow`, etc.
   */
  getTrackStyle(): Record<string, string>;
}

/**
 * Template context provided to the projected `ng-template` for
 * each carousel item.
 */
export interface CarouselItemContext<T = unknown> {

  /** The data item (implicit `let` variable). */
  readonly $implicit: T;

  /** Named alias. */
  readonly item: T;

  /** Zero-based index of this item. */
  readonly index: number;

  /** Whether this item is the currently active (centred) one. */
  readonly active: boolean;
}
