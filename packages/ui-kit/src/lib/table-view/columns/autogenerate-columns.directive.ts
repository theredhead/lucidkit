import {
  Directive,
  input,
  effect,
  inject,
  signal,
  ViewContainerRef,
  Injector,
  ComponentRef,
  DestroyRef,
} from "@angular/core";
import { UITableView } from "../table-view.component";
import { UITextColumnGenerated } from "./autogenerate-columns.component";
import { UITableViewColumn } from "./table-column.directive";
import { humanizeKey } from "../../filter/infer-filter-fields";

/**
 * Directive that automatically generates table columns based on the first row's properties.
 *
 * Instead of manually declaring columns, attach this directive to the table and it will
 * introspect the datasource and create text columns for each property.
 *
 * @example
 * ```html
 * <ui-table-view [datasource]="adapter" uiAutogenerateColumns></ui-table-view>
 * ```
 *
 * With options:
 * ```html
 * <ui-table-view
 *   [datasource]="adapter"
 *   [uiAutogenerateColumns]="options"
 * ></ui-table-view>
 * ```
 */
@Directive({
  selector: "[uiAutogenerateColumns]",
  standalone: true,
})
export class UIAutogenerateColumnsDirective {
  /**
   * Configuration for column auto-generation.
   */
  public readonly config = input<{
    humanizeHeaders?: boolean;
    headerMap?: Record<string, string>;
    excludeKeys?: string[];
  } | null>(null, { alias: "uiAutogenerateColumns" });

  private readonly table = inject(UITableView);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  private columnRefs: ComponentRef<UITextColumnGenerated>[] = [];
  private firstRowSignal = signal<Record<string, unknown> | null>(null);

  public constructor() {
    // Watch for datasource changes and extract first row
    effect(() => {
      const ds = this.table.datasource();
      if (!ds) {
        this.firstRowSignal.set(null);
        return;
      }

      const totalItems = ds.getNumberOfItems();
      if (totalItems === null || totalItems === 0) {
        this.firstRowSignal.set(null);
        return;
      }

      try {
        const row = ds.getObjectAtRowIndex(0);
        if (row instanceof Promise) {
          void row
            .then((resolved) => {
              this.firstRowSignal.set(resolved ?? null);
            })
            .catch(() => {
              this.firstRowSignal.set(null);
            });
        } else if (row && typeof row === "object") {
          this.firstRowSignal.set(row as Record<string, unknown>);
        } else {
          this.firstRowSignal.set(null);
        }
      } catch {
        this.firstRowSignal.set(null);
      }
    });

    // Create column component instances and push them into the table
    effect(() => {
      const firstRow = this.firstRowSignal();
      const config = this.config();

      // Destroy previous columns
      this.destroyColumns();

      if (!firstRow || typeof firstRow !== "object") {
        this.table.dynamicColumns.set([]);
        return;
      }

      const exclude = new Set(config?.excludeKeys ?? []);
      const headerMap = config?.headerMap ?? {};
      const shouldHumanize = config?.humanizeHeaders ?? true;

      const keys = Object.keys(firstRow)
        .filter((key) => !exclude.has(key))
        .sort();

      const columns: UITableViewColumn[] = [];

      for (const key of keys) {
        const headerText =
          headerMap[key] || (shouldHumanize ? humanizeKey(key) : key);

        const ref = this.viewContainer.createComponent(UITextColumnGenerated, {
          injector: this.injector,
        });

        ref.setInput("key", key);
        ref.setInput("headerText", headerText);
        ref.changeDetectorRef.detectChanges();

        this.columnRefs.push(ref);
        columns.push(ref.instance);
      }

      // Push column instances into the table's dynamic columns signal
      this.table.dynamicColumns.set(columns);
    });

    // Clean up on destroy
    this.destroyRef.onDestroy(() => {
      this.destroyColumns();
      this.table.dynamicColumns.set([]);
    });
  }

  private destroyColumns(): void {
    for (const ref of this.columnRefs) {
      ref.destroy();
    }
    this.columnRefs = [];
  }
}
