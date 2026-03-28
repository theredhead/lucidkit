import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core";

import { UITableViewColumn } from "../columns/table-column.directive";
import { MIN_COLUMN_WIDTH } from "../table-view.constants";
import type { SelectionMode } from "../../core/selection-model";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/foundation";

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
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "table-header" }],
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
  showSelectionColumn = input<boolean>(true);
  allSelected = input<boolean>(false);
  indeterminate = input<boolean>(false);
  sortChange = output<SortState | null>();
  columnResize = output<ColumnResizeEvent>();
  selectAllChange = output<boolean>();
  sortState = signal<SortState | null>(null);

  protected readonly minColumnWidth = MIN_COLUMN_WIDTH;

  private readonly elRef = inject(ElementRef<HTMLElement>);

  protected getColWidth(key: string): number | null {
    return this.columnWidths()[key] ?? null;
  }

  onCellClick(event: Event, col: UITableViewColumn): void {
    if (!col.sortable()) return;

    // Ignore clicks near the right edge of the cell — that's the
    // resize-handle zone and also where post-drag click events land.
    if (event instanceof MouseEvent) {
      const cell = (event.target as HTMLElement).closest(
        ".table-header-cell",
      ) as HTMLElement | null;
      if (cell) {
        const rect = cell.getBoundingClientRect();
        if (event.clientX >= rect.right - 2) return;
      }
    }
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
      this.elRef.nativeElement.closest(".root") ?? this.elRef.nativeElement;

    root.classList.add("resizing");
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
      root.classList.remove("resizing");

      const finalWidth = Math.max(
        MIN_COLUMN_WIDTH,
        Math.round(cell.getBoundingClientRect().width),
      );
      this.columnResize.emit({ key: colKey, widthPx: finalWidth });
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  }

  onSelectAllToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAllChange.emit(checked);
  }
}
