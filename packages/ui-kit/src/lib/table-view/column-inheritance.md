# Table View Column Inheritance and DI Forwarding

This document explains how table view columns work with Angular's dependency injection (DI) forwarding system to enable flexible column composition.

## Overview

The `UITableView` component uses Angular's DI system to discover and manage table columns. Each column type (text, badge, number, template) extends `UITableViewColumn` and provides itself via DI forwarding to make it discoverable by the parent table component.

## DI Forwarding Pattern

Every column component must provide itself as the base class token using Angular's DI `providers` array with `forwardRef`:

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

## Column Discovery

The parent `UITableView` component discovers all columns using a single `contentChildren()` query on the base class token:

```ts
columns = contentChildren(UITableViewColumn);
```

This returns all projected columns regardless of their concrete type, enabling a clean and extensible architecture.

## Column Base Class

The `UITableViewColumn` base class defines the common interface that all columns must implement:

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

## Column Types

### Text Column

```html
<ui-text-column
  key="name"
  headerText="Name"
  [truncate]="true"
  [sortable]="true"
/>
```

### Badge Column

```html
<ui-badge-column key="status" headerText="Status" variant="success" />
```

### Number Column

```html
<ui-number-column
  key="price"
  headerText="Price"
  [format]="{ maximumFractionDigits: 2 }"
  [sortable]="true"
/>
```

### Template Column

```html
<ui-template-column key="actions" headerText="Actions">
  <ng-template let-row>
    <ui-button (click)="handleClick(row)">Edit</ui-button>
  </ng-template>
</ui-template-column>
```

## Benefits of This Approach

1. **Open for Extension**: Adding new column types requires only extending `UITableViewColumn` and adding the DI forwarding. The parent table needs no changes.

2. **Type-Safe**: All columns share the base class contract, enforced by TypeScript.

3. **Single Query**: The parent maintains one `contentChildren()` call, not an ever-growing list of types.

4. **Consistent API**: All column types implement the same interface for common properties like `key`, `headerText`, and `sortable`.

## Adding New Column Types

To add a new column type:

1. Create a new component that extends `UITableViewColumn`
2. Add DI forwarding in the component's `providers` array
3. Implement the required abstract members
4. Export the component from the table view module

```ts
@Component({
  selector: "ui-date-column",
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UIDateColumn),
    },
  ],
})
export class UIDateColumn extends UITableViewColumn {
  // Implement required members
  public readonly cellTemplate: TemplateRef<UITableViewCellContext>;

  // Custom date formatting logic
  protected formatValue(value: unknown): string {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  }
}
```
