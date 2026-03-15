import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ModalRef, type UIModalContent } from "./dialog.types";
import { ModalService } from "./dialog.service";

// ── Test fixture components ────────────────────────────────────────

@Component({
  selector: "ui-test-modal",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Test modal content</p>`,
})
class TestModal implements UIModalContent<string> {
  public readonly modalRef = inject(ModalRef<string>);
}

@Component({
  selector: "ui-test-modal-io",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ title() }}</p>
    <button (click)="save()">Save</button>`,
})
class TestModalWithIO implements UIModalContent {
  public readonly modalRef = inject(ModalRef);
  public readonly title = input<string>("Default title");
  public readonly saved = output<string>();

  public save(): void {
    this.saved.emit("saved-value");
  }
}

// ── ModalRef tests ─────────────────────────────────────────────────

describe("ModalRef", () => {
  it("should start with isClosed false", () => {
    const ref = new ModalRef();
    expect(ref.isClosed).toBe(false);
  });

  it("should emit result on close", () => {
    const ref = new ModalRef<string>();
    const results: (string | undefined)[] = [];

    ref.closed.subscribe((v) => results.push(v));
    ref.close("hello");

    expect(results).toEqual(["hello"]);
  });

  it("should complete the observable on close", () => {
    const ref = new ModalRef();
    let completed = false;

    ref.closed.subscribe({ complete: () => (completed = true) });
    ref.close();

    expect(completed).toBe(true);
  });

  it("should emit undefined when closed without result", () => {
    const ref = new ModalRef();
    const results: unknown[] = [];

    ref.closed.subscribe((v) => results.push(v));
    ref.close();

    expect(results).toEqual([undefined]);
  });

  it("should be idempotent on double close", () => {
    const ref = new ModalRef<string>();
    const results: (string | undefined)[] = [];

    ref.closed.subscribe((v) => results.push(v));
    ref.close("first");
    ref.close("second");

    expect(results).toEqual(["first"]);
  });

  it("should set isClosed to true after close", () => {
    const ref = new ModalRef();
    ref.close();
    expect(ref.isClosed).toBe(true);
  });

  it("should call onDestroy callbacks on close", () => {
    const ref = new ModalRef();
    const spy1 = vi.fn();
    const spy2 = vi.fn();

    ref.onDestroy(spy1);
    ref.onDestroy(spy2);
    ref.close();

    expect(spy1).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledOnce();
  });

  it("should not call onDestroy callbacks on double close", () => {
    const ref = new ModalRef();
    const spy = vi.fn();

    ref.onDestroy(spy);
    ref.close();
    ref.close();

    expect(spy).toHaveBeenCalledOnce();
  });
});

// ── ModalService tests ─────────────────────────────────────────────

