import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIPlainTableBody } from "./plain-table-body.component";
import type { SelectionModel } from "../../core/selection-model";

interface TableBodyTestAccess {
  getColWidth(key: string): number | null;
  onRowClick(row: { id: number } | null): void;
  onSelectionToggle(row: { id: number } | null): void;
  isRowSelected(row: { id: number } | null): boolean;
}

describe("UIPlainTableBody", () => {
  let fixture: ComponentFixture<UIPlainTableBody>;
  let component: UIPlainTableBody;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIPlainTableBody],
    }).compileComponents();

    fixture = TestBed.createComponent(UIPlainTableBody);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("columns", []);
    fixture.componentRef.setInput("rows", []);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("getColWidth", () => {
    it("should return null when column not in widths map", () => {
      fixture.componentRef.setInput("columnWidths", {});
      fixture.detectChanges();
      expect(
        (component as unknown as TableBodyTestAccess).getColWidth("unknown"),
      ).toBeNull();
    });

    it("should return width when column exists in widths map", () => {
      fixture.componentRef.setInput("columnWidths", { name: 150 });
      fixture.detectChanges();
      expect(
        (component as unknown as TableBodyTestAccess).getColWidth("name"),
      ).toBe(150);
    });
  });

  describe("onRowClick", () => {
    it("should emit rowClick for non-null row", () => {
      const spy = vi.fn();
      component.rowClick.subscribe(spy);
      (component as unknown as TableBodyTestAccess).onRowClick({ id: 1 });
      expect(spy).toHaveBeenCalledWith({ id: 1 });
    });

    it("should not emit rowClick for null row", () => {
      const spy = vi.fn();
      component.rowClick.subscribe(spy);
      (component as unknown as TableBodyTestAccess).onRowClick(null);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("onSelectionToggle", () => {
    it("should toggle selection for non-null row", () => {
      const mockSelection: Partial<SelectionModel<unknown>> = {
        toggle: vi.fn(),
        isSelected: vi.fn().mockReturnValue(false),
      };
      fixture.componentRef.setInput("selection", mockSelection);
      fixture.detectChanges();

      (component as unknown as TableBodyTestAccess).onSelectionToggle({
        id: 1,
      });
      expect(mockSelection.toggle).toHaveBeenCalledWith({ id: 1 });
    });

    it("should not toggle for null row", () => {
      const mockSelection: Partial<SelectionModel<unknown>> = {
        toggle: vi.fn(),
        isSelected: vi.fn().mockReturnValue(false),
      };
      fixture.componentRef.setInput("selection", mockSelection);
      fixture.detectChanges();

      (component as unknown as TableBodyTestAccess).onSelectionToggle(null);
      expect(mockSelection.toggle).not.toHaveBeenCalled();
    });
  });

  describe("isRowSelected", () => {
    it("should return false for null row", () => {
      expect(
        (component as unknown as TableBodyTestAccess).isRowSelected(null),
      ).toBe(false);
    });

    it("should return false when no selection model", () => {
      expect(
        (component as unknown as TableBodyTestAccess).isRowSelected({ id: 1 }),
      ).toBe(false);
    });

    it("should delegate to selection model", () => {
      const mockSelection: Partial<SelectionModel<unknown>> = {
        toggle: vi.fn(),
        isSelected: vi.fn().mockReturnValue(true),
      };
      fixture.componentRef.setInput("selection", mockSelection);
      fixture.detectChanges();

      expect(
        (component as unknown as TableBodyTestAccess).isRowSelected({ id: 1 }),
      ).toBe(true);
      expect(mockSelection.isSelected).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("scrollToIndex", () => {
    it("should be callable without error when no rows", () => {
      expect(() => component.scrollToIndex(0)).not.toThrow();
    });
  });
});
