/** A single item in a segmented control. */
export interface SegmentedItem {
  /** Unique identifier — used as the bound value. */
  readonly id: string;

  /** Display label. */
  readonly label: string;

  /**
   * Optional SVG inner-content for a leading icon.
   * Uses the same format as `UIIcon [svg]`.
   */
  readonly icon?: string;

  /** Whether this item is individually disabled. */
  readonly disabled?: boolean;
}
