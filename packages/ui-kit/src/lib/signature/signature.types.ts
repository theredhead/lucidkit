/**
 * The discriminated-union value type stored and emitted by `UISignature`.
 *
 * - `SignatureStrokeValue` – strokes drawn by the user, fully replayable.
 * - `SignatureImageValue` – an image pasted, dropped, or browsed by the user.
 * - `null` – the field is empty.
 */
export type SignatureValue = SignatureStrokeValue | SignatureImageValue | null;

/**
 * A stroke-based signature captured by the user drawing on the canvas.
 * Stroke data is ordered and replayable.
 */
export interface SignatureStrokeValue {
  /** Discriminator – always `'strokes'`. */
  kind: "strokes";

  /** Ordered groups of stroke points, one per pen-down / pen-up pair. */
  strokes: StrokeGroup[];

  /**
   * The canvas dimensions at the time the signature was captured.
   * Used to scale the strokes correctly when replaying on canvases of
   * different sizes.
   */
  bounds?: {
    width: number;
    height: number;
  };
}

/**
 * An image-based signature.  The image cannot be replayed as strokes and
 * SVG export is not supported for this kind.
 */
export interface SignatureImageValue {
  /** Discriminator – always `'image'`. */
  kind: "image";

  /** The imported image payload. */
  image: {
    /** MIME type of the original image (e.g. `'image/png'`). */
    mimeType: string;

    /** Base-64 data URL of the image. */
    dataUrl: string;

    /** Original image width in pixels, when known. */
    width?: number;

    /** Original image height in pixels, when known. */
    height?: number;
  };
}

/**
 * A single continuous stroke (pen-down → pen-up) containing an ordered
 * sequence of sample points.
 */
export interface StrokeGroup {
  /** Ordered sample points within this stroke. */
  points: StrokePoint[];
}

/**
 * A single sampled position within a stroke.
 */
export interface StrokePoint {
  /** Horizontal canvas coordinate in pixels. */
  x: number;

  /** Vertical canvas coordinate in pixels. */
  y: number;

  /**
   * Timestamp in milliseconds when this point was captured
   * (`Date.now()` at sample time).
   */
  time: number;

  /**
   * Normalised pointer pressure in the range `[0, 1]`.
   * Present only when pressure capture is enabled and the hardware
   * supports it.  Absence must not break drawing, replay, or export.
   */
  pressure?: number;
}
