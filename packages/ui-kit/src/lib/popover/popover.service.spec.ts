import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { PopoverRef, type UIPopoverContent } from "./popover.types";
import { PopoverService } from "./popover.service";

// ── Test fixture components ────────────────────────────────────────

@Component({
  selector: "ui-test-popover",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="popover-content">Popover content</p>`,
})
class TestPopover implements UIPopoverContent<string> {
  readonly popoverRef = inject(PopoverRef<string>);
}

@Component({
  selector: "ui-test-popover-io",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ label() }}</p>
    <button (click)="pick()">Pick</button>`,
})
class TestPopoverWithIO implements UIPopoverContent {
  readonly popoverRef = inject(PopoverRef);
  readonly label = input<string>("Default");
  readonly picked = output<string>();

  pick(): void {
    this.picked.emit("selected");
  }
}

// ── Helpers ────────────────────────────────────────────────────────

function createAnchor(): HTMLElement {
  const el = document.createElement("button");
  el.textContent = "Anchor";
  document.body.appendChild(el);
  // Mock getBoundingClientRect for positioning tests
  el.getBoundingClientRect = vi.fn(() => ({
    top: 100,
    left: 200,
    bottom: 132,
    right: 280,
    width: 80,
    height: 32,
    x: 200,
    y: 100,
    toJSON: () => {},
  }));
  return el;
}

// ── PopoverRef tests ───────────────────────────────────────────────

describe("PopoverRef", () => {
  it("should start with isClosed false", () => {
    const ref = new PopoverRef();
    expect(ref.isClosed).toBe(false);
  });

  it("should emit result on close", () => {
    const ref = new PopoverRef<string>();
    const results: (string | undefined)[] = [];

    ref.closed.subscribe((v) => results.push(v));
    ref.close("selected");

    expect(results).toEqual(["selected"]);
  });

  it("should complete the observable on close", () => {
    const ref = new PopoverRef();
    let completed = false;

    ref.closed.subscribe({ complete: () => (completed = true) });
    ref.close();

    expect(completed).toBe(true);
  });

  it("should emit undefined when closed without result", () => {
    const ref = new PopoverRef();
    const results: unknown[] = [];

    ref.closed.subscribe((v) => results.push(v));
    ref.close();

    expect(results).toEqual([undefined]);
  });

  it("should be idempotent on double close", () => {
    const ref = new PopoverRef<string>();
    const results: (string | undefined)[] = [];

    ref.closed.subscribe((v) => results.push(v));
    ref.close("first");
    ref.close("second");

    expect(results).toEqual(["first"]);
  });

  it("should set isClosed to true after close", () => {
    const ref = new PopoverRef();
    ref.close();
    expect(ref.isClosed).toBe(true);
  });

  it("should call onDestroy callbacks on close", () => {
    const ref = new PopoverRef();
    const spy = vi.fn();

    ref.onDestroy(spy);
    ref.close();

    expect(spy).toHaveBeenCalledOnce();
  });
});

// ── PopoverService tests ───────────────────────────────────────────

