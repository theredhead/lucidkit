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
export class UITableHeader {
  columns = input.required<readonly UITableViewColumn[]>();
  showRowIndexIndicator = input<boolean>(false);
  rowIndexHeaderText = input<string>("#");
  resizable = input<boolean>(false);
  columnWidths = input<Record<string, number>>({});
  sortChange = output<SortState | null>();
  columnResize = output<ColumnResizeEvent>();
  sortState = signal<SortState | null>(null);

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
    const minWidth = 40;
    const root =
      this.elRef.nativeElement.closest(".table-view-root") ??
      this.elRef.nativeElement;

    root.classList.add("tv-resizing");
    handle.setPointerCapture(event.pointerId);

    const onMove = (e: PointerEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(minWidth, Math.round(startWidth + delta));
      cell.style.width = `${newWidth}px`;
      cell.style.flex = "0 0 auto";
    };

    const onUp = (e: PointerEvent) => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      root.classList.remove("tv-resizing");

      const finalWidth = Math.max(
        minWidth,
        Math.round(cell.getBoundingClientRect().width),
      );
      this.zone.run(() => {
        this.columnResize.emit({ key: colKey, widthPx: finalWidth });
      });
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  }
}
