# UITableView

An extensible, headless table composed from three child components:

- `ui-table-header`
- `ui-table-body`
- `ui-table-footer`

It is built on a base column directive contract and a datasource adapter, not on top of any existing table component.

## Architecture

```text
UITableView (container)
  |- UITableHeader (sorting UI)
  |- UITableBody (rows + CDK virtual scroll viewport)
  |- UITableFooter (pagination controls)
  |
  |- contentChildren(UITableViewColumn)
       |- UITextColumn
       |- UIBadgeColumn
       |- ...future column types
```

## Column Contract

`UITableViewColumn` is the base directive all concrete columns extend.

```ts
@Directive({ standalone: true })
export abstract class UITableViewColumn {
  headerText = input<string>("");
  key = input.required<string>();
  sortable = input<boolean>(false);
  abstract readonly cellTemplate: TemplateRef<UITableViewCellContext>;
}
```

Concrete implementations currently available:

- `UITextColumn` (`ui-text-column`) with `truncate`
- `UIBadgeColumn` (`ui-badge-column`) with `variant`
- `UINumberColumn` (`ui-number-column`) with locale/format options

## Column Inheritance Pattern

The table view uses Angular's dependency injection (DI) forwarding system to enable flexible column composition. All column types extend `UITableViewColumn` and provide themselves via DI forwarding using `forwardRef` to make them discoverable by the parent table component through a single `contentChildren()` query on the base class token. This pattern allows for extensibility - new column types can be added without modifying the parent table component, as long as they follow the DI forwarding pattern.

## Datasource Model

`UITableView` requires a `datasource` input that implements `IDatasource<T>`. The built-in implementations are:

- `ArrayDatasource<T>` — wraps a plain array (from `@theredhead/lucid-foundation`)
- `FilterableArrayDatasource<T>` — array datasource with built-in filter support
- `JsonPlaceholderDatasource<T>` — for Storybook/demo scenarios only, not for production use

Rows can be synchronous or asynchronous (`T | Promise<T>`). `UITableView` resolves visible rows before rendering.

## Rendering Flow

1. `UITableView` discovers projected columns via `contentChildren(UITableViewColumn)`.
2. Header renders column labels and emits sort state.
3. Body renders rows with `cdk-virtual-scroll-viewport` and delegates each cell to `column.cellTemplate`.
4. Footer updates page index through the datasource adapter.
5. Sorting is applied client-side on currently resolved visible rows.

## Example Usage

```ts
import { ArrayDatasource } from "@theredhead/lucid-foundation";

export class MyComponent {
  protected readonly datasource = new ArrayDatasource(users);
}
```

```html
<ui-table-view [datasource]="datasource">
  <ui-text-column key="name" headerText="Name" [sortable]="true" />
  <ui-text-column key="email" headerText="Email" [truncate]="true" />
  <ui-badge-column key="status" headerText="Status" variant="success" />
</ui-table-view>
```

### Density

Use the shared `uiDensity` directive to control component density consistently:

```html
<ui-table-view uiDensity="compact" [datasource]="datasource">
  <ui-text-column key="name" headerText="Name" />
</ui-table-view>
```

### Hide built-in paginator

Set `showBuiltInPaginator` to `false` when you want to provide external pagination controls.

```html
<ui-table-view [datasource]="datasource" [showBuiltInPaginator]="false">
  <ui-text-column key="name" headerText="Name" [sortable]="true" />
</ui-table-view>
```

## Notes

- The body uses CDK virtual scrolling for viewport performance.
- `UITableBody` does not switch on column type; it renders each column instance's own `cellTemplate`.
- Add new column types by extending `UITableViewColumn`; no container changes required.
- `JsonPlaceholder*Datasource` classes are for Storybook/demo scenarios only and are not intended as production application data adapters.
- Built-in paginator is optional via `showBuiltInPaginator` (defaults to `true`).
