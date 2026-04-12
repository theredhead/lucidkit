/**
 * Region of the source image to crop, in image pixel coordinates.
 */
export interface CropRegion {

  /** Left edge in image pixels. */
  x: number;

  /** Top edge in image pixels. */
  y: number;

  /** Width in image pixels. */
  width: number;

  /** Height in image pixels. */
  height: number;
}

/** Supported image export formats. */
export type ImageExportFormat = "image/png" | "image/jpeg";

/**
 * Which part of the crop overlay is being interacted with.
 *
 * - `nw`, `ne`, `sw`, `se` — corner handles
 * - `n`, `s`, `e`, `w` — edge handles
 * - `move` — interior (drag to reposition)
 */
export type CropHandle =
  | "move"
  | "nw"
  | "ne"
  | "sw"
  | "se"
  | "n"
  | "s"
  | "e"
  | "w";

/**
 * Describes how a source image is positioned within the canvas.
 * Used to convert between image coordinates and canvas coordinates.
 */
export interface ImageFit {

  /** Horizontal offset of the image's left edge on the canvas. */
  x: number;

  /** Vertical offset of the image's top edge on the canvas. */
  y: number;

  /** Rendered width of the image on the canvas (CSS pixels). */
  width: number;

  /** Rendered height of the image on the canvas (CSS pixels). */
  height: number;

  /** Scale factor: canvas pixels per image pixel. */
  scale: number;
}
