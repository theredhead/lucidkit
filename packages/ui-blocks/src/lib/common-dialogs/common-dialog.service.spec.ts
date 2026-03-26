import { TestBed, type ComponentFixture } from "@angular/core/testing";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { ModalRef } from "@theredhead/ui-kit";

import { UIAlertDialog } from "./alert-dialog.component";
import { UIConfirmDialog } from "./confirm-dialog.component";
import { UIPromptDialog } from "./prompt-dialog.component";
import { UIAboutDialog } from "./about-dialog.component";
import { CommonDialogService } from "./common-dialog.service";

// ── Helpers ────────────────────────────────────────────────────────

function createWithModalRef<T>(
  component: new (...args: unknown[]) => T,
  inputs?: Record<string, unknown>,
): { fixture: ComponentFixture<T>; modalRef: ModalRef<unknown> } {
  const modalRef = new ModalRef();
  TestBed.configureTestingModule({
    imports: [component],
    providers: [{ provide: ModalRef, useValue: modalRef }],
  });
  const fixture = TestBed.createComponent(component);
  if (inputs) {
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
  }
  fixture.detectChanges();
  return { fixture, modalRef };
}

// ── UIAlertDialog ──────────────────────────────────────────────────

describe("UIAlertDialog", () => {
  it("should create", () => {
    const { fixture } = createWithModalRef(UIAlertDialog);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should render title and message", () => {
    const { fixture } = createWithModalRef(UIAlertDialog, {
      title: "Heads up",
      message: "Something happened",
    });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("Heads up");
    expect(el.textContent).toContain("Something happened");
  });

  it("should render custom button label", () => {
    const { fixture } = createWithModalRef(UIAlertDialog, {
      buttonLabel: "Got it",
    });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("Got it");
  });

  it("should close the modal on dismiss", () => {
    const { fixture, modalRef } = createWithModalRef(UIAlertDialog);
    const spy = vi.fn();
    modalRef.closed.subscribe(spy);
    (fixture.componentInstance as UIAlertDialog).dismiss();
    expect(spy).toHaveBeenCalledOnce();
  });
});

// ── UIConfirmDialog ────────────────────────────────────────────────

