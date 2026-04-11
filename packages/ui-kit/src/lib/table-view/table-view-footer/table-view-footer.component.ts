import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/lucid-foundation";

@Component({
  selector: "ui-table-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "table-footer" }],
  templateUrl: "./table-view-footer.component.html",
  styleUrl: "./table-view-footer.component.scss",
})
/** @internal */
export class UITableFooter {
  pageIndex = input.required<number>();
  pageSize = input.required<number>();
  totalItems = input<number | null>(null);
  pageIndexChange = output<number>();

  rangeStart = computed(() => this.pageIndex() * this.pageSize() + 1);
  rangeEnd = computed(() => {
    const end = (this.pageIndex() + 1) * this.pageSize();
    const total = this.totalItems();
    return total !== null ? Math.min(end, total) : end;
  });
  hasNextPage = computed(() => {
    const total = this.totalItems();
    if (total === null) return true;
    return (this.pageIndex() + 1) * this.pageSize() < total;
  });

  prevPage(): void {
    if (this.pageIndex() > 0) {
      this.pageIndexChange.emit(this.pageIndex() - 1);
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.pageIndexChange.emit(this.pageIndex() + 1);
    }
  }
}
