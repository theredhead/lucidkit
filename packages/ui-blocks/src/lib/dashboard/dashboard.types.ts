/**
 * Types and interfaces for the dashboard host component.
 *
 * A dashboard lays out a set of **panels** on a CSS grid.
 * Each panel declares its grid placement (column/row span)
 * and optional metadata (title, collapsible, removable).
 */

// ── Grid placement ────────────────────────────────────────────────

/**
 * Grid placement descriptor for a single dashboard panel.
 *
 * Values map directly to CSS `grid-column` / `grid-row` span units.
 * All values default to `1` when omitted.
 */
export interface DashboardGridPlacement {
  /** Number of columns the panel spans. */
  readonly colSpan?: number;
  /** Number of rows the panel spans. */
  readonly rowSpan?: number;
}

// ── Panel configuration ───────────────────────────────────────────

/**
 * Static configuration for a single dashboard panel.
 *
 * Passed as the `[config]` input to `<ui-dashboard-panel>`.
 */
export interface DashboardPanelConfig {
  /** Unique identifier for this panel. */
  readonly id: string;

  /** Display title rendered in the panel header. */
  readonly title: string;

  /** Grid placement (column / row span). */
  readonly placement?: DashboardGridPlacement;

  /**
   * Whether the panel body can be collapsed by the user.
   * Defaults to `false`.
   */
  readonly collapsible?: boolean;

  /**
   * Whether the panel can be removed (hidden) by the user.
   * Defaults to `false`.
   */
  readonly removable?: boolean;
}

// ── Layout presets ────────────────────────────────────────────────

/**
 * Predefined column count aliases for common dashboard layouts.
 *
 * - `'auto'` — responsive auto-fill with `minmax(280px, 1fr)`
 * - A number — explicit fixed column count
 */
export type DashboardColumns = "auto" | number;
