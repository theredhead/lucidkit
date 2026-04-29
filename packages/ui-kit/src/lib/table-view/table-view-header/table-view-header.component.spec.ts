import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import {
  UITableHeader,
  SortState,
  ColumnResizeEvent,
} from "./table-view-header.component";

// Minimal stub that provides what UITableHeader needs
class StubColumn {
  public readonly key = signal("col-1");
  public readonly headerText = signal("Column 1");
  public readonly sortable = signal(true);
}

class StubColumnNonSortable {
  public readonly key = signal("col-2");
  public readonly headerText = signal("Column 2");
  public readonly sortable = signal(false);
}

type StubColumnLike = StubColumn | StubColumnNonSortable;

@Component({
  standalone: true,
  imports: [UITableHeader],
  template: `
    <ui-table-header
      [columns]="columns()"
      [showRowIndexIndicator]="showRowIndex()"
      [resizable]="resizable()"
      [columnWidths]="columnWidths()"
      [selectionMode]="selectionMode()"
      [showSelectionColumn]="showSelectionColumn()"
      [allSelected]="allSelected()"
      [indeterminate]="indeterminate()"
      (sortChange)="onSort($event)"
      (columnResize)="onResize($event)"
      (selectAllChange)="onSelectAll($event)"
    />
  `,
})
class TestHost {
  public readonly columns = signal<readonly StubColumnLike[]>([
    new StubColumn(),
  ]);
  public readonly showRowIndex = signal(false);
  public readonly resizable = signal(false);
  public readonly columnWidths = signal<Record<string, number>>({});
  public readonly selectionMode = signal<"none" | "single" | "multiple">(
    "none",
  );
  public readonly showSelectionColumn = signal(true);
  public readonly allSelected = signal(false);
  public readonly indeterminate = signal(false);

  public lastSort: SortState | null | undefined = undefined;
  public lastResize: ColumnResizeEvent | undefined = undefined;
  public lastSelectAll: boolean | undefined = undefined;

  public onSort(state: SortState | null): void {
    this.lastSort = state;
  }
  public onResize(event: ColumnResizeEvent): void {
    this.lastResize = event;
  }
  public onSelectAll(checked: boolean): void {
    this.lastSelectAll = checked;
  }
}

