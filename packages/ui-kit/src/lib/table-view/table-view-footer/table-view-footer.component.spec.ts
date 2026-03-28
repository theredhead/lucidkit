import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, expect, it, beforeEach } from "vitest";

import { UITableFooter } from "./table-view-footer.component";

describe("UITableFooter", () => {
  let component: UITableFooter;
  let fixture: ComponentFixture<UITableFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UITableFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(UITableFooter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("pageIndex", 0);
    fixture.componentRef.setInput("pageSize", 10);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("rangeStart", () => {
    it("should return 1 for first page", () => {
      expect(component.rangeStart()).toBe(1);
    });

    it("should return correct start for subsequent pages", () => {
      fixture.componentRef.setInput("pageIndex", 2);
      fixture.detectChanges();
      expect(component.rangeStart()).toBe(21);
    });
  });

  describe("rangeEnd", () => {
    it("should return pageSize when totalItems is null", () => {
      expect(component.rangeEnd()).toBe(10);
    });

    it("should clamp to totalItems when total is less than page end", () => {
      fixture.componentRef.setInput("totalItems", 7);
      fixture.detectChanges();
      expect(component.rangeEnd()).toBe(7);
    });

    it("should return page end when total exceeds page end", () => {
      fixture.componentRef.setInput("totalItems", 50);
      fixture.detectChanges();
      expect(component.rangeEnd()).toBe(10);
    });
  });

  describe("hasNextPage", () => {
    it("should return true when totalItems is null", () => {
      expect(component.hasNextPage()).toBe(true);
    });

    it("should return true when more items exist", () => {
      fixture.componentRef.setInput("totalItems", 25);
      fixture.detectChanges();
      expect(component.hasNextPage()).toBe(true);
    });

    it("should return false on the last page", () => {
      fixture.componentRef.setInput("totalItems", 10);
      fixture.detectChanges();
      expect(component.hasNextPage()).toBe(false);
    });

    it("should return false when page exceeds total", () => {
      fixture.componentRef.setInput("totalItems", 5);
      fixture.detectChanges();
      expect(component.hasNextPage()).toBe(false);
    });
  });

  describe("prevPage", () => {
    it("should not emit when already on first page", () => {
      let emitted = false;
      component.pageIndexChange.subscribe(() => (emitted = true));
      component.prevPage();
      expect(emitted).toBe(false);
    });

    it("should emit pageIndex - 1", () => {
      fixture.componentRef.setInput("pageIndex", 3);
      fixture.detectChanges();
      let value: number | undefined;
      component.pageIndexChange.subscribe((v) => (value = v));
      component.prevPage();
      expect(value).toBe(2);
    });
  });

  describe("nextPage", () => {
    it("should emit pageIndex + 1 when next page exists", () => {
      fixture.componentRef.setInput("totalItems", 25);
      fixture.detectChanges();
      let value: number | undefined;
      component.pageIndexChange.subscribe((v) => (value = v));
      component.nextPage();
      expect(value).toBe(1);
    });

    it("should not emit when on last page", () => {
      fixture.componentRef.setInput("totalItems", 10);
      fixture.detectChanges();
      let emitted = false;
      component.pageIndexChange.subscribe(() => (emitted = true));
      component.nextPage();
      expect(emitted).toBe(false);
    });
  });
});