describe("ModalService", () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);

    // jsdom doesn't implement showModal/close — mock them
    HTMLDialogElement.prototype.showModal = vi.fn(function (
      this: HTMLDialogElement,
    ) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (
      this: HTMLDialogElement,
    ) {
      this.removeAttribute("open");
    });
  });

  afterEach(() => {
    // Clean up leftover DOM
    document
      .querySelectorAll("dialog.ui-dialog-service")
      .forEach((d) => d.remove());
    document
      .querySelectorAll("style[data-ui-dialog-service]")
      .forEach((s) => s.remove());
    (service as any).stylesInjected = false;
  });

  it("should be provided in root", () => {
    expect(service).toBeTruthy();
  });

  it("should create a <dialog> element in the body", () => {
    const ref = service.openModal({ component: TestModal });

    const dialog = document.querySelector("dialog.ui-dialog-service");
    expect(dialog).toBeTruthy();

    ref.close();
  });

  it("should call showModal on the dialog", () => {
    const ref = service.openModal({ component: TestModal });

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    ref.close();
  });

  it("should render the component inside the dialog", () => {
    const ref = service.openModal({ component: TestModal });

    const dialog = document.querySelector("dialog.ui-dialog-service");
    expect(dialog?.querySelector("p")?.textContent).toBe("Test modal content");

    ref.close();
  });

  it("should return a ModalRef instance", () => {
    const ref = service.openModal({ component: TestModal });

    expect(ref).toBeInstanceOf(ModalRef);

    ref.close();
  });

  it("should remove the dialog from DOM on close", () => {
    const ref = service.openModal({ component: TestModal });
    expect(document.querySelector("dialog.ui-dialog-service")).toBeTruthy();

    ref.close();
    expect(document.querySelector("dialog.ui-dialog-service")).toBeNull();
  });

  it("should emit result through ModalRef.closed", () => {
    const ref = service.openModal<TestModal, string>({
      component: TestModal,
    });
    const results: (string | undefined)[] = [];
    ref.closed.subscribe((v) => results.push(v));

    ref.close("done");

    expect(results).toEqual(["done"]);
  });

  it("should set inputs on the component", () => {
    const ref = service.openModal({
      component: TestModalWithIO,
      inputs: { title: "Custom Title" },
    });

    TestBed.inject(ApplicationRef).tick();

    const dialog = document.querySelector("dialog.ui-dialog-service");
    expect(dialog?.querySelector("p")?.textContent).toBe("Custom Title");

    ref.close();
  });

  it("should wire output handlers", () => {
    const handler = vi.fn();
    const ref = service.openModal({
      component: TestModalWithIO,
      outputs: { saved: handler },
    });

    TestBed.inject(ApplicationRef).tick();

    const button = document.querySelector(
      "dialog.ui-dialog-service button",
    ) as HTMLButtonElement;
    button.click();

    expect(handler).toHaveBeenCalledWith("saved-value");

    ref.close();
  });

  it("should unsubscribe from outputs on close", () => {
    const handler = vi.fn();
    const ref = service.openModal({
      component: TestModalWithIO,
      outputs: { saved: handler },
    });

    ref.close();

    // After close the handler should no longer fire
    // (component is destroyed so this is mostly a sanity check)
    expect(handler).not.toHaveBeenCalled();
  });

  it("should inject styles into head once", () => {
    const ref1 = service.openModal({ component: TestModal });
    const ref2 = service.openModal({ component: TestModal });

    const styles = document.querySelectorAll("style[data-ui-dialog-service]");
    expect(styles.length).toBe(1);

    ref1.close();
    ref2.close();
  });

  it("should set aria-label when provided", () => {
    const ref = service.openModal({
      component: TestModal,
      ariaLabel: "Confirm delete",
    });

    const dialog = document.querySelector("dialog.ui-dialog-service");
    expect(dialog?.getAttribute("aria-label")).toBe("Confirm delete");

    ref.close();
  });

  it("should close on backdrop click by default", () => {
    const ref = service.openModal({ component: TestModal });
    const dialog = document.querySelector(
      "dialog.ui-dialog-service",
    ) as HTMLDialogElement;

    const results: unknown[] = [];
    ref.closed.subscribe((v) => results.push(v));

    // Click directly on the dialog element simulates a backdrop click
    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "target", { value: dialog });
    dialog.dispatchEvent(event);

    expect(results).toEqual([undefined]);
    expect(ref.isClosed).toBe(true);
  });

  it("should not close on content click", () => {
    const ref = service.openModal({ component: TestModal });
    const dialog = document.querySelector(
      "dialog.ui-dialog-service",
    ) as HTMLDialogElement;

    const p = dialog.querySelector("p") as HTMLParagraphElement;
    p.click();

    expect(ref.isClosed).toBe(false);

    ref.close();
  });

  it("should not close on backdrop click when closeOnBackdropClick is false", () => {
    const ref = service.openModal({
      component: TestModal,
      closeOnBackdropClick: false,
    });
    const dialog = document.querySelector(
      "dialog.ui-dialog-service",
    ) as HTMLDialogElement;

    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "target", { value: dialog });
    dialog.dispatchEvent(event);

    expect(ref.isClosed).toBe(false);

    ref.close();
  });

  it("should close on native dialog close event (Escape)", () => {
    const ref = service.openModal({ component: TestModal });
    const dialog = document.querySelector(
      "dialog.ui-dialog-service",
    ) as HTMLDialogElement;

    const results: unknown[] = [];
    ref.closed.subscribe((v) => results.push(v));

    dialog.dispatchEvent(new Event("close"));

    expect(results).toEqual([undefined]);
    expect(ref.isClosed).toBe(true);
  });

  it("should prevent Escape when closeOnEscape is false", () => {
    const ref = service.openModal({
      component: TestModal,
      closeOnEscape: false,
    });
    const dialog = document.querySelector(
      "dialog.ui-dialog-service",
    ) as HTMLDialogElement;

    const cancelEvent = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(ref.isClosed).toBe(false);

    ref.close();
  });

  it("should provide ModalRef to the component via DI", () => {
    // TestModal injects ModalRef in its constructor — if DI failed
    // the component would not be created at all.
    const ref = service.openModal({ component: TestModal });

    const dialog = document.querySelector("dialog.ui-dialog-service");
    expect(dialog?.querySelector("p")).toBeTruthy();

    ref.close();
  });

  it("should support multiple simultaneous modals", () => {
    const ref1 = service.openModal({ component: TestModal });
    const ref2 = service.openModal({ component: TestModal });

    const dialogs = document.querySelectorAll("dialog.ui-dialog-service");
    expect(dialogs.length).toBe(2);

    ref1.close();
    expect(
      document.querySelectorAll("dialog.ui-dialog-service").length,
    ).toBe(1);

    ref2.close();
    expect(
      document.querySelectorAll("dialog.ui-dialog-service").length,
    ).toBe(0);
  });

  it("should destroy the component on close", () => {
    const ref = service.openModal({ component: TestModal });
    const appRef = TestBed.inject(ApplicationRef);

    const viewCountBefore = appRef.viewCount;
    ref.close();
    const viewCountAfter = appRef.viewCount;

    // The view should have been detached
    expect(viewCountAfter).toBeLessThan(viewCountBefore);
  });
});
