import { ComponentFixture, TestBed } from "@angular/core/testing";

import { type DrawerPosition, UIDrawer } from "./drawer.component";

describe("UIDrawer", () => {
  let component: UIDrawer;
  let fixture: ComponentFixture<UIDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(UIDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default open to false", () => {
      expect(component.open()).toBe(false);
    });

    it('should default position to "left"', () => {
      expect(component.position()).toBe("left");
    });

    it('should default width to "medium"', () => {
      expect(component.width()).toBe("medium");
    });

    it("should default closeOnBackdropClick to true", () => {
      expect(component.closeOnBackdropClick()).toBe(true);
    });

    it("should default closeOnEscape to true", () => {
      expect(component.closeOnEscape()).toBe(true);
    });
  });

  describe("visibility", () => {
    it("should not render panel when closed", () => {
      const panel = fixture.nativeElement.querySelector(".drawer-panel");
      expect(panel).toBeFalsy();
    });

    it("should render panel when open", () => {
      component.open.set(true);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(".drawer-panel");
      expect(panel).toBeTruthy();
    });

    it("should render backdrop when open", () => {
      component.open.set(true);
      fixture.detectChanges();
      const backdrop = fixture.nativeElement.querySelector(".drawer-backdrop");
      expect(backdrop).toBeTruthy();
    });
  });

  describe("position", () => {
    const positions: DrawerPosition[] = ["left", "right"];

    for (const pos of positions) {
      it(`should apply ${pos} host class`, () => {
        fixture.componentRef.setInput("position", pos);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList).toContain(`ui-drawer--${pos}`);
      });
    }
  });

  describe("width presets", () => {
    it('should resolve "narrow" to 16rem', () => {
      fixture.componentRef.setInput("width", "narrow");
      component.open.set(true);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(
        ".drawer-panel",
      ) as HTMLElement;
      expect(panel.style.width).toBe("16rem");
    });

    it('should resolve "medium" to 24rem', () => {
      component.open.set(true);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(
        ".drawer-panel",
      ) as HTMLElement;
      expect(panel.style.width).toBe("24rem");
    });

    it('should resolve "wide" to 36rem', () => {
      fixture.componentRef.setInput("width", "wide");
      component.open.set(true);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(
        ".drawer-panel",
      ) as HTMLElement;
      expect(panel.style.width).toBe("36rem");
    });

    it("should pass through custom CSS values", () => {
      fixture.componentRef.setInput("width", "400px");
      component.open.set(true);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(
        ".drawer-panel",
      ) as HTMLElement;
      expect(panel.style.width).toBe("400px");
    });
  });

  describe("close", () => {
    beforeEach(() => {
      component.open.set(true);
      fixture.detectChanges();
    });

    it("should close on close() call", () => {
      component.close();
      fixture.detectChanges();
      expect(component.open()).toBe(false);
    });

    it("should emit closed event", () => {
      const spy = vi.fn();
      component.closed.subscribe(spy);
      component.close();
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should close on backdrop click", () => {
      const backdrop = fixture.nativeElement.querySelector(
        ".drawer-backdrop",
      ) as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      expect(component.open()).toBe(false);
    });

    it("should not close on backdrop click when closeOnBackdropClick is false", () => {
      fixture.componentRef.setInput("closeOnBackdropClick", false);
      fixture.detectChanges();
      const backdrop = fixture.nativeElement.querySelector(
        ".drawer-backdrop",
      ) as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      expect(component.open()).toBe(true);
    });

    it("should close on Escape key", () => {
      const panel = fixture.nativeElement.querySelector(
        ".drawer-panel",
      ) as HTMLElement;
      panel.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      fixture.detectChanges();
      expect(component.open()).toBe(false);
    });

    it("should not close on Escape when closeOnEscape is false", () => {
      fixture.componentRef.setInput("closeOnEscape", false);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(
        ".drawer-panel",
      ) as HTMLElement;
      panel.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      fixture.detectChanges();
      expect(component.open()).toBe(true);
    });
  });

  describe("accessibility", () => {
    beforeEach(() => {
      component.open.set(true);
      fixture.detectChanges();
    });

    it('should have role="dialog"', () => {
      const panel = fixture.nativeElement.querySelector(".drawer-panel");
      expect(panel.getAttribute("role")).toBe("dialog");
    });

    it('should have aria-modal="true"', () => {
      const panel = fixture.nativeElement.querySelector(".drawer-panel");
      expect(panel.getAttribute("aria-modal")).toBe("true");
    });

    it("should have aria-label", () => {
      const panel = fixture.nativeElement.querySelector(".drawer-panel");
      expect(panel.getAttribute("aria-label")).toBe("Side panel");
    });

    it("should forward custom ariaLabel", () => {
      fixture.componentRef.setInput("ariaLabel", "Navigation menu");
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector(".drawer-panel");
      expect(panel.getAttribute("aria-label")).toBe("Navigation menu");
    });

    it('should have aria-hidden="true" on backdrop', () => {
      const backdrop = fixture.nativeElement.querySelector(".drawer-backdrop");
      expect(backdrop.getAttribute("aria-hidden")).toBe("true");
    });
  });
});
