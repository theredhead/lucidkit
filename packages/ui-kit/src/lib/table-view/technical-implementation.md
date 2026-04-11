# Technical Implementation Details

This document explains the technical implementation patterns used in the table view component and its column system.

## Column Discovery Mechanism

The table view uses Angular's `contentChildren()` with DI forwarding to discover all projected columns:

```ts
columns = contentChildren(UITableViewColumn);
```

This approach allows the table to work with any column type without needing to know about specific column implementations.

## DI Forwarding Implementation

Each column component must provide itself as the base class token:

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
export class UITextColumn extends UITableViewColumn { ... }
```

## Column Base Class Structure

The `UITableViewColumn` base class defines the common contract:

```ts
@Directive({
  standalone: true,
})
export abstract class UITableViewColumn {
  public headerText = input<string>("");
  public key = input.required<string>();
  public sortable = input<boolean>(false);
  public abstract readonly cellTemplate: TemplateRef<UITableViewCellContext>;

  protected getValue(row: unknown): unknown {
    return (row as Record<string, unknown>)[this.key()];
  }
}
```

## Column Template Resolution

Each column type implements its own cell template resolution:

```ts
// In UITextColumn
public readonly cellTemplate = this.templateRef;

// In UITemplateColumn
public readonly cellTemplate = this.templateRef;
```

## Column Data Flow

1. Table queries all columns via `contentChildren(UITableViewColumn)`
2. Each column provides its `cellTemplate` and metadata
3. Table uses column metadata to render headers and configure sorting
4. Data is accessed via the column's `key` property
5. Cell templates are rendered with the appropriate context

## Virtual Scrolling Integration

The table view supports both plain and virtual scrolling strategies:

```ts
// Plain strategy
<ui-plain-table-body [datasource]="datasource" />

// CDK virtual strategy
<ui-cdk-virtual-table-body [datasource]="datasource" />
```

## Selection Model Integration

The table view integrates with the selection model system:

```ts
// Selection model can be provided to the table
<ui-table-view
  [selectionModel]="selectionModel"
  selectionMode="multiple"
  (selectionChange)="onSelectionChange($event)" />
```

## Column Resizing

Column resizing is handled through a service that persists widths:

```ts
// Column resize events are emitted and handled
protected onColumnResize(event: ColumnResizeEvent): void {
  const current = { ...this.columnWidths() };
  current[event.key] = event.widthPx;
  this.columnWidths.set(current);

  // Persist to localStorage if we have a tableId
  const id = this.tableId();
  if (id) {
    const map = new Map<string, number>(Object.entries(current));
    this.resizeService.save(id, map);
  }
}
```

## Keyboard Navigation

The table view supports keyboard navigation:

```ts
protected onKeydown(event: KeyboardEvent): void {
  const rows = this.sortedRows();
  if (rows.length === 0) return;

  let idx = this.activeIndex();

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      idx = Math.min(idx + 1, rows.length - 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      idx = Math.max(idx - 1, 0);
      break;
    case "Home":
      event.preventDefault();
      idx = 0;
      break;
    case "End":
      event.preventDefault();
      idx = rows.length - 1;
      break;
    default:
      return;
  }

  this.activeIndex.set(idx);
  // ... selection logic
}
```

## Responsive Design

The table view handles responsive design through:

1. CSS custom properties for layout
2. Scroll synchronization between header and body
3. Adaptive column widths
4. Density control via `uiDensity` directive

## Data Source Integration

The table view works with various data source types:

```ts
// Filterable data source
const filterableDs = new FilterableArrayDatasource(data);
filterableDs.filterBy(expression);

// Sortable data source
const sortableDs = new FilterableArrayDatasource(data);
sortableDs.sortBy(expression);

// Pageable data source
const pageableDs = new FilterableArrayDatasource(data);
pageableDs.setPageIndex(0);
```

## Error Handling

The table view includes robust error handling:

```ts
// Null row handling
protected onRowClick(row: unknown): void {
  if (row === null) return; // still loading
  // ... rest of logic
}

// Async data loading
effect(() => {
  const rows = this.adapter().getRows();
  if (rows) {
    this.resolvedRows.set(rows);
  }
});
```

## Performance Optimizations

1. **Signal-based reactivity**: Uses Angular signals for efficient change detection
2. **Virtual scrolling**: For large datasets
3. **Column width persistence**: Saves column widths between sessions
4. **Efficient DOM updates**: Minimizes unnecessary re-renders
5. **ResizeObserver**: Efficiently handles layout changes
