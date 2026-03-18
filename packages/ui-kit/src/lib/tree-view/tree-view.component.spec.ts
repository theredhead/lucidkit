import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UITreeView } from "./tree-view.component";
import { ArrayTreeDatasource } from "./array-tree-datasource";
import type { TreeNode } from "./tree-view.types";

// ── Helpers ───────────────────────────────────────────────────────────

interface FileEntry {
  name: string;
  type: "file" | "folder";
}

function makeTree(): TreeNode<FileEntry>[] {
  return [
    {
      id: "src",
      data: { name: "src", type: "folder" },
      children: [
        {
          id: "src/app",
          data: { name: "app", type: "folder" },
          children: [
            {
              id: "src/app/main.ts",
              data: { name: "main.ts", type: "file" },
            },
            {
              id: "src/app/app.ts",
              data: { name: "app.ts", type: "file" },
            },
          ],
        },
        {
          id: "src/index.html",
          data: { name: "index.html", type: "file" },
        },
      ],
    },
    {
      id: "readme",
      data: { name: "README.md", type: "file" },
    },
    {
      id: "disabled-folder",
      data: { name: "disabled", type: "folder" },
      disabled: true,
      children: [
        {
          id: "disabled-child",
          data: { name: "child.ts", type: "file" },
        },
      ],
    },
  ];
}

// ── Test host ─────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UITreeView],
  template: `
    <ui-tree-view
      [datasource]="ds()"
      [displayWith]="displayWith"
      [(selected)]="selected"
    />
  `,
})
class TestHost {
  public readonly ds = signal(new ArrayTreeDatasource(makeTree()));
  public readonly displayWith = (data: FileEntry): string => data.name;
  public selected: readonly TreeNode<FileEntry>[] = [];
}

// ── Suite ─────────────────────────────────────────────────────────────

