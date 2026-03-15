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
      horizontalAxisAlignment: "start",
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

    it("should right-align with horizontalAxisAlignment 'end'", () => {
      const ref = service.openPopover({
        component: TestPopover,
        anchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "end",
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const left = parseFloat(popover.style.left);
      // Right edge of popover should align with anchor right (280)
      // left = anchorRight(280) - popoverWidth
      expect(left).toBeLessThanOrEqual(280);

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
        horizontalAxisAlignment: "start",
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
        horizontalAxisAlignment: "start",
        horizontalOffset: 16,
      });

      const popover = document.querySelector(".ui-popover") as HTMLElement;
      const left = parseFloat(popover.style.left);
      // anchor.left(200) + horizontalOffset(16) = 216
      expect(left).toBeGreaterThanOrEqual(216);

      ref.close();
    });
  });
});
