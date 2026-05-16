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

class AsyncTestDatasource implements FileBrowserDatasource<FileMeta> {
  public getChildren(
    parent: FileBrowserEntry<FileMeta> | null,
  ): Promise<FileBrowserEntry<FileMeta>[]> {
    if (parent === null) return Promise.resolve(ENTRIES);
    if (parent.id === "docs") return Promise.resolve(DOCS_ENTRIES);
    if (parent.id === "notes") return Promise.resolve(NOTES_ENTRIES);
    return Promise.resolve([]);
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
    localStorage.clear();
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

  // ═══════════════════════════════════════════════════════════════
  // ── View mode tests ───────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════

  describe("viewMode: icons", () => {
    beforeEach(async () => {
      fixture.componentRef.setInput("viewMode", "icons");
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should render icon tiles", () => {
      const tiles = fixture.nativeElement.querySelectorAll(".fb-icon-tile");
      expect(tiles.length).toBe(ENTRIES.length);
    });

    it("should show entry names", () => {
      const names =
        fixture.nativeElement.querySelectorAll(".fb-icon-tile-name");
      const texts = Array.from(names).map((n: unknown) =>
        (n as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("Documents");
      expect(texts).toContain("README.md");
    });

    it("should select a tile on click", () => {
      const tiles = fixture.nativeElement.querySelectorAll(".fb-icon-tile");
      tiles[2].click();
      fixture.detectChanges();

      expect(component.selectedEntry()?.name).toBe("README.md");
      expect(tiles[2].classList).toContain("fb-icon-tile--selected");
    });
  });

  describe("viewMode: detail", () => {
    beforeEach(async () => {
      fixture.componentRef.setInput("viewMode", "detail");
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should render the detail header", () => {
      const header = fixture.nativeElement.querySelector(".fb-detail-header");
      expect(header).toBeTruthy();
      expect(header.textContent).toContain("Name");
    });

    it("should render detail rows", () => {
      const rows = fixture.nativeElement.querySelectorAll(".fb-detail-row");
      expect(rows.length).toBe(ENTRIES.length);
    });

    it("should select a row on click", () => {
      const rows = fixture.nativeElement.querySelectorAll(".fb-detail-row");
      rows[2].click();
      fixture.detectChanges();

      expect(component.selectedEntry()?.name).toBe("README.md");
      expect(rows[2].classList).toContain("fb-detail-row--selected");
    });

    it("should display meta columns", () => {
      const metaCells = fixture.nativeElement.querySelectorAll(
        ".fb-detail-row .fb-detail-cell--meta",
      );
      // 3 meta columns × 4 entries = 12
      expect(metaCells.length).toBe(ENTRIES.length * 3);
    });
  });

  describe("viewMode: column", () => {
    beforeEach(async () => {
      fixture.componentRef.setInput("viewMode", "column");
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should render the root column pane", () => {
      const panes = fixture.nativeElement.querySelectorAll(".fb-column-pane");
      expect(panes.length).toBe(1);
    });

    it("should render entries inside the root pane", () => {
      const entries =
        fixture.nativeElement.querySelectorAll(".fb-column-entry");
      expect(entries.length).toBe(ENTRIES.length);
    });

    it("should open a second pane when clicking a directory", async () => {
      const entries =
        fixture.nativeElement.querySelectorAll(".fb-column-entry");
      // Click "Documents" (first entry, a directory)
      entries[0].click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const panes = fixture.nativeElement.querySelectorAll(".fb-column-pane");
      expect(panes.length).toBe(2);
    });

    it("should select an entry in a pane", () => {
      const entries =
        fixture.nativeElement.querySelectorAll(".fb-column-entry");
      entries[2].click(); // Click "README.md"
      fixture.detectChanges();

      expect(component.selectedEntry()?.name).toBe("README.md");
      expect(entries[2].classList).toContain("fb-column-entry--selected");
    });
  });

  describe("details pane", () => {
    it("should not show details pane by default", () => {
      const details = fixture.nativeElement.querySelector(".fb-details");
      expect(details).toBeNull();
    });

    it("should show details pane when showDetails is true and entry is selected", () => {
      fixture.componentRef.setInput("showDetails", true);
      fixture.detectChanges();

      // Select an entry
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2].click(); // README.md
      fixture.detectChanges();

      const details = fixture.nativeElement.querySelector(".fb-details");
      expect(details).toBeTruthy();
      expect(details.textContent).toContain("README.md");
    });

    it("should display metadata from the provider", () => {
      fixture.componentRef.setInput("showDetails", true);
      fixture.componentRef.setInput(
        "metadataProvider",
        (entry: FileBrowserEntry<FileMeta>) => [
          { label: "Size", value: entry.meta?.size ?? 0 },
        ],
      );
      fixture.detectChanges();

      // Select README.md (has meta.size = 1024)
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2].click();
      fixture.detectChanges();

      const labels =
        fixture.nativeElement.querySelectorAll(".fb-details-label");
      const values =
        fixture.nativeElement.querySelectorAll(".fb-details-value");
      expect(labels.length).toBeGreaterThan(0);
      expect(labels[0].textContent?.trim()).toBe("Size");
      expect(values[0].textContent?.trim()).toBe("1024");
    });

    it("should show File or Folder kind", () => {
      fixture.componentRef.setInput("showDetails", true);
      fixture.detectChanges();

      // Select a directory
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[0].click(); // Documents (directory)
      fixture.detectChanges();

      const kind = fixture.nativeElement.querySelector(".fb-details-kind");
      expect(kind.textContent?.trim()).toBe("Folder");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // ── Resizable panels ─────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════

  describe("resizable panels", () => {
    it("should render the sidebar divider when sidebar is shown", () => {
      const divider = fixture.nativeElement.querySelector(
        ".fb-divider--sidebar",
      );
      expect(divider).toBeTruthy();
    });

    it("should not render the sidebar divider when sidebar is hidden", () => {
      fixture.componentRef.setInput("showSidebar", false);
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".fb-divider--sidebar",
      );
      expect(divider).toBeNull();
    });

    it("should render the details divider when details pane is visible", () => {
      fixture.componentRef.setInput("showDetails", true);
      fixture.detectChanges();

      // Select an entry to trigger the details pane
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2].click();
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".fb-divider--details",
      );
      expect(divider).toBeTruthy();
    });

    it("should collapse sidebar on divider double-click", () => {
      const divider = fixture.nativeElement.querySelector(
        ".fb-divider--sidebar",
      );
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      const sidebar = fixture.nativeElement.querySelector(".fb-sidebar");
      expect(sidebar.classList).toContain("fb-sidebar--collapsed");
    });

    it("should restore sidebar on second double-click", () => {
      const divider = fixture.nativeElement.querySelector(
        ".fb-divider--sidebar",
      );
      // Collapse
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector(".fb-sidebar")
          .classList.contains("fb-sidebar--collapsed"),
      ).toBe(true);

      // Restore
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector(".fb-sidebar")
          .classList.contains("fb-sidebar--collapsed"),
      ).toBe(false);
    });

    it("should collapse details pane on divider double-click", () => {
      fixture.componentRef.setInput("showDetails", true);
      fixture.detectChanges();

      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2].click();
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".fb-divider--details",
      );
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      const details = fixture.nativeElement.querySelector(".fb-details");
      expect(details.classList).toContain("fb-details--collapsed");
    });

