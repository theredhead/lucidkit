/**
 * Shared constants for the table-view component family.
 *
 * Centralising "magic numbers" here makes it easy to keep TypeScript
 * logic, template bindings, and SCSS tokens in sync.
 */

/** Minimum width (px) a column can be resized to via drag. */
export const MIN_COLUMN_WIDTH = 40;

/** Minimum width (px) assigned to flex (un-resized) columns when computing total row width. */
export const FLEX_COLUMN_MIN_WIDTH = 120;

/** Width (px) of the leading row-index indicator column. Must match `--tv-row-index-width`. */
export const ROW_INDEX_COLUMN_WIDTH = 68;

/** Default virtual-scroll row height (px). */
export const DEFAULT_ROW_HEIGHT = 36;

/** Width (px) of the selection column (radio / checkbox). Must match `--tv-selection-col-width`. */
export const SELECTION_COLUMN_WIDTH = 48;

/** Default page size used by datasource adapters. */
export const INITIAL_PAGE_SIZE = 100;
