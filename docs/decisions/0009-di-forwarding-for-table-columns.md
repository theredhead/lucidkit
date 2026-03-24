# ADR-0009: DI Forwarding for Table-View Columns

## Status

Accepted

## Context

`UITableView` needs to discover the column definitions projected into its
content by consumers:

```html
<ui-table-view [datasource]="ds">
  <ui-text-column header="Name" field="name" />
  <ui-badge-column header="Status" field="status" />
  <ui-template-column header="Actions">
    <ng-template let-row>…</ng-template>
  </ui-template-column>
</ui-table-view>
```

Each column type (`UITextColumn`, `UIBadgeColumn`, `UINumberColumn`,
`UITemplateColumn`) is a separate component class. The parent table needs to
query all of them uniformly via `contentChildren()`.

Angular's `contentChildren()` query matches by **token** — if each column type
is a different class, a single query cannot find them all without listing every
type explicitly. Adding a new column type would require updating the parent
query, violating the Open/Closed Principle.

## Decision

Every column component **provides itself as the base class** via Angular's DI
`providers` array and `forwardRef`:

```ts
@Component({
  selector: 'ui-text-column',
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UITextColumn),
    },
  ],
})
export class UITextColumn extends UITableViewColumn { … }
```

The parent `UITableView` queries the base class token:

```ts
columns = contentChildren(UITableViewColumn);
```

This returns all projected columns regardless of concrete type.

## Consequences

### Positive

- **Open for extension:** Adding a new column type (e.g. `UIDateColumn`)
  requires only extending `UITableViewColumn` and adding the `providers`
  forwarding. The parent table needs no changes.
- **Type-safe:** All columns share the base class contract (`header`,
  `field`, `cellTemplate`, `width`, etc.), enforced by TypeScript.
- **Single query:** The parent maintains one `contentChildren()` call, not an
  ever-growing list of types.

### Negative

- **Inheritance coupling:** Column types must extend `UITableViewColumn`. This
  is a concrete class hierarchy, not a lightweight interface.
- **DI boilerplate:** Every column component must include the `providers`
  forwarding. Forgetting it means the column silently will not be discovered.
- **`forwardRef` indirection:** Required because the class is referenced before
  it is defined in the decorator metadata. This is standard Angular practice
  but adds cognitive overhead.