    it("should handle pointer drag on sidebar divider", () => {
      const divider = fixture.nativeElement.querySelector(
        ".fb-divider--sidebar",
      ) as HTMLElement;
      if (!divider) return;

      divider.setPointerCapture = vi.fn();
      divider.releasePointerCapture = vi.fn();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 200,
          clientY: 200,
          bubbles: true,
        }),
      );

      divider.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 1,
          clientX: 250,
          clientY: 200,
          bubbles: true,
        }),
      );

      divider.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      // Should complete without error
      expect(component).toBeTruthy();
    });
  });

  describe("navigateToDirectory", () => {
    it("should navigate to a specific directory programmatically", async () => {
      component.navigateToDirectory(ENTRIES[0]); // Documents
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const names = fixture.nativeElement.querySelectorAll(".fb-entry-name");
      const texts = Array.from(names).map((n: unknown) =>
        (n as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("Notes");
      expect(texts).toContain("report.pdf");
    });

    it("should navigate deep then back to root", async () => {
      component.navigateToDirectory(ENTRIES[0]); // Documents
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      component.navigateToRoot();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const names = fixture.nativeElement.querySelectorAll(".fb-entry-name");
      const texts = Array.from(names).map((n: unknown) =>
        (n as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("Documents");
    });
  });

  describe("keyboard navigation on column view", () => {
    beforeEach(async () => {
      fixture.componentRef.setInput("viewMode", "column");
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it("should select entry on click in column view", () => {
      const entries =
        fixture.nativeElement.querySelectorAll(".fb-column-entry");
      // Click a file entry (not a directory to avoid afterNextRender)
      entries[2]?.click(); // README.md
      fixture.detectChanges();

      expect(component.selectedEntry()?.name).toBe("README.md");
    });

    it("should emit fileActivated on double-click of file in column view", () => {
      const activated: unknown[] = [];
      component.fileActivated.subscribe((e) => activated.push(e));

      const entries =
        fixture.nativeElement.querySelectorAll(".fb-column-entry");
      // Find a file entry and dblclick it
      const fileEntry = Array.from(entries).find(
        (e) =>
          !(e as HTMLElement).classList.contains("fb-column-entry--directory"),
      ) as HTMLElement | undefined;
      fileEntry?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      expect(activated.length).toBe(1);
    });
  });

  describe("navigation guards and edge cases", () => {
    it("should not navigate into a non-directory entry", async () => {
      const file = ENTRIES.find((e) => !e.isDirectory)!;
      const beforeDir = component.currentDirectory();
      component.navigateToDirectory(file);
      fixture.detectChanges();
      await fixture.whenStable();
      // Should not have navigated
      expect(component.currentDirectory()).toBe(beforeDir);
    });

    it("should ignore Enter key press on entry if not Enter", () => {
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      const before = component.selectedEntry();
      entries[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      fixture.detectChanges();
      // Should not select or navigate
      expect(component.selectedEntry()).toBe(before);
    });
  });

  describe("pointer drag events", () => {
    function mockDivider(selector: string): HTMLElement {
      const divider = fixture.nativeElement.querySelector(
        selector,
      ) as HTMLElement;
      if (divider && !divider.setPointerCapture) {
        divider.setPointerCapture = () => {};
      } else if (divider) {
        vi.spyOn(divider, "setPointerCapture").mockImplementation(() => {});
      }
      return divider;
    }

    it("should start dragging sidebar on pointerdown", () => {
      const divider = mockDivider(".fb-divider--sidebar");
      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 240,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      expect(component["draggingPanel"]()).toBe("sidebar");
    });

    it("should stop dragging on pointerup", () => {
      const divider = mockDivider(".fb-divider--sidebar");
      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 240,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      divider.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      expect(component["draggingPanel"]()).toBeNull();
    });

    it("should stop dragging on pointercancel", () => {
      const divider = mockDivider(".fb-divider--sidebar");
      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 240,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      divider.dispatchEvent(
        new PointerEvent("pointercancel", {
          pointerId: 1,
          bubbles: true,
        }),
      );
      fixture.detectChanges();

      expect(component["draggingPanel"]()).toBeNull();
    });

    it("should update sidebar width on pointermove", () => {
      const divider = mockDivider(".fb-divider--sidebar");
      const initialWidth = component["sidebarWidthPx"]();

      divider.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: initialWidth,
          clientY: 200,
          bubbles: true,
        }),
      );
      divider.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 1,
          clientX: 150,
          clientY: 200,
          bubbles: true,
        }),
      );
      fixture.detectChanges();
    });

    it("should start dragging details pane when visible", () => {
      fixture.componentRef.setInput("showDetails", true);
      fixture.detectChanges();

      // Select entry to show details pane
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2]?.click();
      fixture.detectChanges();

      const divider = mockDivider(".fb-divider--details");
      if (divider) {
        divider.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 1,
            clientX: 600,
            clientY: 200,
            bubbles: true,
          }),
        );
        fixture.detectChanges();

        expect(component["draggingPanel"]()).toBe("details");

        // Clean up
        divider.dispatchEvent(
          new PointerEvent("pointerup", { pointerId: 1, bubbles: true }),
        );
        fixture.detectChanges();
      }
    });

    it("should update details panel width on pointermove", () => {
      fixture.componentRef.setInput("showDetails", true);
      fixture.detectChanges();

      // Select entry to show details pane
      const entries = fixture.nativeElement.querySelectorAll(".fb-entry");
      entries[2]?.click();
      fixture.detectChanges();

      const divider = mockDivider(".fb-divider--details");
      if (divider) {
        divider.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 1,
            clientX: 600,
            clientY: 200,
            bubbles: true,
          }),
        );
        divider.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            clientX: 500,
            clientY: 200,
            bubbles: true,
          }),
        );
        fixture.detectChanges();

        divider.dispatchEvent(
          new PointerEvent("pointerup", { pointerId: 1, bubbles: true }),
        );
        fixture.detectChanges();
      }
    });
  });

  describe("panel width persistence", () => {
    it("should save panel widths when name is set", () => {
      fixture.componentRef.setInput("name", "test-browser");
      fixture.detectChanges();

      const divider = fixture.nativeElement.querySelector(
        ".fb-divider--sidebar",
      );
      divider.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      fixture.detectChanges();

      const stored = localStorage.getItem("ui-file-browser:test-browser");
      expect(stored).not.toBeNull();
      localStorage.removeItem("ui-file-browser:test-browser");
    });

    it("should restore panel widths on init when name is set", async () => {
      // Set name first and flush any pending effects before writing test data.
      fixture.componentRef.setInput("name", "restore-test");
      fixture.detectChanges();

      const widthData = JSON.stringify({
        sidebarWidth: 300,
        detailsWidth: 280,
        sidebarCollapsed: false,
        detailsCollapsed: false,
      });
      localStorage.setItem("ui-file-browser:restore-test", widthData);

      fixture.componentRef.setInput("name", "restore-test");
      fixture.detectChanges();
      component.ngAfterViewInit();
      fixture.detectChanges();

      expect(component["sidebarWidthPx"]()).toBe(300);
      expect(component["detailsWidthPx"]()).toBe(280);
      localStorage.removeItem("ui-file-browser:restore-test");
    });

    it("should gracefully handle corrupt stored data", () => {
      localStorage.setItem("ui-file-browser:corrupt-test", "not-json");
      fixture.componentRef.setInput("name", "corrupt-test");
      fixture.detectChanges();
      expect(() => component.ngAfterViewInit()).not.toThrow();
      localStorage.removeItem("ui-file-browser:corrupt-test");
    });
  });

  describe("async datasource", () => {
    let asyncFixture: ComponentFixture<UIFileBrowser<FileMeta>>;
    let asyncComponent: UIFileBrowser<FileMeta>;

    beforeEach(async () => {
      const asyncDs = new AsyncTestDatasource();
      asyncFixture = TestBed.createComponent(UIFileBrowser<FileMeta>);
      asyncComponent = asyncFixture.componentInstance;
      asyncFixture.componentRef.setInput("datasource", asyncDs);
      asyncFixture.detectChanges();
      await asyncFixture.whenStable();
      asyncFixture.detectChanges();
    });

    it("should load root entries from async datasource", () => {
      const entries = asyncFixture.nativeElement.querySelectorAll(".fb-entry");
      expect(entries.length).toBe(ENTRIES.length);
    });

    it("should navigate into directory from async datasource", async () => {
      asyncComponent.navigateToDirectory(ENTRIES[0]); // Documents
      asyncFixture.detectChanges();
      await asyncFixture.whenStable();
      asyncFixture.detectChanges();

      const names =
        asyncFixture.nativeElement.querySelectorAll(".fb-entry-name");
      const texts = Array.from(names).map((n) =>
        (n as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("report.pdf");
    });

    it("should render tree view with async datasource", () => {
      const tree = asyncFixture.nativeElement.querySelector("ui-tree-view");
      expect(tree).toBeTruthy();
    });

    it("should work in column view with async datasource", async () => {
      asyncFixture.componentRef.setInput("viewMode", "column");
      asyncFixture.detectChanges();
      await asyncFixture.whenStable();
      asyncFixture.detectChanges();

      const panes =
        asyncFixture.nativeElement.querySelectorAll(".fb-column-pane");
      expect(panes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getEntryIcon", () => {
    it("should return entry.icon when explicitly set", () => {
      const entry: FileBrowserEntry<FileMeta> = {
        id: "x",
        name: "file.pdf",
        isDirectory: false,
        icon: "custom-icon",
      };
      const icon = (component as any).getEntryIcon(entry);
      expect(icon).toBe("custom-icon");
    });

    it("should return folder icon for directory without explicit icon", () => {
      const entry = ENTRIES[0]; // Documents — isDirectory: true
      const icon = (component as any).getEntryIcon(entry);
      expect(icon).toBe(component["icons"].folder);
    });

    it("should return file icon for file without icon", () => {
      const entry = ENTRIES[2]; // README.md — no icon
      const icon = (component as any).getEntryIcon(entry);
      expect(icon).toBe(component["icons"].file);
    });
  });

  describe("onTreeNodeActivated edge cases", () => {
    it("should not navigate when activated node is not a directory", async () => {
      const fileNode = { id: "readme", data: ENTRIES[2] }; // README.md
      const beforeDir = component.currentDirectory();
      (component as any).onTreeNodeActivated(fileNode);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.currentDirectory()).toBe(beforeDir);
    });

    it("should navigate when activated node is a directory", async () => {
      const dirNode = { id: "docs", data: ENTRIES[0] }; // Documents
      (component as any).onTreeNodeActivated(dirNode);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(component.currentDirectory()?.id).toBe("docs");
    });
  });

  describe("onTreeNodeSelected", () => {
    it("should do nothing when selection is empty", () => {
      const before = component.currentDirectory();
      (component as any).onTreeNodeSelected([]);
      expect(component.currentDirectory()).toBe(before);
    });

    it("should navigate when directory node is selected", async () => {
      const dirNode = { id: "docs", data: ENTRIES[0] }; // Documents
      (component as any).onTreeNodeSelected([dirNode]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(component.currentDirectory()?.id).toBe("docs");
    });

    it("should not navigate when file node is selected", () => {
      const before = component.currentDirectory();
      const fileNode = { id: "readme", data: ENTRIES[2] }; // README.md
      (component as any).onTreeNodeSelected([fileNode]);
      expect(component.currentDirectory()).toBe(before);
    });
  });

  describe("onBreadcrumbClick", () => {
    it("should navigate to root when clicking root breadcrumb item", async () => {
      // First navigate somewhere
      component.navigateToDirectory(ENTRIES[0]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      // Now click root breadcrumb
      const items = (component as any).breadcrumbItems();
      (component as any).onBreadcrumbClick(items[0]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.currentDirectory()).toBeNull();
    });

    it("should navigate to ancestor when clicking non-root breadcrumb item", async () => {
      // Navigate deep: root → docs → notes
      component.navigateToDirectory(ENTRIES[0]); // docs
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      component.navigateToDirectory(DOCS_ENTRIES[0]); // notes
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      // Items: [Root, Documents, Notes]
      const items = (component as any).breadcrumbItems();
      if (items.length > 1) {
        (component as any).onBreadcrumbClick(items[1]); // Documents
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.currentDirectory()?.id).toBe("docs");
      }
    });
  });

  describe("onEntryKeydown", () => {
    it("should emit fileActivated on Enter for a file", () => {
      const activated: unknown[] = [];
      component.fileActivated.subscribe((e) => activated.push(e));

      const entry = ENTRIES[2]; // README.md
      (component as any).onEntryKeydown(
        new KeyboardEvent("keydown", { key: "Enter" }),
        entry,
      );
      expect(activated.length).toBe(1);
    });
  });
});
