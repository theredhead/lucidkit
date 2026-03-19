import type { CarouselItemStyle, CarouselStrategy } from "./carousel.types";

/**
 * Configuration options for {@link CoverflowCarouselStrategy}.
 *
 * All options are optional — sensible defaults produce a
 * classic Cover Flow effect out of the box.
 */
export interface CoverflowOptions {
  /**
   * Horizontal distance from the centre item to the first
   * neighbour (px). Subsequent items stack with a much
   * smaller increment so they overlap heavily.
   * @default 42
   */
  readonly peekOffset?: number;

  /**
   * How much each additional item beyond the first neighbour
   * is shifted further from centre (px).
   * @default 18
   */
  readonly stackGap?: number;

  /**
   * Y-axis rotation angle for side items in degrees.
   * @default 72
   */
  readonly rotateY?: number;

  /**
   * Scale factor applied to side items (0 – 1).
   * @default 0.82
   */
  readonly sideScale?: number;

  /**
   * How far side items are pushed back on the Z axis (px).
   * @default 80
   */
  readonly depthOffset?: number;

  /**
   * Whether to apply a progressive blur to non-active items.
   * Set to `false` to keep all items sharp.
   * @default false
   */
  readonly blur?: boolean;

  /**
   * Whether to progressively fade (reduce opacity of) non-active
   * items. When `false` every item stays at full opacity.
   * @default false
   */
  readonly fade?: boolean;
}

/**
 * Classic coverflow strategy inspired by macOS / iPod Cover Flow.
 *
 * The active item is shown front-and-centre; neighbours are
 * rotated, pushed back on the Z axis, and tightly stacked so
 * they overlap — just like the original Cover Flow in iTunes
 * and macOS Finder.
 *
 * @example
 * ```ts
 * // Default coverflow
 * readonly strategy = new CoverflowCarouselStrategy();
 *
 * // Sharp (no blur) coverflow
 * readonly strategy = new CoverflowCarouselStrategy({ blur: false });
 * ```
 */
export class CoverflowCarouselStrategy implements CarouselStrategy {
  public readonly name = "coverflow";

  private readonly peekOffset: number;
  private readonly stackGap: number;
  private readonly rotateY: number;
  private readonly sideScale: number;
  private readonly depthOffset: number;
  private readonly blur: boolean;
  private readonly fade: boolean;

  public constructor(options?: CoverflowOptions) {
    this.peekOffset = options?.peekOffset ?? 42;
    this.stackGap = options?.stackGap ?? 18;
    this.rotateY = options?.rotateY ?? 72;
    this.sideScale = options?.sideScale ?? 0.82;
    this.depthOffset = options?.depthOffset ?? 80;
    this.blur = options?.blur ?? false;
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

    // In wrap mode, use the shortest circular distance so items
    // on the far side of the ring appear as nearby neighbours
    // instead of flying across the entire carousel.
    if (wrap && totalItems > 0) {
      if (offset > totalItems / 2) offset -= totalItems;
      else if (offset < -totalItems / 2) offset += totalItems;
    }

    const distance = Math.abs(offset);

    if (distance === 0) {
      return {
        transform: "translateX(0) rotateY(0deg) translateZ(0) scale(1)",
        opacity: 1,
        zIndex: 100,
        transition: "transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease",
        pointerEvents: "auto",
      };
    }

    const direction = offset > 0 ? 1 : -1;

    // First neighbour jumps out by peekOffset; each further item
    // adds only stackGap — producing the tightly-stacked overlap.
    const translateX =
      direction * (this.peekOffset + (distance - 1) * this.stackGap);

    const rotate = -direction * this.rotateY;
    const scale = this.sideScale;
    // Shallow depth so side items stay visually close to the front item
    const zOffset = -(this.depthOffset + (distance - 1) * 20);
    const opacity = this.fade ? Math.max(0.15, 1 - distance * 0.12) : 1;

    return {
      transform:
        `translateX(${translateX}px) ` +
        `rotateY(${rotate}deg) ` +
        `translateZ(${zOffset}px) ` +
        `scale(${scale})`,
      opacity,
      zIndex: 100 - distance,
      transition: "transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease",
      pointerEvents: "auto",
      filter:
        this.blur && distance > 0
          ? `blur(${Math.min(distance, 3)}px)`
          : undefined,
    };
  }

  /** @inheritdoc */
  public getTrackStyle(): Record<string, string> {
    return {
      perspective: "800px",
      overflow: "visible",
    };
  }
}
