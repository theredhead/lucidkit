// Core types — re-exported from @theredhead/foundation
export {
  Emitter,
  SortDirection,
  type SortExpression,
  type CompiledFilter,
  type RangeDefinition,
  type RowChangedNotification,
  type RowRangeChangedNotification,
} from "@theredhead/foundation";

// Selection model — remains in ui-kit
export {
  SelectionModel,
  TableSelectionModel,
  type SelectionMode,
} from "../selection-model";