describe("UITableHeader", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.nativeElement.querySelector("ui-table-header")).toBeTruthy();
  });

  describe("header cells", () => {
    it("should render a cell for each column", () => {
      const cells = fixture.nativeElement.querySelectorAll(
        ".table-header-cell:not(.table-header-cell--row-index):not(.table-header-cell--selection)",
      );
      expect(cells.length).toBe(1);
    });

    it("should show header text", () => {
      const label = fixture.nativeElement.querySelector(".header-label");
      expect(label.textContent.trim()).toBe("Column 1");
    });
  });

  describe("row index indicator", () => {
    it("should not show row index cell by default", () => {
      expect(
        fixture.nativeElement.querySelector(".table-header-cell--row-index"),
      ).toBeFalsy();
    });

    it("should show row index cell when enabled", () => {
      host.showRowIndex.set(true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".table-header-cell--row-index"),
      ).toBeTruthy();
    });
  });

  describe("selection column", () => {
    it("should not show selection column when selectionMode is none", () => {
      host.selectionMode.set("none");
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".table-header-cell--selection"),
      ).toBeFalsy();
    });

    it("should show empty selection cell for single mode", () => {
      host.selectionMode.set("single");
      fixture.detectChanges();
      const cell = fixture.nativeElement.querySelector(
        ".table-header-cell--selection",
      );
      expect(cell).toBeTruthy();
      expect(cell.querySelector("input[type='checkbox']")).toBeFalsy();
    });

    it("should show select-all checkbox for multiple mode", () => {
      host.selectionMode.set("multiple");
      fixture.detectChanges();
      const checkbox = fixture.nativeElement.querySelector(
        ".tv-select-all-checkbox",
      );
      expect(checkbox).toBeTruthy();
    });

    it("should emit selectAllChange when checkbox is toggled", () => {
      host.selectionMode.set("multiple");
      fixture.detectChanges();
      const checkbox = fixture.nativeElement.querySelector(
        ".tv-select-all-checkbox",
      ) as HTMLInputElement;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      expect(host.lastSelectAll).toBe(true);
    });
  });

  describe("sorting", () => {
    it("should emit asc on first click", () => {
      const cell = fixture.nativeElement.querySelector(
        ".table-header-cell.sortable",
      ) as HTMLElement;
      cell.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 30,
          left: 0,
          right: 200,
          width: 200,
          height: 30,
          x: 0,
          y: 0,
        }) as DOMRect;
      cell.dispatchEvent(
        new MouseEvent("click", { bubbles: true, clientX: 50 }),
      );
      expect(host.lastSort).toEqual({ key: "col-1", direction: "asc" });
    });

    it("should cycle asc → desc → null", () => {
      const cell = fixture.nativeElement.querySelector(
        ".table-header-cell.sortable",
      ) as HTMLElement;
      // Use left-side clientX to avoid the right-edge resize guard
      cell.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 30,
          left: 0,
          right: 200,
          width: 200,
          height: 30,
          x: 0,
          y: 0,
        }) as DOMRect;
      const click = () =>
        cell.dispatchEvent(
          new MouseEvent("click", { bubbles: true, clientX: 50 }),
        );
      click();
      expect(host.lastSort!.direction).toBe("asc");

      click();
      expect(host.lastSort!.direction).toBe("desc");

      click();
      expect(host.lastSort).toBeNull();
    });

    it("should not react to non-sortable column click", () => {
      host.columns.set([new StubColumnNonSortable()]);
      fixture.detectChanges();
      const cell = fixture.nativeElement.querySelector(".table-header-cell");
      cell.click();
      expect(host.lastSort).toBeUndefined();
    });

    it("should reset sort when clicking a different column", () => {
      const col2: StubColumnLike = {
        key: signal("col-other"),
        headerText: signal("Other"),
        sortable: signal(true),
      };
      host.columns.set([new StubColumn(), col2]);
      fixture.detectChanges();

      const cells = fixture.nativeElement.querySelectorAll(
        ".table-header-cell.sortable",
      ) as NodeListOf<HTMLElement>;
      cells.forEach((c) => {
        c.getBoundingClientRect = () =>
          ({
            top: 0,
            bottom: 30,
            left: 0,
            right: 200,
            width: 200,
            height: 30,
            x: 0,
            y: 0,
          }) as DOMRect;
      });
      cells[0].dispatchEvent(
        new MouseEvent("click", { bubbles: true, clientX: 50 }),
      );
      cells[1].dispatchEvent(
        new MouseEvent("click", { bubbles: true, clientX: 50 }),
      );
      expect(host.lastSort).toEqual({ key: "col-other", direction: "asc" });
    });
  });

  describe("column widths", () => {
    it("should apply width style when columnWidths provided", () => {
      host.columnWidths.set({ "col-1": 250 });
      fixture.detectChanges();
      const cell = fixture.nativeElement.querySelector(
        ".table-header-cell:not(.table-header-cell--row-index):not(.table-header-cell--selection)",
      );
      expect(cell.style.width).toBe("250px");
    });
  });

  describe("resize handle", () => {
    it("should not show resize handle when resizable is false", () => {
      host.resizable.set(false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".resize-handle")).toBeFalsy();
    });

    it("should show resize handle when resizable is true", () => {
      host.resizable.set(true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".resize-handle"),
      ).toBeTruthy();
    });

    it("should emit columnResize after pointer drag", () => {
      host.resizable.set(true);
      fixture.detectChanges();

      const handle = fixture.nativeElement.querySelector(
        ".resize-handle",
      ) as HTMLElement;
      const cell = handle.parentElement as HTMLElement;

      // Mock methods that JSDOM doesn't support
      handle.setPointerCapture = vi.fn();
      handle.releasePointerCapture = vi.fn();
      cell.getBoundingClientRect = () =>
        ({
          width: 150,
          top: 0,
          bottom: 30,
          left: 0,
          right: 150,
          height: 30,
          x: 0,
          y: 0,
        }) as DOMRect;

      // Start resize
      handle.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          pointerId: 1,
          clientX: 150,
        }),
      );

      // Move
      handle.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          pointerId: 1,
          clientX: 200,
        }),
      );

      // Release - cell width after move
      cell.getBoundingClientRect = () =>
        ({
          width: 200,
          top: 0,
          bottom: 30,
          left: 0,
          right: 200,
          height: 30,
          x: 0,
          y: 0,
        }) as DOMRect;
      handle.dispatchEvent(
        new PointerEvent("pointerup", {
          bubbles: true,
          pointerId: 1,
          clientX: 200,
        }),
      );

      expect(host.lastResize).toEqual({ key: "col-1", widthPx: 200 });
    });

    it("should enforce MIN_COLUMN_WIDTH during resize", () => {
      host.resizable.set(true);
      fixture.detectChanges();

      const handle = fixture.nativeElement.querySelector(
        ".resize-handle",
      ) as HTMLElement;
      const cell = handle.parentElement as HTMLElement;

      handle.setPointerCapture = vi.fn();
      handle.releasePointerCapture = vi.fn();
      cell.getBoundingClientRect = () =>
        ({
          width: 100,
          top: 0,
          bottom: 30,
          left: 0,
          right: 100,
          height: 30,
          x: 0,
          y: 0,
        }) as DOMRect;

      // Start resize
      handle.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          pointerId: 1,
          clientX: 100,
        }),
      );

      // Move to narrow (100 - 80 = 20 < MIN_COLUMN_WIDTH=40)
      handle.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          pointerId: 1,
          clientX: 20,
        }),
      );

      // Cell width should be clamped to MIN_COLUMN_WIDTH
      expect(parseInt(cell.style.width)).toBeGreaterThanOrEqual(40);
    });

    it("should add and remove resizing class on root during drag", () => {
      host.resizable.set(true);
      fixture.detectChanges();

      const handle = fixture.nativeElement.querySelector(
        ".resize-handle",
      ) as HTMLElement;
      const cell = handle.parentElement as HTMLElement;

      handle.setPointerCapture = vi.fn();
      handle.releasePointerCapture = vi.fn();
      cell.getBoundingClientRect = () =>
        ({
          width: 150,
          top: 0,
          bottom: 30,
          left: 0,
          right: 150,
          height: 30,
          x: 0,
          y: 0,
        }) as DOMRect;

      // The elRef.nativeElement.closest('.root') fallback is the header element itself
      const headerEl = fixture.nativeElement.querySelector(
        "ui-table-header",
      ) as HTMLElement;

      handle.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          pointerId: 1,
          clientX: 150,
        }),
      );

      // root (or nativeElement fallback) should have resizing class
      expect(headerEl.classList.contains("resizing")).toBe(true);

      handle.dispatchEvent(
        new PointerEvent("pointerup", {
          bubbles: true,
          pointerId: 1,
          clientX: 150,
        }),
      );

      expect(headerEl.classList.contains("resizing")).toBe(false);
    });

    it("should set flex to 0 0 auto during resize", () => {
      host.resizable.set(true);
      fixture.detectChanges();

      const handle = fixture.nativeElement.querySelector(
        ".resize-handle",
      ) as HTMLElement;
      const cell = handle.parentElement as HTMLElement;

      handle.setPointerCapture = vi.fn();
      handle.releasePointerCapture = vi.fn();
      cell.getBoundingClientRect = () =>
        ({
          width: 150,
          top: 0,
          bottom: 30,
          left: 0,
          right: 150,
          height: 30,
          x: 0,
          y: 0,
        }) as DOMRect;

      handle.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          pointerId: 1,
          clientX: 150,
        }),
      );
      handle.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          pointerId: 1,
          clientX: 200,
        }),
      );

      expect(cell.style.flex).toBe("0 0 auto");

      handle.dispatchEvent(
        new PointerEvent("pointerup", {
          bubbles: true,
          pointerId: 1,
          clientX: 200,
        }),
      );
    });
  });

  describe("column widths - getColWidth", () => {
    it("should return null for unknown column key", () => {
      host.columnWidths.set({ "other-col": 100 });
      fixture.detectChanges();
      const cell = fixture.nativeElement.querySelector(
        ".table-header-cell:not(.table-header-cell--row-index):not(.table-header-cell--selection)",
      );
      // No width should be applied when key not in widths map
      expect(cell.style.width).toBe("");
    });
  });

  describe("sort edge guard", () => {
    it("should ignore clicks at right edge of cell (resize zone)", () => {
      const cell = fixture.nativeElement.querySelector(
        ".table-header-cell.sortable",
      ) as HTMLElement;
      cell.getBoundingClientRect = () =>
        ({
          top: 0,
          bottom: 30,
          left: 0,
          right: 200,
          width: 200,
          height: 30,
          x: 0,
          y: 0,
        }) as DOMRect;
      // Click at position 199, which is >= right - 2 (198)
      cell.dispatchEvent(
        new MouseEvent("click", { bubbles: true, clientX: 199 }),
      );
      expect(host.lastSort).toBeUndefined();
    });
  });
});
