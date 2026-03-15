import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal, viewChild } from "@angular/core";

import { UIDialog } from "./dialog.component";

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
  imports: [UIDialog],
  template: `
    <ui-dialog [(open)]="isOpen" [ariaLabel]="'Test dialog'">
      <span ui-dialog-title>Test Title</span>
      <p>Body content</p>
      <div ui-dialog-footer>
        <button (click)="isOpen.set(false)">Close</button>
      </div>
    </ui-dialog>
  `,
})
class TestHost {
  public readonly isOpen = signal(false);
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

  it("should not render dialog when closed", () => {
    const dialog = fixture.nativeElement.querySelector("dialog");
    expect(dialog).toBeNull();
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
    const header = fixture.nativeElement.querySelector(".dlg-header");
    expect(header.textContent.trim()).toBe("Test Title");
  });

  it("should render projected body content", () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector(".dlg-body");
    expect(body.textContent.trim()).toBe("Body content");
  });

  it("should render projected footer", () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector(".dlg-footer");
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

  describe("close", () => {
    it("should close via the close method", () => {
      host.isOpen.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector("dialog")).toBeTruthy();

      host.dialog()!.close();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector("dialog")).toBeNull();
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
});
