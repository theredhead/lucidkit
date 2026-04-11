/**
 * Re-exported from `@theredhead/lucid-foundation`.
 *
 * All datasource interfaces and supporting types now live in the
 * foundation package. This module re-exports them for backwards
 * compatibility so that existing imports keep working.
 */
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
  type IFilterableDatasource,
  type IActiveDatasource,
} from "@theredhead/lucid-foundation";
