/**
 * Re-exported from `@theredhead/lucid-foundation`.
 *
 * All datasource interfaces and supporting types now live in the
 * foundation package. This module re-exports them for backwards
 * compatibility so that existing imports keep working.
 */
import type { IDatasource } from "@theredhead/lucid-foundation";

import type { FilterExpression } from "../../filter/filter.types";

export {
  Emitter,
  SortDirection,
  type SortExpression,
  type CompiledFilter,
  type RangeDefinition,
  type RowChangedNotification,
  type RowRangeChangedNotification,
  type RowResult,
  type IDatasource,
  type ISortableDatasource,
  type IActiveDatasource,
} from "@theredhead/lucid-foundation";

/**
 * Public ui-kit datasource contract for serializable filtering.
 *
 * Unlike the lower-level foundation datasource contract, this surface
 * accepts the serializable {@link FilterExpression} emitted by `ui-filter`.
 */
export interface IFilterableDatasource<T = unknown> extends IDatasource<T> {
  /**
   * Applies the given serializable filter descriptor.
   *
   * Pass `null`, `undefined`, or an empty rule list to clear the filter.
   */
  filterBy(expression: FilterExpression<T> | null | undefined): void;
}
