import type { CarouselItemStyle, CarouselStrategy } from "./carousel.types";

/**
 * Classic coverflow strategy inspired by macOS / iPod Cover Flow.
 *
 * The active item is shown front-and-centre; neighbours fan out to
 * either side with a perspective rotation, scale reduction, and
 * partial opacity.
 *
 * @example
 * ```ts
 * readonly strategy = new CoverflowCarouselStrategy();
 * ```
 */
export class CoverflowCarouselStrategy implements CarouselStrategy {
  public readonly name = "coverflow";

  /** Horizontal offset between items in pixels. */
  private readonly spacing: number;

  /** Y-axis rotation angle for side items in degrees. */
  private readonly rotateY: number;

  /** Scale factor applied to side items (0 – 1). */
  private readonly sideScale: number;

  /** How far side items are pushed back on the Z axis. */
  private readonly depthOffset: number;

  public constructor(options?: {
    spacing?: number;
    rotateY?: number;
    sideScale?: number;
    depthOffset?: number;
  }) {
    this.spacing = options?.spacing ?? 210;
    this.rotateY = options?.rotateY ?? 45;
    this.sideScale = options?.sideScale ?? 0.75;
    this.depthOffset = options?.depthOffset ?? 200;
  }

  /** @inheritdoc */
  public getItemStyle(
    itemIndex: number,
    activeIndex: number,
    _totalItems: number,
  ): CarouselItemStyle {
    const offset = itemIndex - activeIndex;
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
    const translateX = direction * (this.spacing * Math.min(distance, 4));
    const rotate = -direction * this.rotateY;
    const scale =
      distance === 1
        ? this.sideScale
        : this.sideScale * Math.pow(0.9, distance - 1);
    const zOffset = -(this.depthOffset * Math.min(distance, 4));
    const opacity = Math.max(0, 1 - distance * 0.25);

    return {
      transform:
        `translateX(${translateX}px) ` +
        `rotateY(${rotate}deg) ` +
        `translateZ(${zOffset}px) ` +
        `scale(${scale})`,
      opacity,
      zIndex: 100 - distance,
      transition: "transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease",
      pointerEvents: distance <= 1 ? "auto" : "none",
      filter: distance > 0 ? `blur(${Math.min(distance - 1, 2)}px)` : "none",
    };
  }

  /** @inheritdoc */
  public getTrackStyle(): Record<string, string> {
    return {
      perspective: "1200px",
      overflow: "visible",
    };
  }
}
