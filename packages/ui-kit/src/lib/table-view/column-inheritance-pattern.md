# Column Inheritance Pattern

This document explains the column inheritance pattern used in the table view component and how to extend it with new column types.

## Overview

The table view component uses a sophisticated inheritance and dependency injection pattern to enable flexible column composition. This pattern allows the table to work with any column type without needing to know about specific implementations.

## The Pattern

### 1. Base Column Directive

All column types extend `UITableViewColumn` which defines the common interface:

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

### 2. DI Forwarding

Each column component provides itself as the base class token using Angular's DI system:

```ts
@Component({
  selector: "ui-text-column",
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UITextColumn),
    },
  ],
})
export class UITextColumn extends UITableViewColumn {
  // Implementation
}
```

### 3. Column Discovery

The parent table component discovers all columns using a single `contentChildren()` query:

```ts
columns = contentChildren(UITableViewColumn);
```

## How It Works

1. **Column Registration**: Each column component registers itself with the DI system using `useExisting: forwardRef(() => ColumnType)`
2. **Column Discovery**: The table uses `contentChildren(UITableViewColumn)` to find all registered columns
3. **Column Usage**: The table accesses columns through the base class interface, regardless of their concrete type

## Creating New Column Types

To create a new column type, follow these steps:

### Step 1: Create the Component

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
  public readonly cellTemplate = this.templateRef;

  // Custom date formatting logic
  protected formatValue(value: unknown): string {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  }
}
```

### Step 2: Implement Required Members

All column types must implement:

- `cellTemplate` (readonly TemplateRef)
- Any custom formatting logic
- Proper DI forwarding

### Step 3: Use in Templates

```html
<ui-table-view [datasource]="datasource">
  <ui-date-column key="createdDate" headerText="Created" />
</ui-table-view>
```

## Benefits of This Pattern

### 1. Open/Closed Principle

New column types can be added without modifying existing code.

### 2. Type Safety

All columns share the same base interface, enforced by TypeScript.

### 3. Single Query

The parent table maintains one `contentChildren()` call, not an ever-growing list.

### 4. Extensibility

The pattern supports complex column behaviors while maintaining simplicity.

## Common Column Patterns

### Text Column

```ts
@Component({
  selector: "ui-text-column",
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UITextColumn),
    },
  ],
})
export class UITextColumn extends UITableViewColumn {
  public truncate = input<boolean>(false);

  public readonly cellTemplate = this.templateRef;
}
```

### Badge Column

```ts
@Component({
  selector: "ui-badge-column",
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UIBadgeColumn),
    },
  ],
})
export class UIBadgeColumn extends UITableViewColumn {
  public variant = input<string>("default");

  public readonly cellTemplate = this.templateRef;
}
```

### Template Column

```ts
@Component({
  selector: "ui-template-column",
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UITemplateColumn),
    },
  ],
})
export class UITemplateColumn extends UITableViewColumn {
  public readonly cellTemplate = this.templateRef;
}
```

## Best Practices

1. **Always Use DI Forwarding**: Every column component must provide itself as the base class
2. **Maintain Interface Consistency**: All columns should implement the same base interface
3. **Handle Null Values**: Column implementations should gracefully handle null/undefined values
4. **Use Signals**: Leverage Angular signals for reactive properties
5. **Document Custom Properties**: Clearly document any custom properties or behaviors

## Troubleshooting

### Common Issues

1. **Column Not Found**: Ensure the component provides itself via DI forwarding
2. **Type Errors**: Verify all columns implement the required base interface
3. **Template Issues**: Make sure `cellTemplate` is properly initialized

### Debugging Tips

```ts
// In the table component, you can debug column discovery:
ngAfterViewInit() {
  console.log('Discovered columns:', this.columns());
}
```

This pattern provides a clean, extensible way to build table views with flexible column composition while maintaining type safety and performance.