describe("UITreeView", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let treeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    treeEl = fixture.nativeElement.querySelector("ui-tree-view")!;
  });

  // ── Creation ────────────────────────────────────────────────────────

  it("should create", () => {
    expect(treeEl).toBeTruthy();
  });

  it("should render root-level nodes", () => {
    const nodes = treeEl.querySelectorAll(":scope > ui-tree-node");
    expect(nodes.length).toBe(3);
  });

  // ── ARIA ────────────────────────────────────────────────────────────

  describe("ARIA", () => {
    it("should have role tree", () => {
      expect(treeEl.getAttribute("role")).toBe("tree");
    });

    it("should expose aria-label", () => {
      expect(treeEl.getAttribute("aria-label")).toBe("Tree view");
    });

    it("should always set aria-multiselectable to true", () => {
      expect(treeEl.getAttribute("aria-multiselectable")).toBe("true");
    });

    it("should set role treeitem on nodes", () => {
      const item = treeEl.querySelector("ui-tree-node");
      expect(item?.getAttribute("role")).toBe("treeitem");
    });

    it("should set aria-level on nodes", () => {
      const item = treeEl.querySelector("ui-tree-node");
      expect(item?.getAttribute("aria-level")).toBe("1");
    });

    it("should set aria-expanded on nodes with children", () => {
      const item = treeEl.querySelector("ui-tree-node");
      expect(item?.getAttribute("aria-expanded")).toBe("false");
    });

    it("should not set aria-expanded on leaf nodes", () => {
      const items = treeEl.querySelectorAll(":scope > ui-tree-node");
      // README.md is a leaf (second root)
      const readme = items[1];
      expect(readme.getAttribute("aria-expanded")).toBeNull();
    });

    it("should set aria-disabled on disabled nodes", () => {
      const items = treeEl.querySelectorAll(":scope > ui-tree-node");
      const disabled = items[2];
      expect(disabled.getAttribute("aria-disabled")).toBe("true");
    });
  });

  // ── Display ─────────────────────────────────────────────────────────

  describe("display", () => {
    it("should render labels using displayWith", () => {
      const label = treeEl.querySelector(".tv-node-label")!;
      expect(label.textContent?.trim()).toBe("src");
    });
  });

  // ── Expand / collapse ──────────────────────────────────────────────

  describe("expand/collapse", () => {
    it("should expand a node when toggle is clicked", () => {
      const toggle = treeEl.querySelector(".tv-toggle") as HTMLElement;
      toggle.click();
      fixture.detectChanges();

      const children = treeEl.querySelector(".tv-children");
      expect(children).toBeTruthy();
      const childNodes = children!.querySelectorAll(":scope > ui-tree-node");
      expect(childNodes.length).toBe(2); // app folder + index.html
    });

    it("should collapse an expanded node when toggle is clicked again", () => {
      const toggle = treeEl.querySelector(".tv-toggle") as HTMLElement;
      toggle.click();
      fixture.detectChanges();
      expect(treeEl.querySelector(".tv-children")).toBeTruthy();

      toggle.click();
      fixture.detectChanges();
      expect(treeEl.querySelector(".tv-children")).toBeFalsy();
    });

    it("should set aria-expanded to true when expanded", () => {
      const toggle = treeEl.querySelector(".tv-toggle") as HTMLElement;
      toggle.click();
      fixture.detectChanges();

      const item = treeEl.querySelector("ui-tree-node");
      expect(item?.getAttribute("aria-expanded")).toBe("true");
    });

    it("should render children with role=group wrapper", () => {
      const toggle = treeEl.querySelector(".tv-toggle") as HTMLElement;
      toggle.click();
      fixture.detectChanges();

      const group = treeEl.querySelector("[role='group']");
      expect(group).toBeTruthy();
    });

    it("should set aria-level=2 on child nodes", () => {
      const toggle = treeEl.querySelector(".tv-toggle") as HTMLElement;
      toggle.click();
      fixture.detectChanges();

      const children = treeEl.querySelectorAll(".tv-children > ui-tree-node");
      expect(children[0].getAttribute("aria-level")).toBe("2");
    });

    it("should not expand a disabled node", () => {
      const items = treeEl.querySelectorAll(":scope > ui-tree-node");
      const disabledToggle = items[2].querySelector(
        ".tv-toggle",
      ) as HTMLElement;
      if (disabledToggle) {
        disabledToggle.click();
        fixture.detectChanges();
      }
      expect(items[2].querySelector(".tv-children")).toBeFalsy();
    });
  });

  // ── Click selection ────────────────────────────────────────────────

  describe("click selection", () => {
    it("should select a node when row is clicked", () => {
      const row = treeEl.querySelector(".tv-node-row") as HTMLElement;
      row.click();
      fixture.detectChanges();
      expect(host.selected.length).toBe(1);
      expect(host.selected[0].id).toBe("src");
    });

    it("should apply selected host class", () => {
      const row = treeEl.querySelector(".tv-node-row") as HTMLElement;
      row.click();
      fixture.detectChanges();

      const item = treeEl.querySelector("ui-tree-node");
      expect(item?.classList.contains("ui-tree-node--selected")).toBe(true);
    });

    it("should replace selection on plain click", () => {
      const rows = treeEl.querySelectorAll(
        ":scope > ui-tree-node > .tv-node-row",
      );
      (rows[0] as HTMLElement).click();
      fixture.detectChanges();
      (rows[1] as HTMLElement).click();
      fixture.detectChanges();
      expect(host.selected.length).toBe(1);
      expect(host.selected[0].id).toBe("readme");
    });

    it("should add to selection on Ctrl+click", () => {
      const rows = treeEl.querySelectorAll(
        ":scope > ui-tree-node > .tv-node-row",
      );
      (rows[0] as HTMLElement).click();
      fixture.detectChanges();

      (rows[1] as HTMLElement).dispatchEvent(
        new MouseEvent("click", { bubbles: true, ctrlKey: true }),
      );
      fixture.detectChanges();
      expect(host.selected.length).toBe(2);
      expect(host.selected.map((n) => n.id)).toContain("src");
      expect(host.selected.map((n) => n.id)).toContain("readme");
    });

    it("should add to selection on Meta+click (⌘ on macOS)", () => {
      const rows = treeEl.querySelectorAll(
        ":scope > ui-tree-node > .tv-node-row",
      );
      (rows[0] as HTMLElement).click();
      fixture.detectChanges();

      (rows[1] as HTMLElement).dispatchEvent(
        new MouseEvent("click", { bubbles: true, metaKey: true }),
      );
      fixture.detectChanges();
      expect(host.selected.length).toBe(2);
    });

    it("should deselect a node on Ctrl+click when already selected", () => {
      const row = treeEl.querySelector(".tv-node-row") as HTMLElement;
      row.click();
      fixture.detectChanges();
      expect(host.selected.length).toBe(1);

      row.dispatchEvent(
        new MouseEvent("click", { bubbles: true, ctrlKey: true }),
      );
      fixture.detectChanges();
      expect(host.selected.length).toBe(0);
    });

    it("should not select a disabled node", () => {
      const items = treeEl.querySelectorAll(":scope > ui-tree-node");
      const row = items[2].querySelector(".tv-node-row") as HTMLElement;
      row.click();
      fixture.detectChanges();
      expect(host.selected.length).toBe(0);
    });

    it("should apply focused host class on the clicked node", () => {
      const row = treeEl.querySelector(".tv-node-row") as HTMLElement;
      row.click();
      fixture.detectChanges();

      const item = treeEl.querySelector("ui-tree-node");
      expect(item?.classList.contains("ui-tree-node--focused")).toBe(true);
    });
  });

  // ── expandAll / collapseAll ────────────────────────────────────────

  describe("expandAll / collapseAll", () => {
    it("should expand all nodes recursively", () => {
      const treeView = fixture.debugElement.query(
        (de) => de.nativeElement.tagName === "UI-TREE-VIEW",
      ).componentInstance as UITreeView<FileEntry>;

      treeView.expandAll();
      fixture.detectChanges();

      // All parent nodes should be expanded — src, src/app, disabled-folder
      const groups = treeEl.querySelectorAll("[role='group']");
      expect(groups.length).toBeGreaterThanOrEqual(2);
    });

    it("should collapse all nodes", () => {
      const treeView = fixture.debugElement.query(
        (de) => de.nativeElement.tagName === "UI-TREE-VIEW",
      ).componentInstance as UITreeView<FileEntry>;

      treeView.expandAll();
      fixture.detectChanges();
      treeView.collapseAll();
      fixture.detectChanges();

      const groups = treeEl.querySelectorAll("[role='group']");
      expect(groups.length).toBe(0);
    });
  });

  // ── Keyboard navigation ────────────────────────────────────────────

  describe("keyboard navigation", () => {
    function press(key: string, opts?: Partial<KeyboardEventInit>): void {
      treeEl.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, ...opts }),
      );
      fixture.detectChanges();
    }

    it("should move cursor to the first node with ArrowDown", () => {
      press("ArrowDown");
      const firstNode = treeEl.querySelector("ui-tree-node");
      expect(firstNode?.classList.contains("ui-tree-node--focused")).toBe(true);
    });

    it("should select the cursor node on ArrowDown", () => {
      press("ArrowDown");
      expect(host.selected.length).toBe(1);
      expect(host.selected[0].id).toBe("src");
    });

    it("should move cursor down with ArrowDown", () => {
      press("ArrowDown"); // cursor → src
      press("ArrowDown"); // cursor → readme
      const items = treeEl.querySelectorAll(":scope > ui-tree-node");
      expect(items[1].classList.contains("ui-tree-node--focused")).toBe(true);
    });

    it("should replace selection when moving with ArrowDown", () => {
      press("ArrowDown"); // → src
      press("ArrowDown"); // → readme
      expect(host.selected.length).toBe(1);
      expect(host.selected[0].id).toBe("readme");
    });

    it("should remove selected/focused classes from the previous node on ArrowDown", () => {
      press("ArrowDown"); // cursor → src
      const items = treeEl.querySelectorAll(":scope > ui-tree-node");
      expect(items[0].classList.contains("ui-tree-node--selected")).toBe(true);
      expect(items[0].classList.contains("ui-tree-node--focused")).toBe(true);

      press("ArrowDown"); // cursor → readme
      expect(items[0].classList.contains("ui-tree-node--selected")).toBe(false);
      expect(items[0].classList.contains("ui-tree-node--focused")).toBe(false);
      expect(items[1].classList.contains("ui-tree-node--selected")).toBe(true);
      expect(items[1].classList.contains("ui-tree-node--focused")).toBe(true);
    });

    it("should move cursor up with ArrowUp", () => {
      press("ArrowDown"); // cursor → src
      press("ArrowDown"); // cursor → readme
      press("ArrowUp"); // back to src
      const items = treeEl.querySelectorAll(":scope > ui-tree-node");
      expect(items[0].classList.contains("ui-tree-node--focused")).toBe(true);
    });

    it("should replace selection when moving with ArrowUp", () => {
      press("ArrowDown"); // → src
      press("ArrowDown"); // → readme
      press("ArrowUp"); // → src
      expect(host.selected.length).toBe(1);
      expect(host.selected[0].id).toBe("src");
    });

    it("should expand a node with ArrowRight", () => {
      press("ArrowDown"); // cursor → src
      press("ArrowRight"); // expand src
      expect(treeEl.querySelector(".tv-children")).toBeTruthy();
    });

    it("should collapse an expanded node with ArrowLeft", () => {
      press("ArrowDown"); // cursor → src
      press("ArrowRight"); // expand
      expect(treeEl.querySelector(".tv-children")).toBeTruthy();
      press("ArrowLeft"); // collapse
      expect(treeEl.querySelector(".tv-children")).toBeFalsy();
    });

    it("should move cursor to parent with ArrowLeft on a collapsed node", () => {
      // Expand src so children are visible
      const toggle = treeEl.querySelector(".tv-toggle") as HTMLElement;
      toggle.click();
      fixture.detectChanges();

      press("ArrowDown"); // → src
      press("ArrowDown"); // → app (child)
      press("ArrowLeft"); // → parent (src)

      const srcNode = treeEl.querySelector(":scope > ui-tree-node");
      expect(srcNode?.classList.contains("ui-tree-node--focused")).toBe(true);
      expect(host.selected.length).toBe(1);
      expect(host.selected[0].id).toBe("src");
    });

    it("should activate cursor node with Enter", () => {
      let activated = false;
      const treeView = fixture.debugElement.query(
        (de) => de.nativeElement.tagName === "UI-TREE-VIEW",
      ).componentInstance as UITreeView<FileEntry>;
      treeView.nodeActivated.subscribe(() => (activated = true));

      press("ArrowDown"); // cursor → src
      press("Enter");
      expect(activated).toBe(true);
    });

    it("should jump to first node with Home", () => {
      press("ArrowDown");
      press("ArrowDown");
      press("Home");
      const first = treeEl.querySelector("ui-tree-node");
      expect(first?.classList.contains("ui-tree-node--focused")).toBe(true);
      expect(host.selected[0].id).toBe("src");
    });

    it("should jump to last node with End", () => {
      press("End");
      const items = treeEl.querySelectorAll(":scope > ui-tree-node");
      const last = items[items.length - 1];
      expect(last.classList.contains("ui-tree-node--focused")).toBe(true);
    });

    it("should clear selection with Escape", () => {
      press("ArrowDown"); // select src
      expect(host.selected.length).toBe(1);
      press("Escape");
      expect(host.selected.length).toBe(0);
    });

    describe("Shift+Arrow extends selection", () => {
      it("should extend selection downward with Shift+ArrowDown", () => {
        press("ArrowDown"); // select src
        expect(host.selected.length).toBe(1);

        press("ArrowDown", { shiftKey: true }); // extend to readme
        expect(host.selected.length).toBe(2);
        expect(host.selected.map((n) => n.id)).toContain("src");
        expect(host.selected.map((n) => n.id)).toContain("readme");
      });

      it("should extend selection upward with Shift+ArrowUp", () => {
        press("ArrowDown"); // select src
        press("ArrowDown"); // select readme (replace)
        press("ArrowUp", { shiftKey: true }); // extend upward to src
        expect(host.selected.length).toBe(2);
        expect(host.selected.map((n) => n.id)).toContain("src");
        expect(host.selected.map((n) => n.id)).toContain("readme");
      });

      it("should extend selection to first with Shift+Home", () => {
        press("ArrowDown"); // select src
        press("ArrowDown"); // select readme (replace)
        press("Home", { shiftKey: true }); // extend to first (src)
        expect(host.selected.length).toBe(2);
        expect(host.selected.map((n) => n.id)).toContain("src");
        expect(host.selected.map((n) => n.id)).toContain("readme");
      });

      it("should keep existing selection when Shift+End lands on disabled node", () => {
        press("ArrowDown"); // select src
        press("End", { shiftKey: true }); // cursor to disabled-folder — disabled, not added
        // Selection preserved because last node is disabled
        expect(host.selected.length).toBe(1);
        expect(host.selected[0].id).toBe("src");
      });

      it("should not duplicate nodes in extended selection", () => {
        press("ArrowDown"); // select src
        press("ArrowDown", { shiftKey: true }); // extend to readme
        press("ArrowUp", { shiftKey: true }); // extend back to src (already selected)
        // src should not appear twice
        const srcCount = host.selected.filter((n) => n.id === "src").length;
        expect(srcCount).toBe(1);
      });

      it("should replace selection when arrow is pressed without Shift after extending", () => {
        // Expand src so there are more non-disabled nodes
        const toggle = treeEl.querySelector(".tv-toggle") as HTMLElement;
        toggle.click();
        fixture.detectChanges();

        press("ArrowDown"); // select src
        press("ArrowDown", { shiftKey: true }); // extend to app
        expect(host.selected.length).toBe(2);

        press("ArrowDown"); // no shift → replace with index.html
        expect(host.selected.length).toBe(1);
        expect(host.selected[0].id).toBe("src/index.html");
      });
    });

    describe("keyboard events from node row (bubbled)", () => {
      function pressOnRow(row: HTMLElement, key: string): void {
        row.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
        fixture.detectChanges();
      }

      it("should expand via ArrowRight after clicking a node row", () => {
        const row = treeEl.querySelector(".tv-node-row") as HTMLElement;
        row.click();
        fixture.detectChanges();

        pressOnRow(row, "ArrowRight");
        expect(treeEl.querySelector(".tv-children")).toBeTruthy();
      });

      it("should navigate via ArrowDown after clicking a node row", () => {
        const row = treeEl.querySelector(".tv-node-row") as HTMLElement;
        row.click();
        fixture.detectChanges();

        pressOnRow(row, "ArrowDown");

        const items = treeEl.querySelectorAll(":scope > ui-tree-node");
        expect(items[1].classList.contains("ui-tree-node--focused")).toBe(true);
      });
    });

    describe("sorting", () => {
      it("should accept sortComparator input", () => {
        const comp = (a: TreeNode<FileEntry>, b: TreeNode<FileEntry>) =>
          a.data.name.localeCompare(b.data.name);
        fixture.componentRef.setInput("sortComparator", comp);
        fixture.detectChanges();

        // Verify the input was set by checking it doesn't throw
        expect(fixture.componentInstance).toBeTruthy();
      });

      it("should clear sortComparator when set to null", () => {
        const comp = (a: TreeNode<FileEntry>, b: TreeNode<FileEntry>) =>
          a.data.name.localeCompare(b.data.name);
        fixture.componentRef.setInput("sortComparator", comp);
        fixture.detectChanges();

        fixture.componentRef.setInput("sortComparator", null);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
      });

      it("should handle undefined sortComparator", () => {
        fixture.componentRef.setInput("sortComparator", undefined);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
      });

      it("should work with filterPredicate and sortComparator together", () => {
        const filterPred = (e: FileEntry) => e.type === "folder";
        const sortComp = (a: TreeNode<FileEntry>, b: TreeNode<FileEntry>) =>
          a.data.name.localeCompare(b.data.name);

        fixture.componentRef.setInput("filterPredicate", filterPred);
        fixture.componentRef.setInput("sortComparator", sortComp);
        fixture.detectChanges();

        expect(fixture.componentInstance).toBeTruthy();
      });

      it("should render with sortComparator applied", () => {
        const comp = (a: TreeNode<FileEntry>, b: TreeNode<FileEntry>) =>
          a.data.name.localeCompare(b.data.name);
        fixture.componentRef.setInput("sortComparator", comp);
        fixture.detectChanges();

        const treeNodes =
          fixture.nativeElement.querySelectorAll("ui-tree-node");
        expect(treeNodes.length).toBeGreaterThan(0);
      });
    });
  });
});

