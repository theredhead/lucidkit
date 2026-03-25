import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIFileBrowser } from "./file-browser.component";
import type {
  FileBrowserDatasource,
  FileBrowserEntry,
} from "./file-browser.types";

// ── Test data ──────────────────────────────────────────────────────

interface FileMeta {
  size: number;
}

const ENTRIES: FileBrowserEntry<FileMeta>[] = [
  { id: "docs", name: "Documents", isDirectory: true },
  { id: "pics", name: "Pictures", isDirectory: true },
  { id: "readme", name: "README.md", isDirectory: false, meta: { size: 1024 } },
  { id: "license", name: "LICENSE", isDirectory: false, meta: { size: 512 } },
];

const DOCS_ENTRIES: FileBrowserEntry<FileMeta>[] = [
  { id: "notes", name: "Notes", isDirectory: true },
  {
    id: "report",
    name: "report.pdf",
    isDirectory: false,
    meta: { size: 4096 },
  },
  { id: "todo", name: "todo.txt", isDirectory: false, meta: { size: 128 } },
];

const NOTES_ENTRIES: FileBrowserEntry<FileMeta>[] = [
  { id: "note1", name: "note1.md", isDirectory: false, meta: { size: 256 } },
];

class TestDatasource implements FileBrowserDatasource<FileMeta> {
  public getChildren(
    parent: FileBrowserEntry<FileMeta> | null,
  ): FileBrowserEntry<FileMeta>[] {
    if (parent === null) return ENTRIES;
    if (parent.id === "docs") return DOCS_ENTRIES;
    if (parent.id === "notes") return NOTES_ENTRIES;
    return [];
  }

  public isDirectory(entry: FileBrowserEntry<FileMeta>): boolean {
    return entry.isDirectory;
  }
}

// ── Tests ───────────────────────────────────────────────────────────

describe("UIFileBrowser", () => {
  let component: UIFileBrowser<FileMeta>;
  let fixture: ComponentFixture<UIFileBrowser<FileMeta>>;
  let ds: TestDatasource;

  beforeEach(async () => {
    ds = new TestDatasource();
    await TestBed.configureTestingModule({
      imports: [UIFileBrowser],
    }).compileComponents();

    fixture = TestBed.createComponent(UIFileBrowser<FileMeta>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("datasource", ds);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default ariaLabel", () => {
      expect(component.ariaLabel()).toBe("File browser");
    });

    it("should default showSidebar to true", () => {
      expect(component.showSidebar()).toBe(true);
    });

    it("should default rootLabel to 'Root'", () => {
      expect(component.rootLabel()).toBe("Root");
    });

    it("should default selectedEntry to null", () => {
      expect(component.selectedEntry()).toBeNull();
    });
  });

  describe("initial render", () => {
    it("should display root entries", () => {
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      expect(entries.length).toBe(ENTRIES.length);
    });

    it("should display entry names", () => {
      const names = fixture.nativeElement.querySelectorAll(".fb-entry-name");
      const texts = Array.from(names).map((n: unknown) =>
        (n as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("Documents");
      expect(texts).toContain("README.md");
    });

    it("should mark directories with the directory class", () => {
      const dirs = fixture.nativeElement.querySelectorAll(
        ".fb-entry--directory",
      );
      expect(dirs.length).toBe(2); // Documents, Pictures
    });

    it("should show the sidebar", () => {
      const sidebar = fixture.nativeElement.querySelector(".fb-sidebar");
      expect(sidebar).toBeTruthy();
    });

    it("should show the breadcrumb with root label", () => {
      const breadcrumb = fixture.nativeElement.querySelector("ui-breadcrumb");
      expect(breadcrumb).toBeTruthy();
    });
  });

  describe("navigation", () => {
    it("should navigate into a directory on double-click", async () => {
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      // Double-click "Documents" (first entry)
      entries[0].dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const names = fixture.nativeElement.querySelectorAll(".fb-entry-name");
      const texts = Array.from(names).map((n: unknown) =>
        (n as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("Notes");
      expect(texts).toContain("report.pdf");
      expect(texts).toContain("todo.txt");
    });

    it("should navigate into a directory on Enter key", async () => {
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const names = fixture.nativeElement.querySelectorAll(".fb-entry-name");
      const texts = Array.from(names).map((n: unknown) =>
        (n as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("report.pdf");
    });

    it("should emit directoryChange when navigating", async () => {
      const spy = vi.fn();
      component.directoryChange.subscribe(spy);

      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[0].dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].directory?.name).toBe("Documents");
    });

    it("should navigate to root via navigateToRoot()", async () => {
      // Navigate into Documents first
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[0].dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      // Navigate back to root
      component.navigateToRoot();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const names = fixture.nativeElement.querySelectorAll(".fb-entry-name");
      const texts = Array.from(names).map((n: unknown) =>
        (n as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("Documents");
      expect(texts).toContain("README.md");
    });
  });

  describe("selection", () => {
    it("should select an entry on click", () => {
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2].click(); // Click "README.md"
      fixture.detectChanges();

      expect(component.selectedEntry()?.name).toBe("README.md");
    });

    it("should apply selected class", () => {
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2].click();
      fixture.detectChanges();

      expect(entries[2].classList).toContain("fb-entry--selected");
    });

    it("should clear selection when navigating to a directory", async () => {
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2].click(); // Select README.md
      fixture.detectChanges();
      expect(component.selectedEntry()).not.toBeNull();

      entries[0].dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selectedEntry()).toBeNull();
    });
  });

  describe("file activation", () => {
    it("should emit fileActivated on double-clicking a file", () => {
      const spy = vi.fn();
      component.fileActivated.subscribe(spy);

      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      // Double-click "README.md" (index 2)
      entries[2].dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].entry.name).toBe("README.md");
      expect(spy.mock.calls[0][0].activatedAt).toBeTruthy();
    });

    it("should not emit fileActivated on double-clicking a directory", () => {
      const spy = vi.fn();
      component.fileActivated.subscribe(spy);

      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[0].dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("sidebar toggle", () => {
    it("should hide the sidebar when showSidebar is false", () => {
      fixture.componentRef.setInput("showSidebar", false);
      fixture.detectChanges();

      const sidebar = fixture.nativeElement.querySelector(".fb-sidebar");
      expect(sidebar).toBeNull();
    });
  });

  describe("empty folder", () => {
    it("should show empty message for folders with no children", async () => {
      // Navigate into Pictures (which is empty)
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[1].dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const empty = fixture.nativeElement.querySelector(".fb-empty");
      expect(empty).toBeTruthy();
      expect(empty.textContent).toContain("Empty folder");
    });
  });
});
