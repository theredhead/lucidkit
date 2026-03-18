import {
  Directive,
  input,
  effect,
  inject,
  signal,
  ViewContainerRef,
  Injector,
  EmbeddedViewRef,
} from "@angular/core";
import { UITableView } from "../table-view.component";
import { UIAutogenerateColumns } from "./autogenerate-columns.component";

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

  private currentViewRef: EmbeddedViewRef<unknown> | null = null;
  private firstRowSignal = signal<Record<string, unknown> | null>(null);

  public constructor() {
    // Watch for datasource changes and extract first row
    effect(
      () => {
        const adapter = this.table.datasource();
        if (!adapter) {
          this.firstRowSignal.set(null);
          return;
        }

        const totalItems = adapter.totalItems();
        if ((totalItems ?? 0) === 0) {
          this.firstRowSignal.set(null);
          return;
        }

        try {
          // Try to get the first row from the underlying datasource
          const row = adapter.datasource.getObjectAtRowIndex(0);
          if (row && typeof row === "object" && "kind" in row) {
            // RowResult type — extract the actual value
            this.firstRowSignal.set(row.value ?? null);
          } else {
            this.firstRowSignal.set(null);
          }
        } catch {
          this.firstRowSignal.set(null);
        }
      },
      { allowSignalWrites: true },
    );

    // Create and manage the autogenerate component
    effect(() => {
      const firstRow = this.firstRowSignal();
      const config = this.config();

      // Clean up existing view
      if (this.currentViewRef) {
        this.currentViewRef.destroy();
        this.currentViewRef = null;
      }

      // Only create component if we have a first row
      if (!firstRow) {
        return;
      }

      const componentRef = this.viewContainer.createComponent(
        UIAutogenerateColumns,
        { injector: this.injector },
      );

      componentRef.setInput("row", firstRow);
      componentRef.setInput("humanizeHeaders", config?.humanizeHeaders ?? true);
      componentRef.setInput("headerMap", config?.headerMap ?? {});
      componentRef.setInput("excludeKeys", config?.excludeKeys ?? []);

      componentRef.changeDetectorRef.markForCheck();
      this.currentViewRef = componentRef.hostView;
    });
  }
}
