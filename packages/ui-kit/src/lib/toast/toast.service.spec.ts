import { TestBed } from "@angular/core/testing";

import { ToastService } from "./toast.service";

describe("ToastService", () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    service.clear();
    vi.useRealTimers();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("show", () => {
    it("should add a toast", () => {
      service.show({ message: "Hello" });
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe("Hello");
    });

    it("should return a unique id", () => {
      const id1 = service.show({ message: "A" });
      const id2 = service.show({ message: "B" });
      expect(id1).not.toBe(id2);
    });

    it("should apply defaults", () => {
      service.show({ message: "Test" });
      const toast = service.toasts()[0];
      expect(toast.severity).toBe("info");
      expect(toast.duration).toBe(4000);
      expect(toast.position).toBe("top-right");
      expect(toast.title).toBe("");
      expect(toast.actionLabel).toBe("");
      expect(toast.exiting).toBe(false);
    });

    it("should accept full config", () => {
      const actionFn = vi.fn();
      service.show({
        message: "Saved",
        title: "Success",
        severity: "success",
        duration: 5000,
        actionLabel: "Undo",
        actionFn,
        position: "bottom-center",
      });

      const toast = service.toasts()[0];
      expect(toast.title).toBe("Success");
      expect(toast.severity).toBe("success");
      expect(toast.duration).toBe(5000);
      expect(toast.actionLabel).toBe("Undo");
      expect(toast.actionFn).toBe(actionFn);
      expect(toast.position).toBe("bottom-center");
    });
  });

  describe("convenience methods", () => {
    it("should create info toast", () => {
      service.info("Info message");
      expect(service.toasts()[0].severity).toBe("info");
      expect(service.toasts()[0].message).toBe("Info message");
    });

    it("should create success toast", () => {
      service.success("Saved");
      expect(service.toasts()[0].severity).toBe("success");
    });

    it("should create warning toast", () => {
      service.warning("Watch out");
      expect(service.toasts()[0].severity).toBe("warning");
    });

    it("should create error toast", () => {
      service.error("Failed");
      expect(service.toasts()[0].severity).toBe("error");
    });

    it("should merge additional config", () => {
      service.info("Test", { title: "Note", duration: 8000 });
      const toast = service.toasts()[0];
      expect(toast.title).toBe("Note");
      expect(toast.duration).toBe(8000);
      expect(toast.severity).toBe("info");
    });
  });

  describe("dismiss", () => {
    it("should mark toast as exiting", () => {
      const id = service.show({ message: "Bye" });
      service.dismiss(id);
      expect(service.toasts()[0].exiting).toBe(true);
    });

    it("should remove toast after animation delay", () => {
      vi.useFakeTimers();
      const id = service.show({ message: "Bye", duration: 0 });
      service.dismiss(id);
      expect(service.toasts().length).toBe(1);
      vi.advanceTimersByTime(200);
      expect(service.toasts().length).toBe(0);
    });
  });

  describe("remove", () => {
    it("should immediately remove a toast", () => {
      const id = service.show({ message: "Gone", duration: 0 });
      service.remove(id);
      expect(service.toasts().length).toBe(0);
    });
  });

  describe("clear", () => {
    it("should remove all toasts", () => {
      service.show({ message: "A", duration: 0 });
      service.show({ message: "B", duration: 0 });
      service.show({ message: "C", duration: 0 });
      expect(service.toasts().length).toBe(3);
      service.clear();
      expect(service.toasts().length).toBe(0);
    });
  });

  describe("auto-dismiss", () => {
    it("should auto-dismiss after duration", () => {
      vi.useFakeTimers();
      service.show({ message: "Temp", duration: 3000 });
      expect(service.toasts().length).toBe(1);

      vi.advanceTimersByTime(3000);
      // Toast is now exiting
      expect(service.toasts()[0].exiting).toBe(true);

      vi.advanceTimersByTime(200);
      // Toast is now removed
      expect(service.toasts().length).toBe(0);
    });

    it("should not auto-dismiss when duration is 0", () => {
      vi.useFakeTimers();
      service.show({ message: "Permanent", duration: 0 });
      vi.advanceTimersByTime(60000);
      expect(service.toasts().length).toBe(1);
    });
  });

  describe("multiple toasts", () => {
    it("should stack multiple toasts", () => {
      service.show({ message: "A", duration: 0 });
      service.show({ message: "B", duration: 0 });
      service.show({ message: "C", duration: 0 });
      expect(service.toasts().length).toBe(3);
    });

    it("should remove only the specified toast", () => {
      service.show({ message: "A", duration: 0 });
      const idB = service.show({ message: "B", duration: 0 });
      service.show({ message: "C", duration: 0 });
      service.remove(idB);
      expect(service.toasts().length).toBe(2);
      expect(service.toasts().every((t) => t.message !== "B")).toBe(true);
    });
  });
});
