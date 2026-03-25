import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UICommandPalette } from "./command-palette.component";
import type { CommandPaletteItem } from "./command-palette.types";

const COMMANDS: CommandPaletteItem[] = [
  { id: "save", label: "Save File", group: "File", shortcut: "Cmd+S" },
  { id: "open", label: "Open File", group: "File", shortcut: "Cmd+O" },
  { id: "close", label: "Close Tab", group: "File" },
  {
    id: "find",
    label: "Find in Files",
    group: "Search",
    shortcut: "Cmd+Shift+F",
    keywords: ["grep", "search"],
  },
  {
    id: "replace",
    label: "Find and Replace",
    group: "Search",
    shortcut: "Cmd+H",
  },
  {
    id: "settings",
    label: "Open Settings",
    group: "Preferences",
    icon: "<path d='M0 0'/>",
  },
  { id: "disabled-cmd", label: "Disabled Action", disabled: true },
];

describe("UICommandPalette", () => {
  let component: UICommandPalette;
  let fixture: ComponentFixture<UICommandPalette>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UICommandPalette],
    }).compileComponents();

    fixture = TestBed.createComponent(UICommandPalette);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("commands", COMMANDS);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default open to false", () => {
      expect(component.open()).toBe(false);
    });

    it("should default placeholder", () => {
      expect(component.placeholder()).toBe("Type a command…");
    });

    it("should default maxRecent to 5", () => {
      expect(component.maxRecent()).toBe(5);
    });

    it("should default globalShortcut to true", () => {
      expect(component.globalShortcut()).toBe(true);
    });
  });

  describe("open / close", () => {
    it("should show the dialog when open is true", () => {
      component.show();
      fixture.detectChanges();
      const dialog = fixture.nativeElement.querySelector(".cp-dialog");
      expect(dialog).toBeTruthy();
    });

    it("should hide the dialog when open is false", () => {
      expect(fixture.nativeElement.querySelector(".cp-dialog")).toBeNull();
    });

    it("should close programmatically", () => {
      component.show();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".cp-dialog")).toBeTruthy();
      component.close();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".cp-dialog")).toBeNull();
    });
  });

  describe("search filtering", () => {
    beforeEach(() => {
      component.show();
      fixture.detectChanges();
    });

    it("should show all commands when query is empty", () => {
      const items = fixture.nativeElement.querySelectorAll(".cp-item");
      expect(items.length).toBe(COMMANDS.length);
    });

    it("should filter commands by label", () => {
      simulateSearch("Save");
      const items = fixture.nativeElement.querySelectorAll(".cp-item");
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain("Save File");
    });

    it("should filter commands by keywords", () => {
      simulateSearch("grep");
      const items = fixture.nativeElement.querySelectorAll(".cp-item");
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain("Find in Files");
    });

    it("should filter commands by group name", () => {
      simulateSearch("Search");
      const items = fixture.nativeElement.querySelectorAll(".cp-item");
      expect(items.length).toBe(2);
    });

    it("should show empty message when no matches", () => {
      simulateSearch("zzzzzzz");
      const empty = fixture.nativeElement.querySelector(".cp-empty");
      expect(empty).toBeTruthy();
      expect(empty.textContent).toContain("No matching commands");
    });
  });

  describe("grouping", () => {
    beforeEach(() => {
      component.show();
      fixture.detectChanges();
    });

    it("should display group headings", () => {
      const headings =
        fixture.nativeElement.querySelectorAll(".cp-group-heading");
      const texts = Array.from(headings).map((h: unknown) =>
        (h as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("File");
      expect(texts).toContain("Search");
      expect(texts).toContain("Preferences");
    });
  });

  describe("keyboard navigation", () => {
    beforeEach(() => {
      component.show();
      fixture.detectChanges();
    });

    it("should move active index down on ArrowDown", () => {
      expect(component["activeIndex"]()).toBe(0);
      dispatchKey("ArrowDown");
      expect(component["activeIndex"]()).toBe(1);
    });

    it("should move active index up on ArrowUp", () => {
      component["activeIndex"].set(2);
      dispatchKey("ArrowUp");
      expect(component["activeIndex"]()).toBe(1);
    });

    it("should wrap around at boundaries", () => {
      component["activeIndex"].set(COMMANDS.length - 1);
      dispatchKey("ArrowDown");
      expect(component["activeIndex"]()).toBe(0);
    });

    it("should close on Escape", () => {
      dispatchKey("Escape");
      fixture.detectChanges();
      expect(component.open()).toBe(false);
    });

    it("should execute on Enter", () => {
      const spy = vi.fn();
      component.execute.subscribe(spy);
      component["activeIndex"].set(0);
      dispatchKey("Enter");
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].command.id).toBe("save");
    });

    it("should not execute disabled commands on Enter", () => {
      const spy = vi.fn();
      component.execute.subscribe(spy);
      // "disabled-cmd" is at index 6
      component["activeIndex"].set(6);
      dispatchKey("Enter");
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("command execution", () => {
    beforeEach(() => {
      component.show();
      fixture.detectChanges();
    });

    it("should emit execute event on item click", () => {
      const spy = vi.fn();
      component.execute.subscribe(spy);
      const items = fixture.nativeElement.querySelectorAll(".cp-item");
      items[0].click();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].command.id).toBe("save");
      expect(spy.mock.calls[0][0].executedAt).toBeTruthy();
    });

    it("should close the palette after execution", () => {
      const items = fixture.nativeElement.querySelectorAll(".cp-item");
      items[0].click();
      fixture.detectChanges();
      expect(component.open()).toBe(false);
    });

    it("should not execute disabled items on click", () => {
      const spy = vi.fn();
      component.execute.subscribe(spy);
      const items = fixture.nativeElement.querySelectorAll(".cp-item");
      // Find the disabled item
      const disabledItem = Array.from(items).find((el) =>
        (el as HTMLElement).classList.contains("cp-item--disabled"),
      ) as HTMLElement;
      disabledItem?.click();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("recent commands", () => {
    beforeEach(() => {
      component.show();
      fixture.detectChanges();
    });

    it("should not show recent section initially", () => {
      const heading = fixture.nativeElement.querySelector(".cp-group-heading");
      expect(heading?.textContent?.trim()).not.toBe("Recent");
    });

    it("should show recent section after executing a command", () => {
      // Execute a command
      const items = fixture.nativeElement.querySelectorAll(".cp-item");
      items[0].click();
      fixture.detectChanges();

      // Re-open
      component.show();
      fixture.detectChanges();

      const headings =
        fixture.nativeElement.querySelectorAll(".cp-group-heading");
      const texts = Array.from(headings).map((h: unknown) =>
        (h as HTMLElement).textContent?.trim(),
      );
      expect(texts).toContain("Recent");
    });

    it("should respect maxRecent limit", () => {
      fixture.componentRef.setInput("maxRecent", 2);
      fixture.detectChanges();

      // Execute 3 different commands
      executeById("save");
      executeById("open");
      executeById("find");

      component.show();
      fixture.detectChanges();

      expect(component["recentIds"]().length).toBeLessThanOrEqual(2);
    });

    it("should not show recent section when maxRecent is 0", () => {
      fixture.componentRef.setInput("maxRecent", 0);
      fixture.detectChanges();

      executeById("save");
      component.show();
      fixture.detectChanges();

      const headings =
        fixture.nativeElement.querySelectorAll(".cp-group-heading");
      const texts = Array.from(headings).map((h: unknown) =>
        (h as HTMLElement).textContent?.trim(),
      );
      expect(texts).not.toContain("Recent");
    });
  });

  describe("backdrop", () => {
    it("should close on backdrop click", () => {
      component.show();
      fixture.detectChanges();
      const backdrop = fixture.nativeElement.querySelector(".cp-backdrop");
      backdrop.click();
      fixture.detectChanges();
      expect(component.open()).toBe(false);
    });
  });

  describe("shortcut hints", () => {
    beforeEach(() => {
      component.show();
      fixture.detectChanges();
    });

    it("should display shortcut text on items that have one", () => {
      const shortcuts =
        fixture.nativeElement.querySelectorAll(".cp-item-shortcut");
      expect(shortcuts.length).toBeGreaterThan(0);
      expect(shortcuts[0].textContent).toContain("Cmd+S");
    });
  });

  describe("icons", () => {
    beforeEach(() => {
      component.show();
      fixture.detectChanges();
    });

    it("should render icons for items that have one", () => {
      const icons = fixture.nativeElement.querySelectorAll(".cp-item-icon");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  // ── Helpers ─────────────────────────────────────────────────────

  function simulateSearch(value: string): void {
    const input = fixture.nativeElement.querySelector(
      ".cp-search-input",
    ) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
  }

  function dispatchKey(key: string): void {
    const dialog = fixture.nativeElement.querySelector(".cp-dialog");
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    fixture.detectChanges();
  }

  function executeById(id: string): void {
    component.show();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll(".cp-item");
    const target = Array.from(items).find((el) =>
      (el as HTMLElement).textContent?.includes(
        COMMANDS.find((c) => c.id === id)!.label,
      ),
    ) as HTMLElement;
    target?.click();
    fixture.detectChanges();
  }
});
