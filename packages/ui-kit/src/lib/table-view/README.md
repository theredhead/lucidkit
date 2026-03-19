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

## Datasource Model

`UITableView` requires `datasource` input of type `DatasourceAdapter<T>`.

`DatasourceAdapter` provides:

- `pageIndex` signal
- `pageSize` signal
- `totalItems` signal
- `visibleWindow` computed rows in the current page

Rows can be synchronous or asynchronous (`T | Promise<T>`). `UITableView` resolves visible rows before rendering.

## Rendering Flow

1. `UITableView` discovers projected columns via `contentChildren(UITableViewColumn)`.
2. Header renders column labels and emits sort state.
3. Body renders rows with `cdk-virtual-scroll-viewport` and delegates each cell to `column.cellTemplate`.
4. Footer updates page index through the datasource adapter.
5. Sorting is applied client-side on currently resolved visible rows.

## Example Usage

```html
<ui-table-view [datasource]="adapter">
  <ui-text-column key="name" headerText="Name" [sortable]="true" />
  <ui-text-column key="email" headerText="Email" [truncate]="true" />
  <ui-badge-column key="status" headerText="Status" variant="success" />
</ui-table-view>
```

```ts
const adapter = new DatasourceAdapter(new ArrayDatasource(users));
```

### Density

Use the shared `uiDensity` directive to control component density consistently:

```html
<ui-table-view uiDensity="compact" [datasource]="adapter">
  <ui-text-column key="name" headerText="Name" />
</ui-table-view>
```

### Hide built-in paginator

Set `showBuiltInPaginator` to `false` when you want to provide external pagination controls.

```html
<ui-table-view [datasource]="adapter" [showBuiltInPaginator]="false">
  <ui-text-column key="name" headerText="Name" [sortable]="true" />
</ui-table-view>
```

## Notes

- The body uses CDK virtual scrolling for viewport performance.
- `UITableBody` does not switch on column type; it renders each column instance's own `cellTemplate`.
- Add new column types by extending `UITableViewColumn`; no container changes required.
- `JsonPlaceholder*Datasource` classes are for Storybook/demo scenarios only and are not intended as production application data adapters.
- Built-in paginator is optional via `showBuiltInPaginator` (defaults to `true`).
