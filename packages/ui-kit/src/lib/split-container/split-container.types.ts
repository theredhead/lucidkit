// ---------------------------------------------------------------------------
// Split-container types
// ---------------------------------------------------------------------------

/** Layout orientation of the split container. */
export type SplitOrientation = "horizontal" | "vertical";

/**
 * Panel size constraint (in pixels).
 *
 * Set `min` and / or `max` to restrict how far a divider can be
 * dragged in either direction. Apply via `<ui-split-panel [min]="..." [max]="...">`.
 */
export interface SplitPanelConstraints {

  /** Minimum panel size in pixels. Defaults to `0`. */
  min?: number;

  /** Maximum panel size in pixels. Defaults to `Infinity`. */
  max?: number;
}

/**
 * Event emitted when the split sizes change.
 *
 * Sizes are expressed as an array of percentages, one per panel,
 * where each value is the percentage of the container occupied by
 * that panel. Values sum to 100.
 */
export interface SplitResizeEvent {

  /**
   * Panel sizes as percentages (0–100).
   * One entry per `<ui-split-panel>` child.
   */
  sizes: readonly number[];

  /** The orientation of the split at the time of the event. */
  orientation: SplitOrientation;
}
