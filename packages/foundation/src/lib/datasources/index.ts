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
  isFilterableTreeDatasource,
  isSortableTreeDatasource,
} from "./type-guards";
