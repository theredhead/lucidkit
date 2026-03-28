import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";

import type { PageChangeEvent } from "./pagination.types";
import { UISurface } from '@theredhead/foundation';

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
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-pagination",
    role: "navigation",
    "[attr.aria-label]": "ariaLabel()",
  },
})
export class UIPagination {
  /** Total number of items. */
  public readonly totalItems = input(0);

  /** Number of items per page. */
  public readonly pageSize = input(10);

  /** Available page size options for the selector. Empty array hides the selector. */
  public readonly pageSizeOptions = input<readonly number[]>([10, 25, 50, 100]);

  /** Zero-based current page index. Supports two-way binding. */
  public readonly pageIndex = model(0);

  /** Whether the pagination is disabled. */
  public readonly disabled = input(false);

  /** Accessible label for the nav element. */
  public readonly ariaLabel = input("Pagination");

  /** Emitted on page or size change. */
  public readonly pageChange = output<PageChangeEvent>();

  /** Total number of pages. */
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize())),
  );

  /** The page numbers to display. */
  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.pageIndex();
    const pages: number[] = [];

    // Always show first page
    pages.push(0);

    // Show window around current page
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

    // Always show last page if more than 1
    if (total > 1) {
      pages.push(total - 1);
    }

    return pages;
  });

  /** Whether the previous button is enabled. */
  protected readonly hasPrevious = computed(() => this.pageIndex() > 0);

  /** Whether the next button is enabled. */
  protected readonly hasNext = computed(
    () => this.pageIndex() < this.totalPages() - 1,
  );

  /** Summary text: "1–10 of 250". */
  protected readonly summary = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    const idx = this.pageIndex();
    const start = idx * size + 1;
    const end = Math.min((idx + 1) * size, total);
    return `${start}–${end} of ${total}`;
  });

  /** Go to first page. */
  public goToFirst(): void {
    this.goToPage(0);
  }

  /** Go to last page. */
  public goToLast(): void {
    this.goToPage(this.totalPages() - 1);
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
    const clamped = Math.max(0, Math.min(index, this.totalPages() - 1));
    if (clamped === this.pageIndex()) {
      return;
    }
    this.pageIndex.set(clamped);
    this.emitPageChange();
  }

  /** Handle page size change from dropdown. */
  protected onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = parseInt(select.value, 10);
    // Reset to first page when page size changes
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
