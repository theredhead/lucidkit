import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIOpenFileDialog } from "./open-file-dialog.component";
import { ModalRef } from "@theredhead/ui-kit";
import type {
  FileBrowserDatasource,
  FileBrowserEntry,
} from "../file-browser/file-browser.types";

describe("UIOpenFileDialog", () => {
  let fixture: ComponentFixture<UIOpenFileDialog>;
  let component: UIOpenFileDialog;
  let modalRefMock: { close: ReturnType<typeof vi.fn> };

  const fakeDatasource: FileBrowserDatasource = {
    getChildren: vi.fn(async () => []),
    isDirectory: vi.fn(() => false),
  } as unknown as FileBrowserDatasource;

  beforeEach(async () => {
    modalRefMock = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [UIOpenFileDialog],
      providers: [{ provide: ModalRef, useValue: modalRefMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(UIOpenFileDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("datasource", fakeDatasource);
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("open", () => {
    it("should close modal with selected file", () => {
      fixture.detectChanges();
      const file: FileBrowserEntry = {
        name: "doc.txt",
        isDirectory: false,
      } as FileBrowserEntry;
      // @ts-expect-error accessing protected signal for test
      component.selectedFile.set(file);
      component.open();
      expect(modalRefMock.close).toHaveBeenCalledWith({ files: [file] });
    });

    it("should not close when no file selected", () => {
      fixture.detectChanges();
      component.open();
      expect(modalRefMock.close).not.toHaveBeenCalled();
    });

    it("should not close when selected entry is a directory", () => {
      fixture.detectChanges();
      const dir: FileBrowserEntry = {
        name: "folder",
        isDirectory: true,
      } as FileBrowserEntry;
      // @ts-expect-error accessing protected signal for test
      component.selectedFile.set(dir);
      component.open();
      expect(modalRefMock.close).not.toHaveBeenCalled();
    });
  });

  describe("cancel", () => {
    it("should close modal with null", () => {
      fixture.detectChanges();
      component.cancel();
      expect(modalRefMock.close).toHaveBeenCalledWith(null);
    });
  });

  describe("onFileActivated", () => {
    it("should close when selected file is not a directory", () => {
      fixture.detectChanges();
      const file: FileBrowserEntry = {
        name: "image.png",
        isDirectory: false,
      } as FileBrowserEntry;
      // @ts-expect-error accessing protected signal for test
      component.selectedFile.set(file);
      // @ts-expect-error accessing protected method for test
      component.onFileActivated({ entry: file });
      expect(modalRefMock.close).toHaveBeenCalledWith({ files: [file] });
    });

    it("should not close when selected file is a directory", () => {
      fixture.detectChanges();
      const dir: FileBrowserEntry = {
        name: "docs",
        isDirectory: true,
      } as FileBrowserEntry;
      // @ts-expect-error accessing protected signal for test
      component.selectedFile.set(dir);
      // @ts-expect-error accessing protected method for test
      component.onFileActivated({ entry: dir });
      expect(modalRefMock.close).not.toHaveBeenCalled();
    });

    it("should not close when no file is selected", () => {
      fixture.detectChanges();
      // @ts-expect-error accessing protected method for test
      component.onFileActivated({ entry: null });
      expect(modalRefMock.close).not.toHaveBeenCalled();
    });
  });

  describe("inputs", () => {
    it("should have default title", () => {
      fixture.detectChanges();
      expect(component.title()).toBe("Open File");
    });

    it("should have default openLabel", () => {
      fixture.detectChanges();
      expect(component.openLabel()).toBe("Open");
    });

    it("should accept custom title", () => {
      fixture.componentRef.setInput("title", "Import File");
      fixture.detectChanges();
      expect(component.title()).toBe("Import File");
    });
  });

  describe("template", () => {
    it("should render dialog header", () => {
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector("ui-dialog-header");
      expect(header.textContent).toContain("Open File");
    });
  });
});
