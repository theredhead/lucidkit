# Work Checklist

## Datasource Architecture Refactoring

**Design Doc**: See [DATASOURCE-ARCHITECTURE.md](./DATASOURCE-ARCHITECTURE.md)

### Phase 1: Foundation & Contracts

- [x] Create `packages/foundation/src/lib/datasource/` with base contracts (`IDataSource`, `IPageableDataSource`, etc.)
- [x] Implement capability interfaces (`IFilterableDataSource`, `ISortableDataSource`, `ITreeDataSource`, `IFilterableTreeDataSource`)
- [x] Implement type guards (`isFilterableDataSource`, `isSortableDataSource`, `isPageableDataSource`, `isTreeDataSource`, `isFilterableTreeDataSource`)
- [x] Export all from `@theredhead/lucid-foundation` public API
- [x] Add comprehensive JSDoc and examples to all contracts
- [x] Verified TypeScript compilation (no errors in datasource/ folder)

### Phase 2: Datasource Updates

- [ ] Refactor `ArrayTreeDatasource` to implement minimal baseline + optional capabilities
- [ ] Refactor `GanttArrayDatasource` to implement minimal baseline + optional capabilities
- [ ] Create capability-specific datasource variants:
  - [ ] `FilterableArrayTreeDatasource` (extends `ArrayTreeDatasource` + `IFilterableTreeDataSource`)
  - [ ] `SortableArrayDatasource` (new, implements `IDataSource` + `ISortableDatasource`)
  - [ ] Others as needed per control audit
- [ ] Update existing datasource exports to point to new implementations where appropriate

### Phase 3: Control Refactoring

**Key Pattern**: Use type guards to detect capabilities before calling them. Hide/disable UI controls for unavailable capabilities.

- [ ] Refactor `UITableView` to delegate sorting to `ISortableDataSource.sortBy()` instead of sorting rows in component
- [ ] Refactor `UITreeView` to delegate filtering to `IFilterableTreeDataSource.filterBy()` instead of recursive `filterTree()`
- [ ] Refactor `UIMasterDetailView` to stop orchestrating filter application in UI layer; delegate to datasource capabilities
- [ ] Refactor `UIMasterDetailView` field inference and tree-data collection into datasource/capability helpers where appropriate
- [ ] Review `UIRepeater` limit/window shaping — decide if it belongs in datasource capabilities or remains a documented exception
- [ ] Review `UIGanttChart` filtering/date-range logic — move to datasource capabilities
- [ ] Add tests proving controls work without specialist capabilities (graceful degradation)

### Phase 4: Validation & Cleanup

- [ ] Run full test suite; ensure all control tests pass with minimal datasources
- [ ] Update component JSDoc examples to show capability-aware usage patterns
- [ ] Deprecate legacy component-level filtering/sorting pathways
- [ ] Add integration tests for mixed scenarios (some controls with capabilities, some without)
- [ ] Document breaking changes in changelog

## Proposed Datasource Contracts (Draft)

### Goal

- Keep base datasource contracts minimal and capability-agnostic.
- Add specialist behavior via opt-in interfaces.
- Let UI components detect and use capabilities, never own data-logic behavior.

### Core Interfaces (minimal baseline)

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

### Capability Interfaces (specialist behavior)

```ts
// Use existing types from foundation:
// import { type FilterExpression, type SortExpression } from "@theredhead/lucid-foundation";

/** Optional filtering capability. */
export interface IFilterableDataSource<T> {
  filterBy(expression: FilterExpression<T>): void;
}

/** Optional sorting capability. */
export interface ISortableDataSource<T> {
  sortBy(expression: SortExpression<T>): void;
}

/** Optional tree behavior. */
export interface ITreeDataSource<T> {
  getRootNodes(): TreeNode<T>[] | Promise<TreeNode<T>[]>;
  getChildren(node: TreeNode<T>): TreeNode<T>[] | Promise<TreeNode<T>[]>;
  hasChildren(node: TreeNode<T>): boolean;
}

/** Optional tree filtering capability. */
export interface IFilterableTreeDataSource<T> extends ITreeDataSource<T> {
  filterBy(expression: FilterExpression<T>): void;
}
```

### Standardization Rules

- UI components must only read/render/select; no filtering/sorting implementation in components.
- Data operations must flow through datasource capabilities when present.
- Components should feature-detect capabilities with explicit type guards.
- Capability method names should align with existing datasource contracts (for example `filterBy`, `sortBy`).
- If a capability is absent, the related UI control should hide/disable gracefully.

### Suggested Type Guards

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
```

`FilterExpression` should represent a simple AST

### Migration Order (incremental)

1. Finalize and publish contracts in a shared types location.
2. Add type guards and capability detection helpers.
3. Update existing base datasources to implement only minimal baseline contracts.
4. Move filtering/sorting behavior into capability datasources (`IFilterable*`, `ISortable*`).
5. Refactor master-detail tree mode to call datasource capability methods instead of applying predicates in UI code.
6. Refactor table-view and other data controls to the same capability-driven pattern.
7. Add tests that prove components do not perform filtering/sorting when capability is absent.
8. Deprecate and remove legacy component-level filtering/sorting pathways.

### Acceptance Criteria

- No UI component contains filtering/sorting algorithm logic.
- Components compile and run with minimal datasources that do not implement specialist capabilities.
- Filtering/sorting behavior is consistent across controls because it is interface-driven.
- Tree and table pathways share the same capability naming semantics.
