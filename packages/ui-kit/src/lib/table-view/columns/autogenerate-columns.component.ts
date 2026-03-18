import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  TemplateRef,
  ViewChild,
} from "@angular/core";

import {
  UITableViewCellContext,
  UITableViewColumn,
} from "./table-column.directive";

/**
 * Converts a camelCase or snake_case property name into a human-readable label.
 *
 * @example
 * humanizeKey('firstName')    // 'First Name'
 * humanizeKey('first_name')   // 'First Name'
 * humanizeKey('id')           // 'Id'
 *
 * @internal
 */
export function humanizeKey(key: string): string {
  return (
    key
      // Convert camelCase to spaces: firstName → First Name
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Convert snake_case to spaces: first_name → first name
      .replace(/_/g, " ")
      // Title case each word
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}

/**
 * Internal text column component used by UIAutogenerateColumns.
 * Not meant for direct use.
 *
 * @internal
 */
@Component({
  selector: "ui-text-column-generated",
  standalone: true,
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UITextColumnGenerated),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #cell let-row>{{ getValue(row) }}</ng-template>`,
})
export class UITextColumnGenerated extends UITableViewColumn {
  @ViewChild("cell", { static: true })
  public readonly cellTemplate!: TemplateRef<UITableViewCellContext>;

  public override getValue(row: unknown): string {
    return String(super.getValue(row) ?? "");
  }
}

/**
 * Dynamically generates text columns from a datasource row's properties.
 *
 * This component automatically introspects the first available row and creates
 * a `UITextColumn` for each property (key). This eliminates the need to manually
 * declare columns when you want to show all properties with basic text rendering.
 *
 * Properties are sorted alphabetically for consistent column ordering.
 *
 * @example
 * ```html
 * <!-- Instead of declaring columns manually -->
 * <ui-table-view [datasource]="adapter">
 *   <ui-text-column key="name" headerText="Name"></ui-text-column>
 *   <ui-text-column key="email" headerText="Email"></ui-text-column>
 *   <ui-text-column key="age" headerText="Age"></ui-text-column>
 * </ui-table-view>
 *
 * <!-- Use auto-generation -->
 * <ui-table-view [datasource]="adapter" uiAutogenerateColumns></ui-table-view>
 * ```
 */
@Component({
  selector: "ui-autogenerate-columns",
  standalone: true,
  imports: [UITextColumnGenerated],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (col of generatedColumns(); track col.key) {
      <ui-text-column-generated [key]="col.key" [headerText]="col.headerText" />
    }
  `,
})
export class UIAutogenerateColumns {
  /**
   * The row data to introspect. This is typically a signal that emits
   * the first available row from your datasource.
   *
   * If no row is provided, no columns will be generated.
   */
  public readonly row = input<Record<string, unknown> | null>(null);

  /**
   * Whether to use humanized header text (space-separated, title-cased).
   * Defaults to true.
   *
   * @example
   * Property "firstName" becomes "First Name"
   */
  public readonly humanizeHeaders = input<boolean>(true);

  /**
   * Custom header text mapping. When a property key matches an entry,
   * that custom text is used instead of the property key (or humanized version).
   *
   * @example
   * ```ts
   * headerMap: { firstName: 'Given Name', lastName: 'Family Name' }
   * ```
   */
  public readonly headerMap = input<Record<string, string>>({});

  /**
   * Properties to skip when generating columns. Useful for filtering out
   * internal or metadata properties.
   *
   * @example
   * excludeKeys: ['id', '_internal', 'metadata']
   */
  public readonly excludeKeys = input<string[]>([]);

  protected readonly generatedColumns = computed(() => {
    const rowData = this.row();
    if (!rowData || typeof rowData !== "object") {
      return [];
    }

    const exclude = new Set(this.excludeKeys());
    const headerMap = this.headerMap();
    const shouldHumanize = this.humanizeHeaders();

    return Object.keys(rowData)
      .filter((key) => !exclude.has(key))
      .sort()
      .map((key) => {
        const headerText =
          headerMap[key] || (shouldHumanize ? humanizeKey(key) : key);
        return { key, headerText };
      });
  });
}