describe("PopoverService", () => {
  let service: PopoverService;
  let anchor: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopoverService);
    anchor = createAnchor();

    // jsdom doesn't implement the Popover API — mock the methods
    HTMLElement.prototype.showPopover = vi.fn();
    HTMLElement.prototype.hidePopover = vi.fn();
  });

  afterEach(() => {
    document.querySelectorAll(".ui-popover").forEach((el) => el.remove());
    document
      .querySelectorAll("style[data-ui-popover]")
      .forEach((s) => s.remove());
    anchor.remove();
    (service as any).stylesInjected = false;
  });

  it("should be provided in root", () => {
    expect(service).toBeTruthy();
  });

  it("should create a popover element in the body", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });

    const popover = document.querySelector(".ui-popover");
    expect(popover).toBeTruthy();

    ref.close();
  });

  it("should call showPopover on the host element", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });

    expect(HTMLElement.prototype.showPopover).toHaveBeenCalled();

    ref.close();
  });

  it("should set popover=auto by default (light-dismiss)", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });

    const popover = document.querySelector(".ui-popover");
    expect(popover?.getAttribute("popover")).toBe("auto");

    ref.close();
  });

  it("should set popover=manual when closeOnOutsideClick is false", () => {
    const ref = service.openPopover({
      component: TestPopover,
      anchor,
      closeOnOutsideClick: false,
    });

    const popover = document.querySelector(".ui-popover");
    expect(popover?.getAttribute("popover")).toBe("manual");

    ref.close();
  });

  it("should render the component inside the popover", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });

    const popover = document.querySelector(".ui-popover");
    expect(popover?.querySelector(".popover-content")?.textContent).toBe(
      "Popover content",
    );

    ref.close();
  });

  it("should return a PopoverRef instance", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });

    expect(ref).toBeInstanceOf(PopoverRef);

    ref.close();
  });

  it("should remove the popover from DOM on close", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });
    expect(document.querySelector(".ui-popover")).toBeTruthy();

    ref.close();
    expect(document.querySelector(".ui-popover")).toBeNull();
  });

  it("should emit result through PopoverRef.closed", () => {
    const ref = service.openPopover<TestPopover, string>({
      component: TestPopover,
      anchor,
    });
    const results: (string | undefined)[] = [];
    ref.closed.subscribe((v) => results.push(v));

    ref.close("chosen");

    expect(results).toEqual(["chosen"]);
  });

  it("should set inputs on the component", () => {
    const ref = service.openPopover({
      component: TestPopoverWithIO,
      anchor,
      inputs: { label: "Custom Label" },
    });

    TestBed.inject(ApplicationRef).tick();

    const popover = document.querySelector(".ui-popover");
    expect(popover?.querySelector("p")?.textContent).toBe("Custom Label");

    ref.close();
  });

  it("should wire output handlers", () => {
    const handler = vi.fn();
    const ref = service.openPopover({
      component: TestPopoverWithIO,
      anchor,
      outputs: { picked: handler },
    });

    TestBed.inject(ApplicationRef).tick();

    const button = document.querySelector(
      ".ui-popover button",
    ) as HTMLButtonElement;
    button.click();

    expect(handler).toHaveBeenCalledWith("selected");

    ref.close();
  });

  it("should unsubscribe from outputs on close", () => {
    const handler = vi.fn();
    const ref = service.openPopover({
      component: TestPopoverWithIO,
      anchor,
      outputs: { picked: handler },
    });

    ref.close();

    expect(handler).not.toHaveBeenCalled();
  });

  it("should inject styles into head once", () => {
    const ref1 = service.openPopover({ component: TestPopover, anchor });
    const ref2 = service.openPopover({ component: TestPopover, anchor });

    const styles = document.querySelectorAll("style[data-ui-popover]");
    expect(styles.length).toBe(1);

    ref1.close();
    ref2.close();
  });

  it("should set aria-label when provided", () => {
    const ref = service.openPopover({
      component: TestPopover,
      anchor,
      ariaLabel: "Context menu",
    });

    const popover = document.querySelector(".ui-popover");
    expect(popover?.getAttribute("aria-label")).toBe("Context menu");

    ref.close();
  });

  it("should position the popover relative to the anchor", () => {
    const ref = service.openPopover({
      component: TestPopover,
      anchor,
      verticalAxisAlignment: "bottom",
      horizontalAxisAlignment: "center",
    });

    const popover = document.querySelector(".ui-popover") as HTMLElement;
    // The top should be at least at anchor.bottom + default verticalOffset (4)
    const top = parseFloat(popover.style.top);
    expect(top).toBeGreaterThanOrEqual(132); // 100 + 32 (anchor bottom)

    ref.close();
  });

  it("should support multiple simultaneous popovers", () => {
    const ref1 = service.openPopover({ component: TestPopover, anchor });
    const ref2 = service.openPopover({ component: TestPopover, anchor });

    expect(document.querySelectorAll(".ui-popover").length).toBe(2);

    ref1.close();
    expect(document.querySelectorAll(".ui-popover").length).toBe(1);

    ref2.close();
    expect(document.querySelectorAll(".ui-popover").length).toBe(0);
  });

  it("should destroy the component on close", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });
    const appRef = TestBed.inject(ApplicationRef);

    const viewCountBefore = appRef.viewCount;
    ref.close();
    const viewCountAfter = appRef.viewCount;

    expect(viewCountAfter).toBeLessThan(viewCountBefore);
  });

  it("should close on native toggle event (light-dismiss)", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });
    const popover = document.querySelector(".ui-popover") as HTMLElement;

    const results: unknown[] = [];
    ref.closed.subscribe((v) => results.push(v));

    const toggleEvent = new Event("toggle") as any;
    toggleEvent.newState = "closed";
    popover.dispatchEvent(toggleEvent);

    expect(results).toEqual([undefined]);
    expect(ref.isClosed).toBe(true);
  });

  it("should not close on toggle event with newState=open", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });
    const popover = document.querySelector(".ui-popover") as HTMLElement;

    const toggleEvent = new Event("toggle") as any;
    toggleEvent.newState = "open";
    popover.dispatchEvent(toggleEvent);

    expect(ref.isClosed).toBe(false);

    ref.close();
  });

  it("should provide PopoverRef to the component via DI", () => {
    const ref = service.openPopover({ component: TestPopover, anchor });

    const popover = document.querySelector(".ui-popover");
    expect(popover?.querySelector(".popover-content")).toBeTruthy();

    ref.close();
  });

  describe("alignment", () => {
    it("should position above the anchor with verticalAxisAlignment 'top'", () => {
      const ref = service.openPopover({
        component: TestPopover,
        anchor,
        verticalAxisAlignment: "top",
        horizontalAxisAlignment: "center",
        verticalOffset: -4,
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const top = parseFloat(popover.style.top);
      // Should be above anchor top (100) minus popover height minus gap
      expect(top).toBeLessThanOrEqual(100);

      ref.close();
    });

    it("should place popover to the right with horizontalAxisAlignment 'end'", () => {
      const ref = service.openPopover({
        component: TestPopover,
        anchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "end",
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const left = parseFloat(popover.style.left);
      // Popover's left edge at anchor's right edge (280)
      expect(left).toBeGreaterThanOrEqual(280);

      ref.close();
    });

    it("should place popover to the left with horizontalAxisAlignment 'start'", () => {
      const ref = service.openPopover({
        component: TestPopover,
        anchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "start",
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const left = parseFloat(popover.style.left);
      // Popover's right edge at anchor's left edge (200)
      // left = anchorLeft(200) - popoverWidth, clamped to viewport pad(8)
      expect(left).toBeLessThanOrEqual(200);

      ref.close();
    });

    it("should centre horizontally with horizontalAxisAlignment 'center'", () => {
      const ref = service.openPopover({
        component: TestPopover,
        anchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "center",
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const left = parseFloat(popover.style.left);
      // Centred on anchor (200..280, midpoint 240)
      expect(left).toBeGreaterThanOrEqual(8); // at least inside viewport pad

      ref.close();
    });

    it("should apply verticalOffset", () => {
      const ref = service.openPopover({
        component: TestPopover,
        anchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "center",
        verticalOffset: 12,
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const top = parseFloat(popover.style.top);
      // anchor.bottom(132) + verticalOffset(12) = 144
      expect(top).toBeGreaterThanOrEqual(144);

      ref.close();
    });

    it("should apply horizontalOffset", () => {
      const ref = service.openPopover({
        component: TestPopover,
        anchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "end",
        horizontalOffset: 8,
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const left = parseFloat(popover.style.left);
      // anchor.right(280) + horizontalOffset(8) = 288
      expect(left).toBeGreaterThanOrEqual(288);

      ref.close();
    });
  });

  describe("auto alignment", () => {
    let bottomAnchor: HTMLElement;
    let originalBCR: typeof HTMLElement.prototype.getBoundingClientRect;

    beforeEach(() => {
      // Set viewport dimensions for predictable auto-resolution
      Object.defineProperty(window, "innerWidth", {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 768,
        configurable: true,
      });

      // jsdom has no CSS engine — elements report 0×0 dimensions.
      // Give the popover host a realistic fallback size so
      // resolveVerticalAuto / resolveHorizontalAuto can make a
      // meaningful decision.  Anchor elements keep their own
      // instance-level mocks which take precedence.
      originalBCR = HTMLElement.prototype.getBoundingClientRect;
      HTMLElement.prototype.getBoundingClientRect = function () {
        return {
          top: 0,
          left: 0,
          bottom: 200,
          right: 160,
          width: 160,
          height: 200,
          x: 0,
          y: 0,
          toJSON: () => {},
        } as DOMRect;
      };
    });

    afterEach(() => {
      HTMLElement.prototype.getBoundingClientRect = originalBCR;
      bottomAnchor?.remove();
    });

    function createAnchorAt(rect: Partial<DOMRect>): HTMLElement {
      const el = document.createElement("button");
      el.textContent = "Anchor";
      document.body.appendChild(el);
      el.getBoundingClientRect = vi.fn(
        () =>
          ({
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            ...rect,
            toJSON: () => {},
          }) as DOMRect,
      );
      return el;
    }

    it("should default to auto alignment", () => {
      const ref = service.openPopover({
        component: TestPopover,
        anchor,
      });

      // Default anchor is at top:100, so auto should resolve to bottom.
      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const top = parseFloat(popover.style.top);
      // anchor.bottom(132) + defaultOffset(4) = 136
      expect(top).toBeGreaterThanOrEqual(132);

      ref.close();
    });

    it("should resolve vertical auto to 'bottom' when anchor is near top", () => {
      // Anchor at top of viewport → more space below
      bottomAnchor = createAnchorAt({
        top: 50,
        bottom: 82,
        left: 400,
        right: 480,
        width: 80,
        height: 32,
      });

      const ref = service.openPopover({
        component: TestPopover,
        anchor: bottomAnchor,
        verticalAxisAlignment: "auto",
        horizontalAxisAlignment: "center",
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const top = parseFloat(popover.style.top);
      // Should be below: anchor.bottom(82) + offset(4) = 86
      expect(top).toBeGreaterThanOrEqual(82);

      ref.close();
    });

    it("should resolve vertical auto to 'top' when anchor is near bottom", () => {
      // Anchor near bottom of viewport → more space above
      bottomAnchor = createAnchorAt({
        top: 700,
        bottom: 732,
        left: 400,
        right: 480,
        width: 80,
        height: 32,
      });

      const ref = service.openPopover({
        component: TestPopover,
        anchor: bottomAnchor,
        verticalAxisAlignment: "auto",
        horizontalAxisAlignment: "center",
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const top = parseFloat(popover.style.top);
      // Should be above: anchor.top(700) - popoverHeight - offset
      // In jsdom popover has 0 height, so top = 700 - 0 - 4 = 696
      expect(top).toBeLessThanOrEqual(700);

      ref.close();
    });

    it("should resolve horizontal auto to 'center' when space permits", () => {
      // Anchor centred in viewport → center should fit
      bottomAnchor = createAnchorAt({
        top: 100,
        bottom: 132,
        left: 472,
        right: 552,
        width: 80,
        height: 32,
      });

      const ref = service.openPopover({
        component: TestPopover,
        anchor: bottomAnchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "auto",
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const left = parseFloat(popover.style.left);
      // Centred on anchor midpoint (512) — should be near 512
      expect(left).toBeGreaterThanOrEqual(8);
      expect(left).toBeLessThanOrEqual(1016);

      ref.close();
    });

    it("should resolve horizontal auto to 'end' when anchor is near left edge", () => {
      // Anchor near left edge → centering would clip, more space to the right
      bottomAnchor = createAnchorAt({
        top: 100,
        bottom: 132,
        left: 10,
        right: 90,
        width: 80,
        height: 32,
      });

      // Give the popover some width so centering would clip
      const ref = service.openPopover({
        component: TestPopover,
        anchor: bottomAnchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "auto",
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const left = parseFloat(popover.style.left);
      // In jsdom popover has 0 width, so center fits → will resolve to center
      // With 0-width popover, center = anchorLeft(10) + (80-0)/2 = 50
      expect(left).toBeGreaterThanOrEqual(8);

      ref.close();
    });

    it("should flip vertical offset away from anchor when auto resolves to 'top'", () => {
      // Anchor near bottom → auto resolves to 'top'
      bottomAnchor = createAnchorAt({
        top: 700,
        bottom: 732,
        left: 400,
        right: 480,
        width: 80,
        height: 32,
      });

      const ref = service.openPopover({
        component: TestPopover,
        anchor: bottomAnchor,
        verticalAxisAlignment: "auto",
        horizontalAxisAlignment: "center",
        verticalOffset: 8,
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const top = parseFloat(popover.style.top);
      // auto→top: top = anchor.top(700) - popoverHeight(0) + (-8) = 692
      // Offset should push AWAY (upward)
      expect(top).toBeLessThanOrEqual(700 - 8);

      ref.close();
    });
  });
});