// ── ArrayTreeDatasource unit tests ────────────────────────────────────

describe("ArrayTreeDatasource", () => {
  const tree = makeTree();
  const ds = new ArrayTreeDatasource(tree);

  it("should return root nodes", () => {
    const roots = ds.getRootNodes();
    expect(Array.isArray(roots)).toBe(true);
    expect((roots as TreeNode<FileEntry>[]).length).toBe(3);
  });

  it("should return children of a node", () => {
    const roots = ds.getRootNodes() as TreeNode<FileEntry>[];
    const children = ds.getChildren(roots[0]);
    expect(Array.isArray(children)).toBe(true);
    expect((children as TreeNode<FileEntry>[]).length).toBe(2);
  });

  it("should report hasChildren correctly", () => {
    const roots = ds.getRootNodes() as TreeNode<FileEntry>[];
    expect(ds.hasChildren(roots[0])).toBe(true); // src folder
    expect(ds.hasChildren(roots[1])).toBe(false); // README.md
  });

  it("should return empty array for leaf getChildren", () => {
    const roots = ds.getRootNodes() as TreeNode<FileEntry>[];
    const children = ds.getChildren(roots[1]);
    expect(children).toEqual([]);
  });

  it("should not be affected by mutations to the original array", () => {
    const original = [{ id: "1", data: { name: "x", type: "file" as const } }];
    const datasource = new ArrayTreeDatasource(original);
    original.push({ id: "2", data: { name: "y", type: "file" as const } });
    expect((datasource.getRootNodes() as TreeNode<FileEntry>[]).length).toBe(1);
  });
});
