import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIPagination } from "./pagination.component";
import type { PageChangeEvent } from "./pagination.types";

describe("UIPagination", () => {
  let component: UIPagination;
  let fixture: ComponentFixture<UIPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIPagination],
    }).compileComponents();

    fixture = TestBed.createComponent(UIPagination);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("totalItems", 100);
    fixture.componentRef.setInput("pageSize", 10);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default pageIndex to 0", () => {
      expect(component.pageIndex()).toBe(0);
    });

    it("should default pageSize to 10", () => {
      expect(component.pageSize()).toBe(10);
    });

    it("should have navigation role", () => {
      expect(fixture.nativeElement.getAttribute("role")).toBe("navigation");
    });
  });

  describe("page navigation", () => {
    it("should go to next page", () => {
      component.goToNext();
      expect(component.pageIndex()).toBe(1);
    });

    it("should go to previous page", () => {
      component.goToPage(3);
      component.goToPrevious();
      expect(component.pageIndex()).toBe(2);
    });

    it("should go to first page", () => {
      component.goToPage(5);
      component.goToFirst();
      expect(component.pageIndex()).toBe(0);
    });

    it("should go to last page", () => {
      component.goToLast();
      expect(component.pageIndex()).toBe(9); // 100/10 - 1
    });

    it("should go to specific page", () => {
      component.goToPage(4);
      expect(component.pageIndex()).toBe(4);
    });

    it("should clamp page index to valid range", () => {
      component.goToPage(100);
      expect(component.pageIndex()).toBe(9);
    });

    it("should not go below 0", () => {
      component.goToPage(-5);
      expect(component.pageIndex()).toBe(0);
    });

    it("should not navigate when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      component.goToPage(5);
      expect(component.pageIndex()).toBe(0);
    });
  });

  describe("pageChange output", () => {
    it("should emit on page change", () => {
      const spy = vi.fn<(event: PageChangeEvent) => void>();
      component.pageChange.subscribe(spy);
      component.goToNext();
      expect(spy).toHaveBeenCalledWith({
        pageIndex: 1,
        pageSize: 10,
        totalItems: 100,
      });
    });

    it("should not emit if page did not change", () => {
      const spy = vi.fn();
      component.pageChange.subscribe(spy);
      component.goToPrevious(); // already at 0
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("summary display", () => {
    it("should show 1–10 of 100 for first page", () => {
      fixture.detectChanges();
      const summary = fixture.nativeElement.querySelector(".pg-summary");
      expect(summary.textContent.trim()).toBe("1–10 of 100");
    });

    it("should show 11–20 of 100 for second page", () => {
      component.goToNext();
      fixture.detectChanges();
      const summary = fixture.nativeElement.querySelector(".pg-summary");
      expect(summary.textContent.trim()).toBe("11–20 of 100");
    });
  });

  describe("button states", () => {
    it("should disable first/prev on first page", () => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll(".pg-btn");
      expect(buttons[0].disabled).toBe(true); // first
      expect(buttons[1].disabled).toBe(true); // prev
    });

    it("should disable next/last on last page", () => {
      component.goToLast();
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll(
        ".pg-btn:not(.pg-btn--page)",
      );
      const allButtons = Array.from(buttons) as HTMLButtonElement[];
      const lastBtn = allButtons[allButtons.length - 1];
      const nextBtn = allButtons[allButtons.length - 2];
      expect(lastBtn.disabled).toBe(true);
      expect(nextBtn.disabled).toBe(true);
    });
  });

  describe("page buttons", () => {
    it("should mark current page as active", () => {
      fixture.detectChanges();
      const activeBtn = fixture.nativeElement.querySelector(".pg-btn--active");
      expect(activeBtn).toBeTruthy();
      expect(activeBtn.textContent.trim()).toBe("1");
    });

    it("should navigate on page button click", () => {
      fixture.detectChanges();
      const pageButtons =
        fixture.nativeElement.querySelectorAll(".pg-btn--page");
      // Click page 2
      if (pageButtons.length > 1) {
        pageButtons[1].click();
        fixture.detectChanges();
        expect(component.pageIndex()).toBe(1);
      }
    });
  });

  describe("page size selector", () => {
    it("should render page size options", () => {
      fixture.detectChanges();
      const options = fixture.nativeElement.querySelectorAll(
        ".pg-size-select option",
      );
      expect(options.length).toBe(4); // 10, 25, 50, 100
    });

    it("should hide selector when pageSizeOptions is empty", () => {
      fixture.componentRef.setInput("pageSizeOptions", []);
      fixture.detectChanges();
      const selector = fixture.nativeElement.querySelector(".pg-size");
      expect(selector).toBeFalsy();
    });
  });

  describe("accessibility", () => {
    it("should have aria-label on nav", () => {
      expect(fixture.nativeElement.getAttribute("aria-label")).toBe(
        "Pagination",
      );
    });

    it("should set aria-current on active page", () => {
      fixture.detectChanges();
      const activeBtn = fixture.nativeElement.querySelector(".pg-btn--active");
      expect(activeBtn.getAttribute("aria-current")).toBe("page");
    });

    it("should have aria-labels on nav buttons", () => {
      fixture.detectChanges();
      const firstBtn = fixture.nativeElement.querySelector(
        '[aria-label="First page"]',
      );
      const prevBtn = fixture.nativeElement.querySelector(
        '[aria-label="Previous page"]',
      );
      const nextBtn = fixture.nativeElement.querySelector(
        '[aria-label="Next page"]',
      );
      const lastBtn = fixture.nativeElement.querySelector(
        '[aria-label="Last page"]',
      );
      expect(firstBtn).toBeTruthy();
      expect(prevBtn).toBeTruthy();
      expect(nextBtn).toBeTruthy();
      expect(lastBtn).toBeTruthy();
    });
  });
});
