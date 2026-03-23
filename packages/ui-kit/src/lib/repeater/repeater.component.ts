import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  signal,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import type { IDatasource } from "../table-view/datasources/datasource";
import { DatasourceAdapter } from "../table-view/datasources/datasource-adapter";
import type { RepeaterItemContext } from "./repeater.types";

/**
 * A layout-agnostic repeater that renders a consumer-provided template
 * for each item in a datasource.
 *
 * Accepts the same {@link IDatasource} implementations used by
 * `<ui-table-view>` (e.g. `ArrayDatasource`, `FilterableArrayDatasource`,
 * `SortableArrayDatasource`, `RestDatasource`), wrapping them in a
 * {@link DatasourceAdapter} internally.
 *
 * The host element imposes **no layout constraints** — the consumer
 * controls all styling via the template and/or CSS on the host.
 *
 * @example
 * Basic usage:
 * ```html
 * <ui-repeater [datasource]="kittens">
 *   <ng-template let-item let-i="index">
 *     <img [src]="item.url" [alt]="item.name" />
 *   </ng-template>
 * </ui-repeater>
 * ```
 *
 * @example
 * With filtering:
 * ```ts
 * import { FilterableArrayDatasource } from '@theredhead/foundation';
 *
 * const ds = new FilterableArrayDatasource(items);
 * ds.filterBy([{ predicate: item => item.active }]);
 * ```
 *
 * @example
 * With sorting:
 * ```ts
 * import { SortableArrayDatasource } from '@theredhead/foundation';
 *
 * const ds = new SortableArrayDatasource(items);
 * ds.applyComparator((a, b) => a.name.localeCompare(b.name));
 * ```
 */
@Component({
  selector: "ui-repeater",
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: "./repeater.component.html",
  styleUrl: "./repeater.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-repeater",
  },
})
export class UIRepeater<T = unknown> {
  /**
   * The datasource providing items.
   * Any {@link IDatasource} implementation is accepted.
   */
  public readonly datasource = input.required<IDatasource<T>>();

  /**
   * Maximum number of items to render at once.
   * Defaults to `Infinity` (render all items).
   * Useful when you want to show only the first N items.
   */
  public readonly limit = input(Infinity);

  /** Accessible label for the repeater container. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal — the projected item template. */
  public readonly itemTemplate =
    contentChild.required<TemplateRef<RepeaterItemContext<T>>>(TemplateRef);

  /** @internal — adapter wrapping the datasource for signal-based access. */
  protected readonly adapter = signal<DatasourceAdapter<T> | null>(null);

  /** @internal — resolved items ready for rendering. */
  protected readonly items = signal<T[]>([]);

  /** @internal — total item count from the datasource. */
  protected readonly totalItems = computed(
    () => this.adapter()?.totalItems() ?? 0,
  );

  public constructor() {
    // Rebuild adapter when datasource changes
    effect(() => {
      const ds = this.datasource();
      const limit = this.limit();
      const pageSize = Number.isFinite(limit) ? limit : 100_000;
      const adapter = new DatasourceAdapter<T>(ds, pageSize);
      this.adapter.set(adapter);
    });

    // Resolve visible window into concrete items
    effect(() => {
      const adapter = this.adapter();
      if (!adapter) {
        this.items.set([]);
        return;
      }

      const window = adapter.visibleWindow();
      const limit = this.limit();
      const capped = Number.isFinite(limit) ? window.slice(0, limit) : window;

      // Resolve synchronous items immediately, collect promises
      const resolved: T[] = [];
      const promises: Promise<void>[] = [];

      for (let i = 0; i < capped.length; i++) {
        const rowResult = capped[i];
        if (rowResult instanceof Promise) {
          promises.push(
            rowResult.then((value) => {
              resolved[i] = value;
            }),
          );
        } else {
          resolved[i] = rowResult;
        }
      }

      if (promises.length === 0) {
        this.items.set(resolved);
      } else {
        Promise.all(promises).then(() => {
          this.items.set([...resolved]);
        });
      }
    });
  }

  /** Build template context for an item at a given index. */
  protected buildContext(item: T, index: number): RepeaterItemContext<T> {
    const items = this.items();
    const adapter = this.adapter();
    const offset = adapter ? adapter.pageIndex() * adapter.pageSize() : 0;

    return {
      $implicit: item,
      index,
      absoluteIndex: offset + index,
      first: index === 0,
      last: index === items.length - 1,
      even: index % 2 === 0,
      odd: index % 2 !== 0,
    };
  }
}
