import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal, viewChild } from "@angular/core";

import { UIDialog } from "./dialog.component";
import { UIDialogBody } from "./dialog-body.component";
import { UIDialogFooter } from "./dialog-footer.component";
import { UIDialogHeader } from "./dialog-header.component";

// jsdom does not implement HTMLDialogElement.showModal / .close
beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
});

@Component({
  standalone: true,
  imports: [UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter],
  template: `
    <ui-dialog [(open)]="isOpen" [ariaLabel]="'Test dialog'">
      <ui-dialog-header>Test Title</ui-dialog-header>
      <ui-dialog-body>Body content</ui-dialog-body>
      <ui-dialog-footer>
        <button (click)="isOpen.set(false)">Close</button>
      </ui-dialog-footer>
    </ui-dialog>
  `,
})
class TestHost {
  public readonly isOpen = signal(false);
  public readonly dialog = viewChild(UIDialog);
}

@Component({
  standalone: true,
  imports: [UIDialog, UIDialogBody],
  template: `
    <ui-dialog
      [(open)]="isOpen"
      [closeOnEscape]="closeOnEscape()"
      [closeOnBackdropClick]="closeOnBackdropClick()"
    >
      <ui-dialog-body>Body</ui-dialog-body>
    </ui-dialog>
  `,
})
class ConfigHost {
  public readonly isOpen = signal(false);
  public readonly closeOnEscape = signal(true);
  public readonly closeOnBackdropClick = signal(true);
  public readonly dialog = viewChild(UIDialog);
}

describe("UIDialog", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.dialog()).toBeTruthy();
  });

  it("should not show dialog when closed", () => {
    const dialog = fixture.nativeElement.querySelector("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("should render dialog when open", () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector("dialog");
    expect(dialog).toBeTruthy();
  });

  it("should render projected title", () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector("ui-dialog-header");
    expect(header.textContent.trim()).toBe("Test Title");
  });

  it("should render projected body content", () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector("ui-dialog-body");
    expect(body.textContent.trim()).toBe("Body content");
  });

  it("should render projected footer", () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector("ui-dialog-footer");
    expect(footer.textContent.trim()).toBe("Close");
  });

  it("should have aria-label", () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector("dialog");
    expect(dialog.getAttribute("aria-label")).toBe("Test dialog");
  });

  it("should have ui-dialog host class", () => {
    expect(
      fixture.nativeElement.querySelector("ui-dialog").classList,
    ).toContain("ui-dialog");
  });

  describe("show", () => {
    it("should open the dialog via show()", () => {
      host.dialog()!.show();
      fixture.detectChanges();
      const dialog = fixture.nativeElement.querySelector("dialog");
      expect(dialog.hasAttribute("open")).toBe(true);
    });
  });

  describe("close", () => {
    it("should close via the close method", () => {
      host.isOpen.set(true);
      fixture.detectChanges();
      const dialog = fixture.nativeElement.querySelector("dialog");
      expect(dialog.hasAttribute("open")).toBe(true);

      host.dialog()!.close();
      fixture.detectChanges();
      expect(dialog.hasAttribute("open")).toBe(false);
    });

    it("should emit closed event", () => {
      const spy = vi.fn();
      host.dialog()!.closed.subscribe(spy);

      host.isOpen.set(true);
      fixture.detectChanges();

      host.dialog()!.close();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("onNativeClose", () => {
    it("should sync open state when dialog fires native close event", () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector("dialog");
      dialog.dispatchEvent(new Event("close"));
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it("should emit closed on native close", () => {
      const spy = vi.fn();
      host.dialog()!.closed.subscribe(spy);

      host.isOpen.set(true);
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector("dialog");
      dialog.dispatchEvent(new Event("close"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("onCancel", () => {
    it("should prevent cancel when closeOnEscape is false", async () => {
      const f = TestBed.createComponent(ConfigHost);
      const h = f.componentInstance;
      h.closeOnEscape.set(false);
      h.isOpen.set(true);
      f.detectChanges();

      const dialogEl = f.nativeElement.querySelector("dialog");
      const event = new Event("cancel", { cancelable: true });
      dialogEl.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it("should allow cancel when closeOnEscape is true", () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const dialogEl = fixture.nativeElement.querySelector("dialog");
      const event = new Event("cancel", { cancelable: true });
      dialogEl.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe("onDialogClick", () => {
    it("should close when clicking the backdrop (dialog element)", () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const dialogEl = fixture.nativeElement.querySelector("dialog");
      dialogEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      fixture.detectChanges();

      expect(host.isOpen()).toBe(false);
    });

    it("should not close when clicking inner content", () => {
      host.isOpen.set(true);
      fixture.detectChanges();

      const body = fixture.nativeElement.querySelector("ui-dialog-body");
      body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      fixture.detectChanges();

      expect(host.isOpen()).toBe(true);
    });

    it("should not close on backdrop click when closeOnBackdropClick is false", async () => {
      const f = TestBed.createComponent(ConfigHost);
      const h = f.componentInstance;
      h.closeOnBackdropClick.set(false);
      h.isOpen.set(true);
      f.detectChanges();

      const dialogEl = f.nativeElement.querySelector("dialog");
      dialogEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      f.detectChanges();

      expect(h.isOpen()).toBe(true);
    });
  });
});
