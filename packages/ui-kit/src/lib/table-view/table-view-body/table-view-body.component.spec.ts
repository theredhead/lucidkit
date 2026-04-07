import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ScrollingModule } from "@angular/cdk/scrolling";

import { UITableBody } from "./table-view-body.component";
import type { SelectionModel } from "../../core/selection-model";

describe("UITableBody", () => {
  let fixture: ComponentFixture<UITableBody>;
  let component: UITableBody;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UITableBody, ScrollingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UITableBody);
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
      expect((component as any)["getColWidth"]("unknown")).toBeNull();
    });

    it("should return width when column exists in widths map", () => {
      fixture.componentRef.setInput("columnWidths", { name: 150 });
      fixture.detectChanges();
      expect((component as any)["getColWidth"]("name")).toBe(150);
    });
  });

  describe("onRowClick", () => {
    it("should emit rowClick for non-null row", () => {
      const spy = vi.fn();
      component.rowClick.subscribe(spy);
      (component as any)["onRowClick"]({ id: 1 });
      expect(spy).toHaveBeenCalledWith({ id: 1 });
    });

    it("should not emit rowClick for null row", () => {
      const spy = vi.fn();
      component.rowClick.subscribe(spy);
      (component as any)["onRowClick"](null);
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

      (component as any)["onSelectionToggle"]({ id: 1 });
      expect(mockSelection.toggle).toHaveBeenCalledWith({ id: 1 });
    });

    it("should not toggle for null row", () => {
      const mockSelection: Partial<SelectionModel<unknown>> = {
        toggle: vi.fn(),
        isSelected: vi.fn().mockReturnValue(false),
      };
      fixture.componentRef.setInput("selection", mockSelection);
      fixture.detectChanges();

      (component as any)["onSelectionToggle"](null);
      expect(mockSelection.toggle).not.toHaveBeenCalled();
    });
  });

  describe("isRowSelected", () => {
    it("should return false for null row", () => {
      expect((component as any)["isRowSelected"](null)).toBe(false);
    });

    it("should return false when no selection model", () => {
      expect((component as any)["isRowSelected"]({ id: 1 })).toBe(false);
    });

    it("should delegate to selection model", () => {
      const mockSelection: Partial<SelectionModel<unknown>> = {
        toggle: vi.fn(),
        isSelected: vi.fn().mockReturnValue(true),
      };
      fixture.componentRef.setInput("selection", mockSelection);
      fixture.detectChanges();

      expect((component as any)["isRowSelected"]({ id: 1 })).toBe(true);
      expect(mockSelection.isSelected).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
