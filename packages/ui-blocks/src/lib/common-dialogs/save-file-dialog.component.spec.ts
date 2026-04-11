import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UISaveFileDialog } from "./save-file-dialog.component";
import { ModalRef } from "@theredhead/lucid-kit";
import type { FileBrowserDatasource } from "../file-browser/file-browser.types";

describe("UISaveFileDialog", () => {
  let fixture: ComponentFixture<UISaveFileDialog>;
  let component: UISaveFileDialog;
  let modalRefMock: { close: ReturnType<typeof vi.fn> };

  const fakeDatasource: FileBrowserDatasource = {
    getChildren: vi.fn(async () => []),
    isDirectory: vi.fn(() => false),
  } as unknown as FileBrowserDatasource;

  beforeEach(async () => {
    modalRefMock = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [UISaveFileDialog],
      providers: [{ provide: ModalRef, useValue: modalRefMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(UISaveFileDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("datasource", fakeDatasource);
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should set fileName to defaultName", () => {
      fixture.componentRef.setInput("defaultName", "report.pdf");
      fixture.detectChanges();
      // @ts-expect-error accessing protected signal for test
      expect(component.fileName()).toBe("report.pdf");
    });

    it("should default fileName to empty string", () => {
      fixture.detectChanges();
      // @ts-expect-error accessing protected signal for test
      expect(component.fileName()).toBe("");
    });
  });

  describe("save", () => {
    it("should close modal with directory and trimmed name", () => {
      fixture.detectChanges();
      // @ts-expect-error accessing protected signal for test
      component.fileName.set("  document.txt  ");
      component.save();
      expect(modalRefMock.close).toHaveBeenCalledWith({
        directory: null,
        name: "document.txt",
      });
    });

    it("should not close when fileName is empty", () => {
      fixture.detectChanges();
      // @ts-expect-error accessing protected signal for test
      component.fileName.set("   ");
      component.save();
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

  describe("onDirectoryChange", () => {
    it("should update currentDir", () => {
      fixture.detectChanges();
      const dir = {
        name: "docs",
        isDirectory: true,
        metadata: null,
      };
      // @ts-expect-error accessing protected method for test
      component.onDirectoryChange({ directory: dir });
      // @ts-expect-error accessing protected signal for test
      expect(component.currentDir()).toBe(dir);
    });
  });

  describe("inputs", () => {
    it("should have default title", () => {
      fixture.detectChanges();
      expect(component.title()).toBe("Save File");
    });

    it("should have default saveLabel", () => {
      fixture.detectChanges();
      expect(component.saveLabel()).toBe("Save");
    });

    it("should accept custom title and saveLabel", () => {
      fixture.componentRef.setInput("title", "Export");
      fixture.componentRef.setInput("saveLabel", "Export");
      fixture.detectChanges();
      expect(component.title()).toBe("Export");
      expect(component.saveLabel()).toBe("Export");
    });
  });

  describe("template", () => {
    it("should render dialog header with title", () => {
      fixture.componentRef.setInput("title", "Test Title");
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector("ui-dialog-header");
      expect(header.textContent).toContain("Test Title");
    });

    it("should render save and cancel buttons", () => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll("ui-button");
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
