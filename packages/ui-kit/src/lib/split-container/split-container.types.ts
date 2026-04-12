// ---------------------------------------------------------------------------
// Split-container types
// ---------------------------------------------------------------------------

/** Layout orientation of the split container. */
export type SplitOrientation = "horizontal" | "vertical";

/**
 * Which panel to collapse when the divider is double-clicked.
 *
 * - `"first"` — collapse the first (left / top) panel.
 * - `"second"` — collapse the second (right / bottom) panel.
 * - `"none"` — double-click-to-collapse is disabled.
 */
export type SplitCollapseTarget = "first" | "second" | "none";

/**
 * Panel size constraint (in pixels).
 *
 * Set `min` and / or `max` to restrict how far the divider can be
 * dragged in either direction.
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
 * Sizes are expressed as a `[first, second]` tuple where each value
 * is the percentage of the container occupied by that panel.
 */
export interface SplitResizeEvent {

  /** Panel sizes as percentages (0–100). */
  sizes: readonly [number, number];

  /** The orientation of the split at the time of the event. */
  orientation: SplitOrientation;
}