describe("UIConfirmDialog", () => {
  it("should create", () => {
    const { fixture } = createWithModalRef(UIConfirmDialog);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should render title, message, and both buttons", () => {
    const { fixture } = createWithModalRef(UIConfirmDialog, {
      title: "Delete?",
      message: "Are you sure?",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("Delete?");
    expect(el.textContent).toContain("Are you sure?");
    expect(el.textContent).toContain("Yes");
    expect(el.textContent).toContain("No");
  });

  it("should close with true on confirm", () => {
    const { fixture, modalRef } = createWithModalRef(UIConfirmDialog);
    const spy = vi.fn();
    modalRef.closed.subscribe(spy);
    (fixture.componentInstance as UIConfirmDialog).confirm();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it("should close with false on cancel", () => {
    const { fixture, modalRef } = createWithModalRef(UIConfirmDialog);
    const spy = vi.fn();
    modalRef.closed.subscribe(spy);
    (fixture.componentInstance as UIConfirmDialog).cancel();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it("should apply danger host class", () => {
    const { fixture } = createWithModalRef(UIConfirmDialog, {
      variant: "danger",
    });
    expect(fixture.nativeElement.classList).toContain(
      "ui-confirm-dialog--danger",
    );
  });

  it("should apply warning host class", () => {
    const { fixture } = createWithModalRef(UIConfirmDialog, {
      variant: "warning",
    });
    expect(fixture.nativeElement.classList).toContain(
      "ui-confirm-dialog--warning",
    );
  });
});

// ── UIPromptDialog ─────────────────────────────────────────────────

describe("UIPromptDialog", () => {
  it("should create", () => {
    const { fixture } = createWithModalRef(UIPromptDialog);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should render title and message", () => {
    const { fixture } = createWithModalRef(UIPromptDialog, {
      title: "Enter name",
      message: "What is your name?",
    });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("Enter name");
    expect(el.textContent).toContain("What is your name?");
  });

  it("should close with null on cancel", () => {
    const { fixture, modalRef } = createWithModalRef(UIPromptDialog);
    const spy = vi.fn();
    modalRef.closed.subscribe(spy);
    (fixture.componentInstance as UIPromptDialog).cancel();
    expect(spy).toHaveBeenCalledWith(null);
  });

  it("should close with input value on ok", () => {
    const { fixture, modalRef } = createWithModalRef(UIPromptDialog, {
      defaultValue: "Alice",
    });
    fixture.detectChanges();
    const spy = vi.fn();
    modalRef.closed.subscribe(spy);
    (fixture.componentInstance as UIPromptDialog).ok();
    expect(spy).toHaveBeenCalledWith("Alice");
  });
});

// ── UIAboutDialog ──────────────────────────────────────────────────

describe("UIAboutDialog", () => {
  it("should create", () => {
    const { fixture } = createWithModalRef(UIAboutDialog);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should render app name and version", () => {
    const { fixture } = createWithModalRef(UIAboutDialog, {
      appName: "TestApp",
      version: "1.0.0",
    });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("TestApp");
    expect(el.textContent).toContain("Version 1.0.0");
  });

  it("should render description", () => {
    const { fixture } = createWithModalRef(UIAboutDialog, {
      appName: "TestApp",
      description: "A test application",
    });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("A test application");
  });

  it("should render copyright", () => {
    const { fixture } = createWithModalRef(UIAboutDialog, {
      appName: "TestApp",
      copyright: "\u00a9 2026 Acme Corp",
    });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("\u00a9 2026 Acme Corp");
  });

  it("should render credits list", () => {
    const { fixture } = createWithModalRef(UIAboutDialog, {
      appName: "TestApp",
      credits: ["Alice", "Bob"],
    });
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("Credits");
    expect(el.textContent).toContain("Alice");
    expect(el.textContent).toContain("Bob");
  });

  it("should render logo image", () => {
    const { fixture } = createWithModalRef(UIAboutDialog, {
      appName: "TestApp",
      logoUrl: "https://example.com/logo.png",
    });
    const img = fixture.nativeElement.querySelector("img");
    expect(img).toBeTruthy();
    expect(img.src).toBe("https://example.com/logo.png");
  });

  it("should close the modal on dismiss", () => {
    const { fixture, modalRef } = createWithModalRef(UIAboutDialog);
    const spy = vi.fn();
    modalRef.closed.subscribe(spy);
    (fixture.componentInstance as UIAboutDialog).dismiss();
    expect(spy).toHaveBeenCalledOnce();
  });
});

// ── CommonDialogService ────────────────────────────────────────────

describe("CommonDialogService", () => {
  let service: CommonDialogService;

  beforeEach(() => {
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

    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonDialogService);
  });

  afterEach(() => {
    document
      .querySelectorAll("dialog.ui-dialog-service")
      .forEach((d) => d.remove());
    document
      .querySelectorAll("style[data-ui-dialog-service]")
      .forEach((s) => s.remove());
  });

  it("should be provided in root", () => {
    expect(service).toBeTruthy();
  });

  it("alert should open and resolve on close", async () => {
    const promise = service.alert({
      title: "Test",
      message: "Hello",
    });
    const dialog = document.querySelector("dialog.ui-dialog-service");
    expect(dialog).toBeTruthy();

    // Close via native dialog close event (simulates Escape / backdrop)
    dialog?.dispatchEvent(new Event("close"));

    await promise;
  });

  it("confirm should resolve true on confirm", async () => {
    const promise = service.confirm({
      title: "Delete?",
      message: "Sure?",
    });
    const dialog = document.querySelector("dialog.ui-dialog-service");
    expect(dialog).toBeTruthy();

    // Click the filled (confirm) button
    const buttons = dialog?.querySelectorAll("ui-button");
    const confirmBtn = buttons?.[1]; // second button is confirm
    confirmBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const result = await promise;
    expect(result).toBe(true);
  });

  it("confirm should resolve false on cancel", async () => {
    const promise = service.confirm({
      title: "Delete?",
      message: "Sure?",
    });
    const dialog = document.querySelector("dialog.ui-dialog-service");

    // Click the outlined (cancel) button
    const buttons = dialog?.querySelectorAll("ui-button");
    const cancelBtn = buttons?.[0]; // first button is cancel
    cancelBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const result = await promise;
    expect(result).toBe(false);
  });

  it("prompt should resolve null on cancel", async () => {
    const promise = service.prompt({
      title: "Name?",
      message: "Enter name",
    });
    const dialog = document.querySelector("dialog.ui-dialog-service");

    const buttons = dialog?.querySelectorAll("ui-button");
    const cancelBtn = buttons?.[0];
    cancelBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const result = await promise;
    expect(result).toBe(null);
  });

  it("about should open and resolve on close", async () => {
    const promise = service.about({
      appName: "MyApp",
      version: "2.0.0",
    });
    const dialog = document.querySelector("dialog.ui-dialog-service");
    expect(dialog).toBeTruthy();

    // Close via native dialog close event
    dialog?.dispatchEvent(new Event("close"));

    await promise;
  });
});
