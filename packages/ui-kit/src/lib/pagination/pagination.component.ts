import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";

import type { PageChangeEvent } from "./pagination.types";
import { UISurface } from "@theredhead/lucid-foundation";
import { UIButton, type ButtonColor } from "../button/button.component";
import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import {
  UIDropdownList,
  type SelectOption,
} from "../dropdown-list/dropdown-list.component";

/**
 * A pagination control for navigating through pages of data.
 *
 * @example
 * ```html
 * <ui-pagination
 *   [totalItems]="250"
 *   [(pageIndex)]="currentPage"
 *   [pageSize]="10"
 *   (pageChange)="onPage($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-pagination",
  standalone: true,
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  imports: [UIButton, UIIcon, UIDropdownList],
  host: {
    class: "ui-pagination",
    role: "navigation",
    "[attr.aria-label]": "ariaLabel()",
  },
})
export class UIPagination {
  /**
   * Total number of items, or `null` when the total is unknown
   * (e.g. infinite scroll / server-side pagination with no count).
   */
  public readonly totalItems = input<number | null>(null);

  /** Number of items per page. */
  public readonly pageSize = input(10);

  /**
   * Available page size options for the selector.
   * Empty array (the default) hides the page-size selector.
   */
  public readonly pageSizeOptions = input<readonly number[]>([]);

  /** Zero-based current page index. Supports two-way binding. */
  public readonly pageIndex = model(0);

  /** Whether the pagination is disabled. */
  public readonly disabled = input(false);

  /**
   * Explicit hint for whether more pages exist beyond the current one.
   * Only used when `totalItems` is `null`. When `null` (default), more
   * pages are assumed to exist (next button stays enabled).
   */
  public readonly hasMore = input<boolean | null>(null);

  /**
   * Color scheme for pagination buttons.
   * Defaults to `'primary'` (accent colour). Pass `'neutral'` when embedding
   * inside a surface that should not compete with the accent colour (e.g. a
   * table footer).
   */
  public readonly buttonColor = input<ButtonColor>("primary");

  /** Accessible label for the nav element. */
  public readonly ariaLabel = input("Pagination");

  /** Emitted on page or size change. */
  public readonly pageChange = output<PageChangeEvent>();

  /**
   * Total number of pages, or `null` when `totalItems` is unknown.
   */
  protected readonly totalPages = computed<number | null>(() => {
    const t = this.totalItems();
    if (t === null) return null;
    return Math.max(1, Math.ceil(t / this.pageSize()));
  });

  /**
   * The page numbers to display.
   * Empty when total is unknown — no page buttons are rendered.
   */
  protected readonly pages = computed(() => {
    const total = this.totalPages();
    if (total === null) return [] as number[];
    const current = this.pageIndex();
    const pages: number[] = [];

    pages.push(0);

    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);

    if (start > 1) {
      pages.push(-1); // ellipsis
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 2) {
      pages.push(-1); // ellipsis
    }

    if (total > 1) {
      pages.push(total - 1);
    }

    return pages;
  });

  /** Whether the previous button is enabled. */
  protected readonly hasPrevious = computed(() => this.pageIndex() > 0);

  /**
   * Whether the next button is enabled.
   * When `totalItems` is unknown, falls back to `hasMore` (defaults to `true`).
   */
  protected readonly hasNext = computed(() => {
    const total = this.totalPages();
    if (total !== null) return this.pageIndex() < total - 1;
    return this.hasMore() !== false;
  });

  /** `"A–B of N"` when total is known, `"Page X"` when unknown. */
  protected readonly summary = computed(() => {
    const total = this.totalItems();
    const page = this.pageIndex();
    const size = this.pageSize();
    if (total === null) return `Page ${page + 1}`;
    const from = page * size + 1;
    const to = Math.min((page + 1) * size, total);
    return `${from}\u2013${to} of ${total}`;
  });

  /** @internal SelectOption list derived from pageSizeOptions. */
  protected readonly pageSizeSelectOptions = computed<readonly SelectOption[]>(
    () =>
      this.pageSizeOptions().map((n) => ({
        value: String(n),
        label: String(n),
      })),
  );

  /** @internal Current page size as a string value for ui-dropdown-list. */
  protected readonly pageSizeValue = computed(() => String(this.pageSize()));

  /** @internal Icon registry reference. */
  protected readonly icons = {
    ChevronLeft: UIIcons.Lucide.Arrows.ChevronLeft,
    ChevronRight: UIIcons.Lucide.Arrows.ChevronRight,
    ChevronsLeft: UIIcons.Lucide.Arrows.ChevronsLeft,
    ChevronsRight: UIIcons.Lucide.Arrows.ChevronsRight,
  } as const;

  /** Go to first page. */
  public goToFirst(): void {
    this.goToPage(0);
  }

  /** Go to last page. Only works when `totalItems` is known. */
  public goToLast(): void {
    const total = this.totalPages();
    if (total === null) return;
    this.goToPage(total - 1);
  }

  /** Go to previous page. */
  public goToPrevious(): void {
    this.goToPage(this.pageIndex() - 1);
  }

  /** Go to next page. */
  public goToNext(): void {
    this.goToPage(this.pageIndex() + 1);
  }

  /** Go to a specific page. */
  public goToPage(index: number): void {
    if (this.disabled()) {
      return;
    }
    const total = this.totalPages();
    const clamped =
      total !== null
        ? Math.max(0, Math.min(index, total - 1))
        : Math.max(0, index);
    if (clamped === this.pageIndex()) {
      return;
    }
    this.pageIndex.set(clamped);
    this.emitPageChange();
  }

  /** Handle page size change from the dropdown. */
  protected onPageSizeChange(value: string | null): void {
    if (!value) return;
    const newSize = parseInt(value, 10);
    if (isNaN(newSize)) return;
    this.pageIndex.set(0);
    this.pageChange.emit({
      pageIndex: 0,
      pageSize: newSize,
      totalItems: this.totalItems(),
    });
  }

  private emitPageChange(): void {
    this.pageChange.emit({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      totalItems: this.totalItems(),
    });
  }
}
