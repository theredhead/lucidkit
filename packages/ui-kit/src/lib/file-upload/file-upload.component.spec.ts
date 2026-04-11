import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIFileUpload } from "./file-upload.component";

/** Helper to create a mock File. */
function mockFile(name: string, size: number, type = "text/plain"): File {
  const blob = new Blob(["x".repeat(size)], { type });
  return new File([blob], name, { type });
}

/** Helper to create a mock FileList from an array of Files. */
function mockFileList(files: File[]): FileList {
  const list = {
    length: files.length,
    item: (i: number) => files[i] ?? null,
    [Symbol.iterator]: function* () {
      yield* files;
    },
  } as unknown as FileList;
  files.forEach((f, i) => {
    (list as Record<number, File>)[i] = f;
  });
  return list;
}

/** Helper to simulate a file input change event. */
function simulateInputChange(input: HTMLInputElement, files: File[]): void {
  Object.defineProperty(input, "files", {
    value: mockFileList(files),
    writable: true,
    configurable: true,
  });
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

/** Helper to dispatch a drag event with optional files. */
function dispatchDrag(el: HTMLElement, type: string, files: File[] = []): void {
  // jsdom doesn't support DragEvent constructor — use a plain Event
  const event = new Event(type, { bubbles: true, cancelable: true });
  if (files.length) {
    Object.defineProperty(event, "dataTransfer", {
      value: { files: mockFileList(files) },
    });
  }
  el.dispatchEvent(event);
}

describe("UIFileUpload", () => {
  let component: UIFileUpload;
  let fixture: ComponentFixture<UIFileUpload>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIFileUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(UIFileUpload);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // ── Defaults ─────────────────────────────────────────────────────

  describe("defaults", () => {
    it("should default to empty file list", () => {
      expect(component.files()).toEqual([]);
      expect(component.fileCount()).toBe(0);
    });

    it("should default accept to empty string", () => {
      expect(component.accept()).toBe("");
    });

    it("should default multiple to false", () => {
      expect(component.multiple()).toBe(false);
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it('should default ariaLabel to "Upload file"', () => {
      expect(component.ariaLabel()).toBe("Upload file");
    });

    it("should have the host class", () => {
      expect(el.classList).toContain("ui-file-upload");
    });
  });

  // ── Disabled state ───────────────────────────────────────────────

  describe("disabled", () => {
    it("should add disabled host class when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(el.classList).toContain("disabled");
    });

    it("should not open file browser when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");
      component.browse();
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  // ── File selection via input ─────────────────────────────────────

  describe("file selection", () => {
    it("should add a file when input changes", () => {
      const addedSpy = vi.fn();
      component.fileAdded.subscribe(addedSpy);

      const file = mockFile("test.txt", 100);
      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [file]);
      fixture.detectChanges();

      expect(component.files().length).toBe(1);
      expect(component.files()[0].file.name).toBe("test.txt");
      expect(addedSpy).toHaveBeenCalledTimes(1);
    });

    it("should replace file in single-file mode", () => {
      const file1 = mockFile("first.txt", 100);
      const file2 = mockFile("second.txt", 200);
      const input = el.querySelector("input[type=file]") as HTMLInputElement;

      // Add first file
      simulateInputChange(input, [file1]);
      fixture.detectChanges();
      expect(component.files().length).toBe(1);
      expect(component.files()[0].file.name).toBe("first.txt");

      // Add second file — should replace
      simulateInputChange(input, [file2]);
      fixture.detectChanges();
      expect(component.files().length).toBe(1);
      expect(component.files()[0].file.name).toBe("second.txt");
    });

    it("should accumulate files in multiple mode", () => {
      fixture.componentRef.setInput("multiple", true);
      fixture.detectChanges();

      const file1 = mockFile("a.txt", 100);
      const file2 = mockFile("b.txt", 200);
      const input = el.querySelector("input[type=file]") as HTMLInputElement;

      simulateInputChange(input, [file1]);
      simulateInputChange(input, [file2]);
      fixture.detectChanges();

      expect(component.files().length).toBe(2);
    });
  });

  // ── File validation ──────────────────────────────────────────────

  describe("validation", () => {
    it("should reject files exceeding maxFileSize", () => {
      fixture.componentRef.setInput("maxFileSize", 50);
      fixture.detectChanges();

      const rejectedSpy = vi.fn();
      component.fileRejected.subscribe(rejectedSpy);

      const file = mockFile("big.txt", 100);
      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [file]);
      fixture.detectChanges();

      expect(component.files().length).toBe(0);
      expect(rejectedSpy).toHaveBeenCalledTimes(1);
      expect(rejectedSpy.mock.calls[0][0].reason).toContain("exceeds maximum");
    });

    it("should reject files not matching accept pattern", () => {
      fixture.componentRef.setInput("accept", "image/*");
      fixture.detectChanges();

      const rejectedSpy = vi.fn();
      component.fileRejected.subscribe(rejectedSpy);

      const file = mockFile("doc.pdf", 100, "application/pdf");
      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [file]);
      fixture.detectChanges();

      expect(component.files().length).toBe(0);
      expect(rejectedSpy).toHaveBeenCalledTimes(1);
    });

    it("should accept files matching a wildcard MIME type", () => {
      fixture.componentRef.setInput("accept", "image/*");
      fixture.detectChanges();

      const file = mockFile("photo.png", 100, "image/png");
      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [file]);
      fixture.detectChanges();

      expect(component.files().length).toBe(1);
    });

    it("should accept files matching an extension pattern", () => {
      fixture.componentRef.setInput("accept", ".pdf,.txt");
      fixture.detectChanges();

      const file = mockFile("notes.txt", 100, "text/plain");
      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [file]);
      fixture.detectChanges();

      expect(component.files().length).toBe(1);
    });
  });

  // ── File removal ─────────────────────────────────────────────────

  describe("removal", () => {
    it("should remove a file by id", () => {
      const removedSpy = vi.fn();
      component.fileRemoved.subscribe(removedSpy);

      // Add a file first
      const file = mockFile("test.txt", 100);
      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [file]);
      fixture.detectChanges();

      const id = component.files()[0].id;
      component.remove(id);
      fixture.detectChanges();

      expect(component.files().length).toBe(0);
      expect(removedSpy).toHaveBeenCalledTimes(1);
    });

    it("should clear all files", () => {
      fixture.componentRef.setInput("multiple", true);
      fixture.detectChanges();

      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [
        mockFile("a.txt", 10),
        mockFile("b.txt", 20),
      ]);
      fixture.detectChanges();
      expect(component.files().length).toBe(2);

      const removedSpy = vi.fn();
      component.fileRemoved.subscribe(removedSpy);
      component.clear();
      fixture.detectChanges();

      expect(component.files().length).toBe(0);
      expect(removedSpy).toHaveBeenCalledTimes(2);
    });

    it("should do nothing when removing a non-existent id", () => {
      component.remove("non-existent");
      expect(component.files().length).toBe(0);
    });
  });

  // ── Drag and drop ────────────────────────────────────────────────

  describe("drag and drop", () => {
    it("should set dragging state on dragenter", () => {
      const zone = el.querySelector(".drop-zone") as HTMLElement;
      dispatchDrag(zone, "dragenter");
      fixture.detectChanges();

      expect(component["isDragging"]()).toBe(true);
      expect(el.classList).toContain("dragging");
    });

    it("should clear dragging state on dragleave", () => {
      const zone = el.querySelector(".drop-zone") as HTMLElement;
      dispatchDrag(zone, "dragenter");
      dispatchDrag(zone, "dragleave");
      fixture.detectChanges();

      expect(component["isDragging"]()).toBe(false);
    });

    it("should add files on drop", () => {
      const zone = el.querySelector(".drop-zone") as HTMLElement;
      const file = mockFile("dropped.txt", 50);

      dispatchDrag(zone, "dragenter");
      dispatchDrag(zone, "drop", [file]);
      fixture.detectChanges();

      expect(component.files().length).toBe(1);
      expect(component.files()[0].file.name).toBe("dropped.txt");
      expect(component["isDragging"]()).toBe(false);
    });

    it("should not add files on drop when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const zone = el.querySelector(".drop-zone") as HTMLElement;
      const file = mockFile("dropped.txt", 50);
      dispatchDrag(zone, "drop", [file]);
      fixture.detectChanges();

      expect(component.files().length).toBe(0);
    });
  });

  // ── Format size ──────────────────────────────────────────────────

  describe("formatSize", () => {
    it("should format bytes", () => {
      expect(component["formatSize"](500)).toBe("500 B");
    });

    it("should format kilobytes", () => {
      expect(component["formatSize"](2048)).toBe("2.0 KB");
    });

    it("should format megabytes", () => {
      expect(component["formatSize"](1_500_000)).toBe("1.4 MB");
    });
  });

  // ── Template rendering ───────────────────────────────────────────

  describe("template", () => {
    it("should render the drop zone", () => {
      const zone = el.querySelector(".drop-zone");
      expect(zone).toBeTruthy();
    });

    it("should show the label text", () => {
      const label = el.querySelector(".drop-zone-label");
      expect(label?.textContent).toContain(
        "Drop files here or click to browse",
      );
    });

    it("should show accept hint when accept is set", () => {
      fixture.componentRef.setInput("accept", "image/*,.pdf");
      fixture.detectChanges();
      const hint = el.querySelector(".drop-zone-hint");
      expect(hint?.textContent).toContain("image/*,.pdf");
    });

    it("should not render file list when empty", () => {
      expect(el.querySelector(".file-list")).toBeNull();
    });

    it("should render file list after adding a file", () => {
      const file = mockFile("test.txt", 100);
      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [file]);
      fixture.detectChanges();

      const list = el.querySelector(".file-list");
      expect(list).toBeTruthy();
      expect(el.querySelectorAll(".file-item").length).toBe(1);
      expect(el.querySelector(".file-name")?.textContent).toContain("test.txt");
    });

    it("should remove file when remove button is clicked", () => {
      const file = mockFile("test.txt", 100);
      const input = el.querySelector("input[type=file]") as HTMLInputElement;
      simulateInputChange(input, [file]);
      fixture.detectChanges();

      const removeBtn = el.querySelector(".file-remove") as HTMLButtonElement;
      expect(removeBtn).toBeTruthy();
      removeBtn.click();
      fixture.detectChanges();

      expect(component.files().length).toBe(0);
    });
  });
});
