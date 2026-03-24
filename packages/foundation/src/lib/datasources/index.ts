// ── Datasource interfaces ───────────────────────────────────────────
export {
  type IDatasource,
  type ISortableDatasource,
  type IFilterableDatasource,
  type IActiveDatasource,
  type RowResult,
  type AutocompleteDatasource,
  type TreeNode,
  type ITreeDatasource,
  type IFilterableTreeDatasource,
  type ISortableTreeDatasource,
  type IReorderableDatasource,
  type IInsertableDatasource,
  type IRemovableDatasource,
  type TreeSelectionMode,
} from "./datasource";

// ── Base implementations ────────────────────────────────────────────
export { ArrayDatasource } from "./array-datasource";
export { FilterableArrayDatasource } from "./filterable-array-datasource";
export { SortableArrayDatasource } from "./sortable-array-datasource";
export { RestDatasource } from "./rest-datasource";
export { ArrayTreeDatasource } from "./array-tree-datasource";
export { FilterableArrayTreeDatasource } from "./filterable-array-tree-datasource";
export { SortableArrayTreeDatasource } from "./sortable-array-tree-datasource";

// ── Type guards ────────────────────────────────────────────────────
export {
  isFilterableDatasource,
  isSortableDatasource,
  isTreeDatasource,
  isFilterableTreeDatasource,
  isSortableTreeDatasource,
  isReorderableDatasource,
  isInsertableDatasource,
  isRemovableDatasource,
} from "./type-guards";

// ── Utility functions ──────────────────────────────────────────────
export {
  moveItemInArray,
  moveItemToArray,
  moveItemInArrayPure,
  moveItemToArrayPure,
} from "./array-utils";
