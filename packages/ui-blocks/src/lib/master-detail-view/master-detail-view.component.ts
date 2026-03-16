import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  input,
  output,
  signal,
  TemplateRef,
  untracked,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import {
  ArrayDatasource,
  DatasourceAdapter,
  SelectionModel,
  UIIcon,
  UIIcons,
  UITableView,
  UITableViewColumn,
} from "@theredhead/ui-kit";

/**
 * Context provided to the detail template.
 *
 * @typeParam T - The row object type.
 */
export interface MasterDetailContext<T> {
  /** The selected item (also available as `let-object`). */
  $implicit: T;
}

/**
 * A master-detail layout that shows a list of items in a
 * {@link UITableView} and renders a detail template for the
 * currently selected item.
 *
 * ### Basic usage
 * ```html
 * <ui-master-detail-view [data]="items">
 *   <ui-text-column key="name" headerText="Name" />
 *   <ui-text-column key="email" headerText="Email" />
 *
 *   <ng-template #detail let-object>
 *     <h3>{{ object.name }}</h3>
 *     <p>{{ object.email }}</p>
 *   </ng-template>
 * </ui-master-detail-view>
 * ```
 *
 * ### With filter
 * ```html
 * <ui-master-detail-view [data]="items" [showFilter]="true">
 *   <ng-template #filter>
 *     <ui-filter [fields]="fields" [(value)]="descriptor"
 *                (predicateChange)="ds.applyPredicate($event)" />
 *   </ng-template>
 *   <!-- columns and detail template -->
 * </ui-master-detail-view>
 * ```
 */
@Component({
  selector: "ui-master-detail-view",
  standalone: true,
  imports: [UITableView, NgTemplateOutlet, UIIcon],
  templateUrl: "./master-detail-view.component.html",
  styleUrl: "./master-detail-view.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-master-detail-view",
  },
})
export class UIMasterDetailView<T = unknown> {
  // ── Inputs ────────────────────────────────────────────────────────

  /** Title displayed above the list panel. */
  public readonly title = input<string>("Items");

  /**
   * The datasource adapter powering the table-view.
   *
   * When provided, this takes precedence over the `data` input.
   * The adapter should be pre-configured with a page size of 100.
   */
  public readonly datasource = input<DatasourceAdapter<T> | undefined>(
    undefined,
  );

  /**
   * Convenience: raw data array. When set, an internal
   * {@link ArrayDatasource} is created automatically.
   * Ignored when `datasource` is provided.
   */
  public readonly data = input<readonly T[]>([]);

  /** Placeholder text shown when no item is selected. */
  public readonly placeholder = input<string>("Select an item to view details");

  /**
   * Whether the filter section is visible.
   * When `true` a collapsible area is shown above the list.
   * A `#filter` content template should be projected to fill it.
   */
  public readonly showFilter = input<boolean>(false);

  /** Whether the filter section starts expanded. */
  public readonly filterExpanded = input<boolean>(true);

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emits whenever the selection changes. Carries the selected item or `undefined`. */
  public readonly selectedChange = output<T | undefined>();

  // ── Content queries ───────────────────────────────────────────────

  /**
   * Projected table-view columns.
   * These are forwarded to the internal `<ui-table-view>`.
   */
  public readonly columns = contentChildren(UITableViewColumn);

  /** Detail template — rendered when an item is selected. */
  public readonly detailTemplate =
    contentChild<TemplateRef<MasterDetailContext<T>>>("detail");

  /** Optional filter template — shown in the collapsible filter area. */
  public readonly filterTemplate = contentChild<TemplateRef<unknown>>("filter");

  // ── Computed ──────────────────────────────────────────────────────

  /** The currently selected item, derived from the selection model. @internal */
  protected readonly selectedItem = computed<T | undefined>(() => {
    const items = this.selectionModel.selected();
    return items.length > 0 ? items[0] : undefined;
  });

  /** Context for the detail template outlet. @internal */
  protected readonly detailContext = computed<
    MasterDetailContext<T> | undefined
  >(() => {
    const item = this.selectedItem();
    if (item === undefined) return undefined;
    return { $implicit: item };
  });

  /**
   * The resolved datasource: explicit `datasource` input takes
   * precedence, otherwise an internal adapter wraps the `data` array.
   *
   * The adapter construction is wrapped in `untracked` because
   * {@link DatasourceAdapter}'s constructor writes to signals,
   * which is forbidden inside `computed` contexts.
   * @internal
   */
  protected readonly resolvedDatasource = computed<DatasourceAdapter<T>>(
    () => {
      const explicit = this.datasource();
      if (explicit) return explicit;
      const data = this.data();
      return untracked(() =>
        new DatasourceAdapter<T>(
          new ArrayDatasource<T>([...(data as T[])]),
          100,
        ),
      );
    },
  );

  // ── Public fields ───────────────────────────────────────────────

  /** Selection model for the table-view (single mode). */
  public readonly selectionModel = new SelectionModel<T>("single");

  // ── Protected fields ──────────────────────────────────────────────

  /** @internal — whether the filter section is collapsed. */
  protected readonly filterCollapsed = signal(false);

  // ── Protected constants ───────────────────────────────────────────

  /** @internal */
  protected readonly chevronDown = UIIcons.Lucide.Arrows.ChevronDown;

  /** @internal */
  protected readonly chevronRight = UIIcons.Lucide.Arrows.ChevronRight;

  // ── Constructor ───────────────────────────────────────────────────

  public constructor() {
    // Initialise filterCollapsed from the filterExpanded input
    effect(() => {
      const expanded = this.filterExpanded();
      untracked(() => this.filterCollapsed.set(!expanded));
    });

    // Emit selectedChange whenever selection changes
    effect(() => {
      const item = this.selectedItem();
      untracked(() => this.selectedChange.emit(item));
    });
  }

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal — toggle filter visibility. */
  protected toggleFilter(): void {
    this.filterCollapsed.update((v) => !v);
  }
}
