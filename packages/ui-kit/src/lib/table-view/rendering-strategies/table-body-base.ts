import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from "@angular/core";

import { UITableViewColumn } from "../columns/table-column.directive";
import { DEFAULT_ROW_HEIGHT, MIN_COLUMN_WIDTH } from "../table-view.constants";
import type { SelectionMode, SelectionModel } from "../../core/selection-model";
import type { ITableRowRenderingStrategy } from "./table-row-rendering-strategy";

/**
 * Abstract base for table body rendering strategy components.
 *
 * Subclasses must implement {@link scrollToIndex} to control how the
 * active row is brought into view.
 *
 * @internal
 */
@Directive({ standalone: true })
export abstract class UITableBodyBase implements ITableRowRenderingStrategy {
  // ── Inputs ──

  public readonly columns = input.required<readonly UITableViewColumn[]>();
  public readonly rows = input.required<readonly unknown[]>();
  public readonly showRowIndexIndicator = input<boolean>(false);
  public readonly rowIndexOffset = input<number>(0);
  public readonly rowHeight = input<number>(DEFAULT_ROW_HEIGHT);
  public readonly columnWidths = input<Record<string, number>>({});
  public readonly selectionMode = input<SelectionMode>("none");
  public readonly showSelectionColumn = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly selection = input<SelectionModel<any> | undefined>(undefined);
  public readonly rowClickSelect = input<boolean>(false);

  /** Index of the currently active (keyboard-focused) row, or −1 when none. */
  public readonly activeIndex = input<number>(-1);

  // ── Outputs ──

  public readonly rowClick = output<unknown>();

  // ── Protected fields ──

  protected readonly elRef = inject(ElementRef<HTMLElement>);
  protected readonly minColumnWidth = MIN_COLUMN_WIDTH;

  // ── Constructor ──

  public constructor() {
    effect(() => {
      const idx = this.activeIndex();
      if (idx < 0) return;
      this.scrollToIndex(idx);
    });
  }

  // ── Abstract methods ──

  public abstract scrollToIndex(index: number): void;

  // ── Protected methods ──

  protected getColWidth(key: string): number | null {
    return this.columnWidths()[key] ?? null;
  }

  protected onRowClick(row: unknown): void {
    if (row === null) return;
    this.rowClick.emit(row);
  }

  protected onSelectionToggle(row: unknown): void {
    if (row === null) return;
    this.selection()?.toggle(row);
  }

  protected isRowSelected(row: unknown): boolean {
    if (row === null) return false;
    return this.selection()?.isSelected(row) ?? false;
  }
}
