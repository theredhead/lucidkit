import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UISplitContainer } from "./split-container.component";
import { UISplitPanel } from "./split-panel.component";
import type {
  SplitOrientation,
  SplitResizeEvent,
} from "./split-container.types";

@Component({
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  template: `
    <div style="width: 800px; height: 400px;">
      <ui-split-container
        [orientation]="orientation()"
        [initialSizes]="initialSizes()"
        [name]="name()"
        [dividerWidth]="dividerWidth()"
        (resized)="onResized($event)"
        (resizing)="onResizing($event)"
      >
        <ui-split-panel>First panel</ui-split-panel>
        <ui-split-panel>Second panel</ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class TestHost {
  public readonly orientation = signal<SplitOrientation>("horizontal");
  public readonly initialSizes = signal<number[]>([50, 50]);
  public readonly name = signal<string | undefined>(undefined);
  public readonly dividerWidth = signal(6);
  public readonly resizedEvents: SplitResizeEvent[] = [];
  public readonly resizingEvents: SplitResizeEvent[] = [];

  public onResized(event: SplitResizeEvent): void {
    this.resizedEvents.push(event);
  }

  public onResizing(event: SplitResizeEvent): void {
    this.resizingEvents.push(event);
  }
}

// ── TestHost for constraint tests ─────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  template: `
    <div style="width: 800px; height: 400px;">
      <ui-split-container>
        <ui-split-panel [min]="150" [max]="400">Sidebar</ui-split-panel>
        <ui-split-panel [min]="200">Main</ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class TestHostConstrained {}

// ── TestHost for three-panel tests ────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  template: `
    <div style="width: 900px; height: 400px;">
      <ui-split-container [initialSizes]="[20, 60, 20]">
        <ui-split-panel>Nav</ui-split-panel>
        <ui-split-panel>Editor</ui-split-panel>
        <ui-split-panel>Inspector</ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class TestHostThreePanels {}

describe("UISplitContainer", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TestHost, TestHostConstrained, TestHostThreePanels],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should create", () => {
    const el = fixture.nativeElement.querySelector("ui-split-container");
    expect(el).toBeTruthy();
  });

  it("should render two panels and a divider", () => {
    const panels = fixture.nativeElement.querySelectorAll(".panel");
    const divider = fixture.nativeElement.querySelector(".divider");
    expect(panels.length).toBe(2);
    expect(divider).toBeTruthy();
  });

  it("should project content into panels", () => {
    const panels = fixture.nativeElement.querySelectorAll(".panel");
    expect(panels[0].textContent.trim()).toBe("First panel");
    expect(panels[1].textContent.trim()).toBe("Second panel");
  });

  describe("defaults", () => {
    it("should default to horizontal orientation", () => {
      const el = fixture.nativeElement.querySelector("ui-split-container");
      expect(el.classList.contains("horizontal")).toBe(true);
    });

    it("should default to 50/50 split", () => {
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([50, 50]);
    });

    it("should default dividerWidth to 6", () => {
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.dividerWidth()).toBe(6);
    });
  });

  describe("orientation", () => {
    it("should apply vertical host class", () => {
      host.orientation.set("vertical");
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector("ui-split-container");
      expect(el.classList.contains("vertical")).toBe(true);
    });

    it("should set aria-orientation on divider", () => {
      host.orientation.set("vertical");
      fixture.detectChanges();
      const divider = fixture.nativeElement.querySelector(".divider");
      expect(divider.getAttribute("aria-orientation")).toBe("vertical");
    });
  });

  describe("initial sizes", () => {
    it("should respect custom initial sizes", () => {
      const f = TestBed.createComponent(TestHost);
      f.componentInstance.initialSizes.set([30, 70]);
      f.detectChanges();
      const split = f.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([30, 70]);
    });
  });

  describe("double-click collapse", () => {
    it("should collapse the smaller panel on double-click", () => {
      const divider = fixture.nativeElement.querySelector(".divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      // With equal panels, the left (index 0) is collapsed (a <= b rule)
      expect(split.sizes()[0]).toBe(0);
      expect(split.sizes()[1]).toBe(100);
    });

    it("should restore to equal share on second double-click", () => {
      const divider = fixture.nativeElement.querySelector(".divider");

      // First dblclick: collapse
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()[0]).toBe(0);

      // Second dblclick: restore
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      expect(split.sizes()[0]).toBe(50);
      expect(split.sizes()[1]).toBe(50);
    });

    it("should emit resized event on double-click collapse", () => {
      const divider = fixture.nativeElement.querySelector(".divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      expect(host.resizedEvents.length).toBe(1);
      expect(host.resizedEvents[0].sizes[0]).toBe(0);
    });
  });

  describe("divider", () => {
    it("should have role=separator", () => {
      const divider = fixture.nativeElement.querySelector(".divider");
      expect(divider.getAttribute("role")).toBe("separator");
    });

    it("should be focusable", () => {
      const divider = fixture.nativeElement.querySelector(".divider");
      expect(divider.getAttribute("tabindex")).toBe("0");
    });

    it("should have aria-valuenow reflecting panel 0 percentage", () => {
      const divider = fixture.nativeElement.querySelector(".divider");
      expect(divider.getAttribute("aria-valuenow")).toBe("50");
    });
  });

  describe("localStorage persistence", () => {
    it("should save sizes to localStorage when named", () => {
      host.name.set("test-split");
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(".divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      const stored = localStorage.getItem("ui-split-container:test-split");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual([0, 100]);
    });

    it("should not save to localStorage when unnamed", () => {
      const divider = fixture.nativeElement.querySelector(".divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("ui-split-container:"),
      );
      expect(keys.length).toBe(0);
    });

    it("should restore sizes from localStorage on init", () => {
      localStorage.setItem(
        "ui-split-container:restore-test",
        JSON.stringify([25, 75]),
      );

      const f = TestBed.createComponent(TestHost);
      f.componentInstance.name.set("restore-test");
      f.detectChanges();

      const split = f.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([25, 75]);
    });
  });

  describe("divider width", () => {
    it("should apply custom divider width as CSS variable", () => {
      host.dividerWidth.set(10);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        "ui-split-container",
      ) as HTMLElement;
      expect(el.style.getPropertyValue("--ui-divider-width")).toBe("10px");
    });
  });

  describe("keyboard navigation", () => {
    function getSplit(): UISplitContainer {
      return fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
    }

    it("should increase first panel by 1% on ArrowRight", () => {
      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      divider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      const split = getSplit();
      expect(split.sizes()[0]).toBeGreaterThan(50);
    });

    it("should decrease first panel by 1% on ArrowLeft", () => {
      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      divider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowLeft",
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      const split = getSplit();
      expect(split.sizes()[0]).toBeLessThan(50);
    });

    it("should step by 5% when Shift is held", () => {
      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      divider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          shiftKey: true,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      const split = getSplit();
      expect(split.sizes()[0]).toBeGreaterThanOrEqual(55);
    });

    it("should use ArrowUp/ArrowDown in vertical mode", () => {
      host.orientation.set("vertical");
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      divider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowDown",
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      const split = getSplit();
      expect(split.sizes()[0]).toBeGreaterThan(50);
    });

    it("should ignore ArrowLeft/ArrowRight in vertical mode", () => {
      host.orientation.set("vertical");
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      divider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      const split = getSplit();
      expect(split.sizes()).toEqual([50, 50]);
    });

    it("should emit resized event on keyboard resize", () => {
      host.name.set("kb-test");
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      divider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      expect(host.resizedEvents.length).toBe(1);
    });

    it("should save sizes after keyboard resize when named", () => {
      host.name.set("kb-persist");
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      divider.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      const stored = localStorage.getItem("ui-split-container:kb-persist");
      expect(stored).toBeTruthy();
    });
  });

  describe("three-panel layout", () => {
    let threePanelFixture: ComponentFixture<TestHostThreePanels>;

    beforeEach(() => {
      threePanelFixture = TestBed.createComponent(TestHostThreePanels);
      threePanelFixture.detectChanges();
    });

    it("should render three panels and two dividers", () => {
      const panels = threePanelFixture.nativeElement.querySelectorAll(".panel");
      const dividers = threePanelFixture.nativeElement.querySelectorAll(".divider");
      expect(panels.length).toBe(3);
      expect(dividers.length).toBe(2);
    });

    it("should use initial sizes [20, 60, 20]", () => {
      const split = threePanelFixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([20, 60, 20]);
    });

    it("dividers should have correct aria-valuenow", () => {
      const dividers = threePanelFixture.nativeElement.querySelectorAll(".divider");
      expect(dividers[0].getAttribute("aria-valuenow")).toBe("20");
      expect(dividers[1].getAttribute("aria-valuenow")).toBe("60");
    });
  });

  describe("constraints (UISplitPanel)", () => {
    let constrainedFixture: ComponentFixture<TestHostConstrained>;

    beforeEach(() => {
      constrainedFixture = TestBed.createComponent(TestHostConstrained);
      constrainedFixture.detectChanges();
    });

    it("should render constrained panels", () => {
      const panels = constrainedFixture.nativeElement.querySelectorAll(".panel");
      expect(panels.length).toBe(2);
    });

    it("should default to equal split when no initialSizes are given", () => {
      const split = constrainedFixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([50, 50]);
    });
  });

  describe("pointer drag (pointerdown / pointermove / pointerup)", () => {
    function getSplit(): UISplitContainer {
      return fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
    }

    function mockContainerRect(w = 800, h = 400): () => void {
      const container = fixture.nativeElement.querySelector(
        ".container",
      ) as HTMLElement;
      const orig = container.getBoundingClientRect.bind(container);
      container.getBoundingClientRect = () => ({
        width: w,
        height: h,
        top: 0,
        left: 0,
        bottom: h,
        right: w,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });
      return () => {
        container.getBoundingClientRect = orig;
      };
    }

    function mockDivider(): HTMLElement {
      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      if (!divider.setPointerCapture) {
        divider.setPointerCapture = () => {};
      } else {
        vi.spyOn(divider, "setPointerCapture").mockImplementation(() => {});
      }
      return divider;
    }

    it("should set dragging=true on pointerdown", () => {
      const split = getSplit();
      const divider = mockDivider();
      const restore = mockContainerRect();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      restore();

      expect(split.dragging()).toBe(true);
    });

    it("should update sizes on pointermove while dragging", () => {
      const split = getSplit();
      const divider = mockDivider();
      const restore = mockContainerRect();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      // Move to ~30% (240px out of 800px usable)
      divider.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 1,
          clientX: 240,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      restore();

      const sizes = split.sizes();
      expect(sizes[0]).toBeLessThan(50);
      expect(sizes[0] + sizes[1]).toBeCloseTo(100, 0);
    });

    it("should emit resizing event on pointermove", () => {
      const divider = mockDivider();
      const restore = mockContainerRect();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      divider.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 1,
          clientX: 300,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      restore();

      expect(host.resizingEvents.length).toBeGreaterThan(0);
    });

    it("should set dragging=false on pointerup", () => {
      const split = getSplit();
      const divider = mockDivider();
      const restore = mockContainerRect();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      divider.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      restore();

      expect(split.dragging()).toBe(false);
    });

    it("should emit resized event on pointerup", () => {
      const divider = mockDivider();
      const restore = mockContainerRect();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      divider.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      restore();

      expect(host.resizedEvents.length).toBe(1);
    });

    it("should stop dragging on pointercancel", () => {
      const split = getSplit();
      const divider = mockDivider();
      const restore = mockContainerRect();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      divider.dispatchEvent(
        new PointerEvent("pointercancel", {
          pointerId: 1,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      restore();

      expect(split.dragging()).toBe(false);
    });

    it("should work in vertical orientation during drag", () => {
      host.orientation.set("vertical");
      fixture.detectChanges();

      const split = getSplit();
      const divider = mockDivider();
      const restore = mockContainerRect();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 200,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      divider.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 1,
          clientX: 200,
          clientY: 100,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      restore();

      const sizes = split.sizes();
      expect(sizes[0] + sizes[1]).toBeCloseTo(100, 0);
    });

    it("should save sizes after drag when named", () => {
      host.name.set("drag-test");
      fixture.detectChanges();

      const divider = mockDivider();
      const restore = mockContainerRect();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 400,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      divider.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
      restore();

      expect(
        localStorage.getItem("ui-split-container:drag-test"),
      ).not.toBeNull();
      localStorage.removeItem("ui-split-container:drag-test");
    });

    it("should not change sizes when usableSize is zero (container has no size)", () => {
      const split = getSplit();
      const initialSizes = [...split.sizes()];
      // Do NOT mock getBoundingClientRect → jsdom returns 0 by default → usableSize = 0
      const divider = mockDivider();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 400,
          bubbles: true,
        }),
      );
      divider.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 1,
          clientX: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      // Sizes should not change due to guard (usableSize <= 0)
      expect(split.sizes()).toEqual(initialSizes);
    });
  });

  describe("double-click toggle restore", () => {
    function getSplit(): UISplitContainer {
      return fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
    }

    it("should restore 50/50 when left panel is collapsed (a < 1)", () => {
      const split = getSplit();
      // First dblclick collapses the left panel (a <= b when a=50, b=50 → collapse a)
      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      // Left should now be 0
      expect(split.sizes()[0]).toBe(0);

      // Second dblclick should restore both to 50
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      expect(split.sizes()[0]).toBeGreaterThan(0);
      expect(split.sizes()[1]).toBeGreaterThan(0);
    });

    it("should collapse the right panel and restore when b < 1 toggle", () => {
      const split = getSplit();
      // Manually set internal sizes so right panel is collapsed (b < 1)
      (split as any)._sizes.set([100, 0]);
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".divider",
      ) as HTMLElement;
      // dblclick should restore to 50/50 (b < 1 branch)
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      expect(split.sizes()[0]).toBeGreaterThan(0);
      expect(split.sizes()[1]).toBeGreaterThan(0);
    });
  });
});
