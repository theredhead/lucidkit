import { InjectionToken } from "@angular/core";

/**
 * Contract for a table body rendering strategy.
 *
 * Each implementation controls how rows are displayed in the table body
 * and how programmatic scrolling to a specific row is performed.
 */
export interface ITableRowRenderingStrategy {
  /** Scroll the row at the given index into the visible area. */
  scrollToIndex(index: number): void;
}

/** Discriminated literal for selecting a rendering strategy. */
export type TableRowRenderingStrategyType = "plain" | "virtual";

/**
 * DI token providing the workspace-wide default rendering strategy.
 * Defaults to `'plain'` (no CDK virtual scroll).
 *
 * Override at component or module level:
 * ```ts
 * providers: [{ provide: TABLE_ROW_RENDERING_STRATEGY, useValue: 'virtual' }]
 * ```
 */
export const TABLE_ROW_RENDERING_STRATEGY =
  new InjectionToken<TableRowRenderingStrategyType>(
    "TABLE_ROW_RENDERING_STRATEGY",
    { providedIn: "root", factory: () => "plain" },
  );
