import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";

import { UIToastContainer } from "./toast.component";
import { ToastService } from "./toast.service";

describe("UIToastContainer", () => {
  let component: UIToastContainer;
  let fixture: ComponentFixture<UIToastContainer>;
  let service: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIToastContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(UIToastContainer);
    component = fixture.componentInstance;
    service = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  afterEach(() => {
    service.clear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default position to "top-right"', () => {
      expect(component.position()).toBe("top-right");
    });
  });

  describe("positioning", () => {
    it("should apply position host class", () => {
      expect(fixture.nativeElement.classList).toContain(
        "ui-toast-container--top-right",
      );
    });

    it("should update position host class", () => {
      fixture.componentRef.setInput("position", "bottom-left");
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain(
        "ui-toast-container--bottom-left",
      );
    });
  });

  describe("rendering", () => {
    it("should render toasts for matching position", () => {
      service.show({ message: "Hello", duration: 0, position: "top-right" });
      fixture.detectChanges();
      const toasts = fixture.nativeElement.querySelectorAll(".toast");
      expect(toasts.length).toBe(1);
    });

    it("should not render toasts for different position", () => {
      service.show({
        message: "Hello",
        duration: 0,
        position: "bottom-left",
      });
      fixture.detectChanges();
      const toasts = fixture.nativeElement.querySelectorAll(".toast");
      expect(toasts.length).toBe(0);
    });

    it("should display toast message", () => {
      service.show({ message: "Test message", duration: 0 });
      fixture.detectChanges();
      const msg = fixture.nativeElement.querySelector(".message");
      expect(msg.textContent.trim()).toBe("Test message");
    });

    it("should display toast title when provided", () => {
      service.show({
        message: "Body",
        title: "Header",
        duration: 0,
      });
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector(".title");
      expect(title.textContent.trim()).toBe("Header");
    });

    it("should not render title element when empty", () => {
      service.show({ message: "No title", duration: 0 });
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector(".title");
      expect(title).toBeFalsy();
    });

    it("should apply severity class", () => {
      service.show({ message: "Error", duration: 0, severity: "error" });
      fixture.detectChanges();
      const toast = fixture.nativeElement.querySelector(".toast");
      expect(toast.classList).toContain("toast--error");
    });

    it("should render action button when actionLabel is set", () => {
      service.show({
        message: "Deleted",
        duration: 0,
        actionLabel: "Undo",
      });
      fixture.detectChanges();
      const action = fixture.nativeElement.querySelector(".action");
      expect(action).toBeTruthy();
      expect(action.textContent.trim()).toBe("Undo");
    });

    it("should not render action button without actionLabel", () => {
      service.show({ message: "Simple", duration: 0 });
      fixture.detectChanges();
      const action = fixture.nativeElement.querySelector(".action");
      expect(action).toBeFalsy();
    });
  });

  describe("interactions", () => {
    it("should dismiss on close button click", () => {
      service.show({ message: "Closeable", duration: 0 });
      fixture.detectChanges();
      const close = fixture.nativeElement.querySelector(
        ".close",
      ) as HTMLButtonElement;
      close.click();
      fixture.detectChanges();
      const toast = fixture.nativeElement.querySelector(".toast");
      expect(toast.classList).toContain("toast--exiting");
    });

    it("should execute action callback and dismiss", () => {
      const actionFn = vi.fn();
      service.show({
        message: "Deleted",
        duration: 0,
        actionLabel: "Undo",
        actionFn,
      });
      fixture.detectChanges();
      const action = fixture.nativeElement.querySelector(
        ".action",
      ) as HTMLButtonElement;
      action.click();
      fixture.detectChanges();
      expect(actionFn).toHaveBeenCalledOnce();
    });

    it("should track toasts by id", () => {
      service.show({ message: "One", duration: 0 });
      service.show({ message: "Two", duration: 0 });
      fixture.detectChanges();
      const toasts = fixture.nativeElement.querySelectorAll(".toast");
      expect(toasts.length).toBe(2);
    });
  });

  describe("accessibility", () => {
    it('should have role="alert" on toasts', () => {
      service.show({ message: "Alert", duration: 0 });
      fixture.detectChanges();
      const toast = fixture.nativeElement.querySelector(".toast");
      expect(toast.getAttribute("role")).toBe("alert");
    });

    it('should have aria-live="assertive"', () => {
      service.show({ message: "Live", duration: 0 });
      fixture.detectChanges();
      const toast = fixture.nativeElement.querySelector(".toast");
      expect(toast.getAttribute("aria-live")).toBe("assertive");
    });

    it("should have aria-label on close button", () => {
      service.show({ message: "X", duration: 0 });
      fixture.detectChanges();
      const close = fixture.nativeElement.querySelector(".close");
      expect(close.getAttribute("aria-label")).toBe("Dismiss notification");
    });
  });
});
