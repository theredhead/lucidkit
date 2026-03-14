import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  NgZone,
  output,
  signal,
} from "@angular/core";

import { UITableViewColumn } from "../columns/table-column.directive";
import { MIN_COLUMN_WIDTH } from "../table-view.constants";
import type { SelectionMode } from "../table-view-selection.model";

export interface SortState {
  key: string;
  direction: "asc" | "desc";
}

export interface ColumnResizeEvent {
  key: string;
  widthPx: number;
}

@Component({
  selector: "ui-table-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./table-view-header.component.html",
  styleUrl: "./table-view-header.component.scss",
})
/** @internal */
export class UITableHeader {
  columns = input.required<readonly UITableViewColumn[]>();
  showRowIndexIndicator = input<boolean>(false);
  rowIndexHeaderText = input<string>("#");
  resizable = input<boolean>(false);
  columnWidths = input<Record<string, number>>({});
  selectionMode = input<SelectionMode>("none");
  allSelected = input<boolean>(false);
  indeterminate = input<boolean>(false);
  sortChange = output<SortState | null>();
  columnResize = output<ColumnResizeEvent>();
  selectAllChange = output<boolean>();
  sortState = signal<SortState | null>(null);

  protected readonly minColumnWidth = MIN_COLUMN_WIDTH;

  constructor(
    private readonly elRef: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
  ) {}

  protected getColWidth(key: string): number | null {
    return this.columnWidths()[key] ?? null;
  }

  onCellClick(col: UITableViewColumn): void {
    if (!col.sortable()) return;
    const current = this.sortState();
    let next: SortState | null;
    if (current?.key === col.key()) {
      next =
        current.direction === "asc"
          ? { key: col.key(), direction: "desc" }
          : null;
    } else {
      next = { key: col.key(), direction: "asc" };
    }
    this.sortState.set(next);
    this.sortChange.emit(next);
  }

  onResizeStart(event: PointerEvent, colKey: string): void {
    event.preventDefault();
    event.stopPropagation();

    const handle = event.target as HTMLElement;
    const cell = handle.parentElement!;
    const startX = event.clientX;
    const startWidth = cell.getBoundingClientRect().width;
    const root =
      this.elRef.nativeElement.closest(".table-view-root") ??
      this.elRef.nativeElement;

    root.classList.add("tv-resizing");
    handle.setPointerCapture(event.pointerId);

    const onMove = (e: PointerEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(
        MIN_COLUMN_WIDTH,
        Math.round(startWidth + delta),
      );
      cell.style.width = `${newWidth}px`;
      cell.style.flex = "0 0 auto";
    };

    const onUp = (e: PointerEvent) => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      root.classList.remove("tv-resizing");

      const finalWidth = Math.max(
        MIN_COLUMN_WIDTH,
        Math.round(cell.getBoundingClientRect().width),
      );
      this.zone.run(() => {
        this.columnResize.emit({ key: colKey, widthPx: finalWidth });
      });
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  }

  onSelectAllToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAllChange.emit(checked);
  }
}
