# ADR-0002: Datasource Capability Detection via Type Guards

## Status

Accepted

## Context

Data-displaying components (table, tree, repeater, autocomplete) need to support
a range of data operations — sorting, filtering, paging, hierarchical
navigation — but not every datasource implementation provides all of them. A
simple in-memory array has no server-side sort; a REST endpoint may not support
filtering.

We needed an approach that:

1. Keeps the base datasource contract minimal so trivial use cases stay simple.
2. Lets advanced datasources opt-in to capabilities without bloating the
   interface.
3. Allows UI components to gracefully degrade when a capability is absent.

## Decision

We define a **minimal base interface** (`IDatasource<T>`) with only two methods:

```ts
interface IDatasource<T> {
  getNumberOfItems(): number | Promise<number>;
  getObjectAtRowIndex(index: number): T | Promise<T>;
}
```

Specialist behaviour is added via **opt-in capability interfaces**:

- `ISortableDatasource<T>` — adds `sortBy(expression)`
- `IFilterableDatasource<T>` — adds `filterBy(expression)`
- `IActiveDatasource<T>` — adds row-change notification signals
- `ITreeDatasource<T>` — adds `getRootNodes()`, `getChildren()`, `hasChildren()`

UI components accept the base `IDatasource<T>` and use **runtime type guards**
to detect and consume additional capabilities:

```ts
if (isSortableDatasource(ds)) {
  ds.sortBy(expression); // safe — type-narrowed
}
```

Type guards are shipped from `@theredhead/lucid-foundation`:

- `isSortableDatasource()`
- `isFilterableDatasource()`
- `isTreeDatasource()`
- `isFilterableTreeDatasource()`
- `isSortableTreeDatasource()`

## Consequences

### Positive

- **Low barrier to entry:** A consumer can pass a plain `ArrayDatasource` with
  no sorting or filtering, and the table still renders correctly.
- **Progressive enhancement:** Swapping to a `FilterableArrayDatasource` or
  `RestDatasource` enables sorting/filtering UI automatically — no component
  configuration changes.
- **Open/Closed Principle:** New capabilities can be added as new interfaces
  and type guards without modifying existing datasource contracts or components.
- **Testability:** Components can be tested with minimal stub datasources.

### Negative

- **Runtime checks:** Capability detection happens at runtime via duck-typing
  guards rather than compile-time type enforcement. A badly implemented
  datasource could pass the guard but fail at runtime.
- **Discoverability:** Consumers must know which capability interfaces exist
  and which concrete datasource classes implement them.
