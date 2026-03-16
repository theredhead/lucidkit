import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UISplitContainer } from "./split-container.component";
import type {
  SplitCollapseTarget,
  SplitOrientation,
  SplitPanelConstraints,
  SplitResizeEvent,
} from "./split-container.types";

@Component({
  standalone: true,
  imports: [UISplitContainer],
  template: `
    <div style="width: 800px; height: 400px;">
      <ui-split-container
        [orientation]="orientation()"
        [initialSizes]="initialSizes()"
        [name]="name()"
        [dividerWidth]="dividerWidth()"
        [collapseTarget]="collapseTarget()"
        [firstConstraints]="firstConstraints()"
        [secondConstraints]="secondConstraints()"
        (resized)="onResized($event)"
        (resizing)="onResizing($event)"
      >
        <div first>First panel</div>
        <div second>Second panel</div>
      </ui-split-container>
    </div>
  `,
})
class TestHost {
  public readonly orientation = signal<SplitOrientation>("horizontal");
  public readonly initialSizes = signal<readonly [number, number]>([50, 50]);
  public readonly name = signal<string | undefined>(undefined);
  public readonly dividerWidth = signal(6);
  public readonly collapseTarget = signal<SplitCollapseTarget>("none");
  public readonly firstConstraints = signal<SplitPanelConstraints>({});
  public readonly secondConstraints = signal<SplitPanelConstraints>({});
  public readonly resizedEvents: SplitResizeEvent[] = [];
  public readonly resizingEvents: SplitResizeEvent[] = [];

  public onResized(event: SplitResizeEvent): void {
    this.resizedEvents.push(event);
  }

  public onResizing(event: SplitResizeEvent): void {
    this.resizingEvents.push(event);
  }
}

describe("UISplitContainer", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TestHost],
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
    const panels = fixture.nativeElement.querySelectorAll(".sc-panel");
    const divider = fixture.nativeElement.querySelector(".sc-divider");
    expect(panels.length).toBe(2);
    expect(divider).toBeTruthy();
  });

  it("should project content into panels", () => {
    const panels = fixture.nativeElement.querySelectorAll(".sc-panel");
    expect(panels[0].textContent.trim()).toBe("First panel");
    expect(panels[1].textContent.trim()).toBe("Second panel");
  });

  describe("defaults", () => {
    it("should default to horizontal orientation", () => {
      const el = fixture.nativeElement.querySelector("ui-split-container");
      expect(el.classList.contains("ui-split-container--horizontal")).toBe(
        true,
      );
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

    it("should default collapseTarget to 'none'", () => {
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.collapseTarget()).toBe("none");
    });
  });

  describe("orientation", () => {
    it("should apply vertical host class", () => {
      host.orientation.set("vertical");
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector("ui-split-container");
      expect(el.classList.contains("ui-split-container--vertical")).toBe(true);
    });

    it("should set aria-orientation on divider", () => {
      host.orientation.set("vertical");
      fixture.detectChanges();
      const divider = fixture.nativeElement.querySelector(".sc-divider");
      expect(divider.getAttribute("aria-orientation")).toBe("vertical");
    });
  });

  describe("initial sizes", () => {
    it("should respect custom initial sizes", () => {
      host.initialSizes.set([30, 70]);
      fixture.detectChanges();
      // Re-create to apply ngAfterViewInit with new sizes
      fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.initialSizes.set([30, 70]);
      fixture.detectChanges();
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      // ngAfterViewInit runs after detectChanges
      expect(split.sizes()).toEqual([30, 70]);
    });
  });

  describe("double-click collapse", () => {
    it("should not collapse when collapseTarget is 'none'", () => {
      const divider = fixture.nativeElement.querySelector(".sc-divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([50, 50]);
    });

    it("should collapse first panel on double-click", () => {
      host.collapseTarget.set("first");
      fixture.detectChanges();
      const divider = fixture.nativeElement.querySelector(".sc-divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([0, 100]);
    });

    it("should collapse second panel on double-click", () => {
      host.collapseTarget.set("second");
      fixture.detectChanges();
      const divider = fixture.nativeElement.querySelector(".sc-divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([100, 0]);
    });

    it("should restore sizes on second double-click", () => {
      host.collapseTarget.set("first");
      fixture.detectChanges();
      const divider = fixture.nativeElement.querySelector(".sc-divider");

      // First dblclick: collapse
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      const split = fixture.debugElement.children[0].children[0]
        .componentInstance as UISplitContainer;
      expect(split.sizes()).toEqual([0, 100]);

      // Second dblclick: restore
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      expect(split.sizes()).toEqual([50, 50]);
    });

    it("should emit resized event on double-click collapse", () => {
      host.collapseTarget.set("first");
      fixture.detectChanges();
      const divider = fixture.nativeElement.querySelector(".sc-divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      expect(host.resizedEvents.length).toBe(1);
      expect(host.resizedEvents[0].sizes).toEqual([0, 100]);
    });
  });

  describe("divider", () => {
    it("should have role=separator", () => {
      const divider = fixture.nativeElement.querySelector(".sc-divider");
      expect(divider.getAttribute("role")).toBe("separator");
    });

    it("should be focusable", () => {
      const divider = fixture.nativeElement.querySelector(".sc-divider");
      expect(divider.getAttribute("tabindex")).toBe("0");
    });

    it("should have aria-valuenow reflecting first panel percentage", () => {
      const divider = fixture.nativeElement.querySelector(".sc-divider");
      expect(divider.getAttribute("aria-valuenow")).toBe("50");
    });
  });

  describe("localStorage persistence", () => {
    it("should save sizes to localStorage when named", () => {
      host.name.set("test-split");
      host.collapseTarget.set("first");
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(".sc-divider");
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      const stored = localStorage.getItem("ui-split-container:test-split");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual([0, 100]);
    });

    it("should not save to localStorage when unnamed", () => {
      host.collapseTarget.set("first");
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(".sc-divider");
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
});
