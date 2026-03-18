# Datasource Architecture Standard

## Overview

This document defines a standardized datasource contract and capability system for all data-displaying controls in the `@theredhead` component library. The goal is to separate data operations (filtering, sorting, paging) from UI rendering, making controls predictable, testable, and composable.

## Design Goals

- Keep base datasource contracts minimal and capability-agnostic.
- Add specialist behavior via opt-in interfaces (filtering, sorting, paging, tree navigation).
- Let UI components detect and use capabilities; never own data-logic behavior.
- Ensure consistent patterns across table, tree, repeater, and other data controls.
- Make controls work gracefully with minimal datasources that lack certain capabilities.

---

## Core Interfaces (Minimal Baseline)

```ts
/** Minimal read-only datasource contract for UI consumers. */
export interface IDataSource<T> {
  getNumberOfItems(): number | Promise<number>;
  getObjectAtRowIndex(index: number): T | Promise<T>;
}

/** Optional capability for page-oriented datasources. */
export interface IPageableDataSource {
  getPageIndex(): number;
  setPageIndex(index: number): void;
  getPageSize(): number;
  setPageSize(size: number): void;
}
```

## Capability Interfaces (Specialist Behavior)

```ts
// Use existing types from @theredhead/foundation:
// import { type FilterExpression, type SortExpression } from "@theredhead/foundation";

/**
 * Optional filtering capability.
 * UI components should use type guards to detect and call this method.
 */
export interface IFilterableDataSource<T> {
  filterBy(expression: FilterExpression<T>): void;
}

/**
 * Optional sorting capability.
 * UI components should use type guards to detect and call this method.
 */
export interface ISortableDataSource<T> {
  sortBy(expression: SortExpression<T>): void;
}

/**
 * Optional tree behavior.
 * Implement this to provide hierarchical data.
 */
export interface ITreeDataSource<T> {
  getRootNodes(): TreeNode<T>[] | Promise<TreeNode<T>[]>;
  getChildren(node: TreeNode<T>): TreeNode<T>[] | Promise<TreeNode<T>[]>;
  hasChildren(node: TreeNode<T>): boolean;
}

/**
 * Optional tree filtering capability.
 * Combines tree navigation with filtering predicate application.
 */
export interface IFilterableTreeDataSource<T> extends ITreeDataSource<T> {
  filterBy(expression: FilterExpression<T>): void;
}
```

## Type Guards (Capability Detection)

Use these to safely detect and consume capabilities:

```ts
export function isFilterableDataSource<T>(
  ds: IDataSource<T>,
): ds is IDataSource<T> & IFilterableDataSource<T> {
  return "filterBy" in ds;
}

export function isSortableDataSource<T>(
  ds: IDataSource<T>,
): ds is IDataSource<T> & ISortableDataSource<T> {
  return "sortBy" in ds;
}

export function isPageableDataSource(ds: unknown): ds is IPageableDataSource {
  return (
    typeof ds === "object" &&
    ds !== null &&
    "getPageIndex" in ds &&
    "setPageIndex" in ds
  );
}

export function isTreeDataSource<T>(ds: unknown): ds is ITreeDataSource<T> {
  return (
    typeof ds === "object" &&
    ds !== null &&
    "getRootNodes" in ds &&
    "getChildren" in ds
  );
}
```

## Standardization Rules

1. **UI components must only read, render, and select** — no filtering/sorting algorithm logic.
2. **Data operations flow through datasource capabilities** — components never mutate or filter data directly.
3. **Feature detection via type guards** — always check capability presence before calling capability methods.
4. **Consistent naming** — capability method names align across all datasource implementations (e.g., `filterBy`, `sortBy`).
5. **Graceful degradation** — if a capability is absent, the component should hide/disable related UI controls.
6. **No legacy pathways** — once a component is refactored to use capabilities, remove old component-level filtering/sorting logic.

## Migration Order (Incremental)

1. **Finalize and publish contracts** in `packages/foundation/src/lib/datasource/` (new).
2. **Add type guards and capability detection** helpers in the same location.
3. **Update existing base datasources** (`ArrayTreeDatasource`, `GanttArrayDatasource`, etc.) to implement only minimal baseline contracts.
4. **Move filtering/sorting behavior** into new capability datasources (`FilterableArrayTreeDatasource`, `SortableArrayDatasource`, etc.).
5. **Refactor `UIMasterDetailView`** tree mode to call datasource capability methods instead of applying predicates in UI code.
6. **Refactor `UITableView`** to delegate sorting to capabilities instead of sorting rows in the component.
7. **Refactor `UITreeView`** to delegate filtering to capabilities instead of running recursive `filterTree` in the component.
8. **Refactor `UIRepeater`** limit/window shaping — decide whether it belongs in datasource capabilities or remains a documented exception.
9. **Add comprehensive tests** that prove components do not perform filtering/sorting when capabilities are absent.
10. **Deprecate and remove** legacy component-level filtering/sorting pathways.

## Affected Controls

- **`UITableView`** — currently sorts rows in component; should delegate to `ISortableDataSource.sortBy()`
- **`UITreeView`** — currently filters with recursive `filterTree()` in component; should delegate to `IFilterableTreeDataSource.filterBy()`
- **`UIMasterDetailView`** — currently orchestrates filter application in UI layer for both table and tree modes; should delegate to datasource capabilities
- **`UIRepeater`** — currently applies limit/window shaping in component; should be reviewed for capability-driven refactoring
- **`UIGanttChart`** — currently applies filtering/date-range logic in component; should delegate to capabilities

## Acceptance Criteria

- ✅ No UI component contains filtering, sorting, or data-shaping algorithm logic.
- ✅ Components compile and run with minimal datasources that do not implement specialist capabilities.
- ✅ Filtering/sorting behavior is consistent across controls because it is interface-driven.
- ✅ Tree and table pathways share the same capability naming semantics.
- ✅ All control-level tests pass without capability datasources present (graceful degradation).
- ✅ Existing consumers' code continues to work; refactoring is additive and backward-compatible where feasible.

---

## Notes on `FilterExpression` and `SortExpression`

These are defined in `@theredhead/foundation`. They should represent a simple AST capable of:

- **FilterExpression**: Boolean predicate evaluation (equality, range, contains, logical operators).
- **SortExpression**: Single or multi-field sort directions with custom comparators if needed.

Both should be serializable and usable for both in-memory and remote datasources.
