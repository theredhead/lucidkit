# ADR-0013: Simple Extensible Datasource Architecture

## Status

Accepted

## Context

Data-displaying UI controls (table, tree, repeater, Gantt chart, calendar) all
need data, but they each have very different requirements:

- A **table** needs indexed row access, optional sorting and filtering.
- A **tree** needs hierarchical traversal: root nodes, children, leaf detection.
- A **Gantt chart** needs tasks with date ranges and dependency links.
- A **calendar** needs date-bucketed events.
- An **autocomplete** needs query-driven suggestion lists.

Early prototypes embedded data-shaping logic (sorting, filtering, recursive tree
pruning) directly inside UI components. This created several problems:

1. **Duplication:** Every data component reimplemented the same sort/filter
   algorithms.
2. **Tight coupling:** Components could not work with server-side data
   operations — they always sorted/filtered in-memory.
3. **Testing burden:** Each component's tests had to cover both rendering and
   data logic.
4. **Inconsistency:** The table sorted differently from the tree, which filtered
   differently from the repeater.

## Decision

Adopt a **simple, extensible datasource architecture** built on three
principles:

### 1. Minimal base contract

The root interface is deliberately small — only what every data consumer needs:

```ts
interface IDatasource<T> {
  getNumberOfItems(): number | Promise<number>;
  getObjectAtRowIndex(index: number): T | Promise<T>;
}
```

Any object that implements these two methods can power a `UITableView` or
`UIRepeater`. No sorting. No filtering. No paging. Just "how many items?" and
"give me item N."

### 2. Opt-in capability interfaces

Additional behaviour is added through small, focused interfaces:

| Interface                      | Methods                                            | Purpose                          |
| ------------------------------ | -------------------------------------------------- | -------------------------------- |
| `ISortableDatasource<T>`       | `sortBy(expression)`                               | Server- or client-side sorting   |
| `IFilterableDatasource<T>`     | `filterBy(expression)`                             | Server- or client-side filtering |
| `IActiveDatasource<T>`         | Row-change notification signals                    | Live-updating data               |
| `ITreeDatasource<T>`           | `getRootNodes()`, `getChildren()`, `hasChildren()` | Hierarchical data                |
| `IFilterableTreeDatasource<T>` | Tree + `filterBy()`                                | Filtered hierarchical data       |
| `ISortableTreeDatasource<T>`   | Tree + `sortBy()`                                  | Sorted hierarchical data         |
| `AutocompleteDatasource<T>`    | `completeFor(query, selection)`                    | Query-driven suggestions         |

A datasource can implement any combination of these. A `RestDatasource` might
implement sorting and filtering (delegating to query parameters). An
`ArrayDatasource` implements none of them — it just serves rows.

### 3. UI components never own data logic

Components are **consumers**, not **processors**, of data:

- Components accept `IDatasource<T>` (or a domain-specific contract like
  `ITreeDatasource<T>`) as input.
- Before calling a capability method, components use **type guards** to check
  whether the datasource supports it.
- If unsupported, the component hides or disables the related UI affordance
  (e.g. no sort arrows, no filter bar).
- Components never sort arrays, filter trees, or shape data themselves.

### Shipped implementations

The library provides ready-made datasource classes for common scenarios:

| Class                              | Capabilities                                       |
| ---------------------------------- | -------------------------------------------------- |
| `ArrayDatasource<T>`               | Base only (read-only array)                        |
| `SortableArrayDatasource<T>`       | Base + sorting                                     |
| `FilterableArrayDatasource<T>`     | Base + filtering (compiled predicates)             |
| `RestDatasource<T>`                | Base + lazy page loading from REST endpoint        |
| `ArrayTreeDatasource<T>`           | Tree (in-memory hierarchy)                         |
| `FilterableArrayTreeDatasource<T>` | Tree + filtering                                   |
| `SortableArrayTreeDatasource<T>`   | Tree + sorting                                     |
| `GanttArrayDatasource`             | Domain-specific (tasks, dependencies, date ranges) |
| `ArrayCalendarDatasource`          | Domain-specific (date-bucketed events)             |

Consumers pick the datasource class that matches their needs, or implement the
interfaces for custom backends.

### Standardisation rules

1. UI components must only read, render, and select — no filtering/sorting
   algorithm logic.
2. Data operations flow through datasource capabilities.
3. Feature detection via type guards — always check before calling.
4. Consistent naming — `filterBy`, `sortBy` across all implementations.
5. Graceful degradation — absent capabilities disable related UI.

## Consequences

### Positive

- **Simplicity:** A consumer with an array of objects can call
  `new ArrayDatasource(items)` and be done. Two lines of code to power a table.
- **Extensibility:** Adding a new capability (e.g. `IGroupableDatasource`) is
  additive — existing datasources and components are unaffected.
- **Backend flexibility:** The same `UITableView` works with an in-memory array,
  a REST API, a WebSocket stream, or a GraphQL resolver — as long as the
  datasource implements the contract.
- **No data logic in UI:** Components are smaller, easier to test, and
  consistent with each other because none of them contain sort/filter algorithms.
- **Async-ready:** All base methods return `T | Promise<T>`, so
  lazy-loading datasources work without a different API.

### Negative

- **Indirection:** Consumers must create a datasource object rather than passing
  a plain array. The extra line is intentional — it makes the data contract
  explicit — but it is more ceremony than `[data]="items"`.
- **Type guard overhead:** Capability detection at runtime means a typo in a
  custom datasource (e.g. `filterby` instead of `filterBy`) passes TypeScript
  compilation but fails the type guard silently.
- **Interface proliferation:** Each new capability adds an interface, a type
  guard, and potentially a concrete implementation. This is manageable but grows
  with the library.

## Related

- [ADR-0002](0002-datasource-capability-detection.md) — focuses on the type
  guard detection mechanism specifically.
- [DATASOURCE-ARCHITECTURE.md](../../DATASOURCE-ARCHITECTURE.md) — detailed
  specification document with migration plan and acceptance criteria.
