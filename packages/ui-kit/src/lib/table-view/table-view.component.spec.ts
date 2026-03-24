import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArrayDatasource } from "@theredhead/foundation";

import { UITableView } from "./table-view.component";
import { UITextColumn } from "./columns/text-column/text-column.component";
import type { SelectionMode } from "../core/selection-model";

// ── Test helpers ─────────────────────────────────────────────────────

interface Person {
  id: number;
  name: string;
}

const PEOPLE: Person[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Diana" },
  { id: 5, name: "Eve" },
];

@Component({
  selector: "ui-tv-test-host",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITableView, UITextColumn],
  template: `
    <ui-table-view
      [datasource]="datasource()"
      [selectionMode]="selectionMode()"
      [rowClickSelect]="rowClickSelect()"
    >
      <ui-text-column key="name" headerText="Name" />
    </ui-table-view>
  `,
})
class TestHost {
  readonly selectionMode = signal<SelectionMode>("single");
  readonly rowClickSelect = signal(true);
  readonly datasource = signal(new ArrayDatasource(PEOPLE));
}

// ── Helpers ──────────────────────────────────────────────────────────

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

// ── Tests ────────────────────────────────────────────────────────────

describe("UITableView", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let tableEl: HTMLElement;
  let tableView: UITableView;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    // Allow the visibleWindow effect to resolve synchronous rows
    await fixture.whenStable();
    fixture.detectChanges();

    tableEl = fixture.nativeElement.querySelector("ui-table-view")!;
    tableView = fixture.debugElement.children[0].componentInstance;
  });

  it("should create", () => {
    expect(tableView).toBeTruthy();
  });

  describe("host element", () => {
    it("should be focusable via tabindex", () => {
      expect(tableEl.getAttribute("tabindex")).toBe("0");
    });
  });

  describe("keyboard navigation", () => {
    describe("ArrowDown", () => {
      it("should activate the first row when no row is active", () => {
        keydown(tableEl, "ArrowDown");
        fixture.detectChanges();

        // activeIndex is protected — verify via selection side-effect
        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(1);
        expect((selected[0] as Person).name).toBe("Alice");
      });

      it("should move to the next row", () => {
        keydown(tableEl, "ArrowDown"); // → 0 (Alice)
        keydown(tableEl, "ArrowDown"); // → 1 (Bob)
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(1);
        expect((selected[0] as Person).name).toBe("Bob");
      });

      it("should clamp at the last row", () => {
        for (let i = 0; i < PEOPLE.length + 3; i++) {
          keydown(tableEl, "ArrowDown");
        }
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(1);
        expect((selected[0] as Person).name).toBe("Eve");
      });
    });

    describe("ArrowUp", () => {
      it("should activate the first row when no row is active", () => {
        keydown(tableEl, "ArrowUp");
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(1);
        expect((selected[0] as Person).name).toBe("Alice");
      });

      it("should move to the previous row", () => {
        // Navigate to row 2 first
        keydown(tableEl, "ArrowDown"); // → 0
        keydown(tableEl, "ArrowDown"); // → 1
        keydown(tableEl, "ArrowDown"); // → 2
        keydown(tableEl, "ArrowUp"); // → 1
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(1);
        expect((selected[0] as Person).name).toBe("Bob");
      });

      it("should clamp at the first row", () => {
        keydown(tableEl, "ArrowDown"); // → 0
        keydown(tableEl, "ArrowUp"); // → still 0
        keydown(tableEl, "ArrowUp"); // → still 0
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(1);
        expect((selected[0] as Person).name).toBe("Alice");
      });
    });

    describe("Home / End", () => {
      it("should jump to the first row on Home", () => {
        // Navigate to the middle first
        keydown(tableEl, "ArrowDown");
        keydown(tableEl, "ArrowDown");
        keydown(tableEl, "ArrowDown");
        keydown(tableEl, "Home");
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect((selected[0] as Person).name).toBe("Alice");
      });

      it("should jump to the last row on End", () => {
        keydown(tableEl, "End");
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect((selected[0] as Person).name).toBe("Eve");
      });
    });

    describe("selection modes", () => {
      it("should not select when selectionMode is none", () => {
        host.selectionMode.set("none");
        fixture.detectChanges();

        keydown(tableEl, "ArrowDown");
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(0);
      });

      it("should select in single mode", () => {
        host.selectionMode.set("single");
        fixture.detectChanges();

        keydown(tableEl, "ArrowDown"); // → 0
        keydown(tableEl, "ArrowDown"); // → 1
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(1);
        expect((selected[0] as Person).name).toBe("Bob");
      });

      it("should select in multiple mode", () => {
        host.selectionMode.set("multiple");
        fixture.detectChanges();

        keydown(tableEl, "ArrowDown");
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(1);
        expect((selected[0] as Person).name).toBe("Alice");
      });
    });

    describe("non-navigation keys", () => {
      it("should not interfere with unrelated keys", () => {
        keydown(tableEl, "a");
        keydown(tableEl, "Tab");
        keydown(tableEl, "Escape");
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(0);
      });
    });

    describe("empty table", () => {
      it("should do nothing when the table has no rows", () => {
        host.datasource.set(new ArrayDatasource<Person>([]));
        fixture.detectChanges();

        keydown(tableEl, "ArrowDown");
        fixture.detectChanges();

        const selected = tableView["selection"]().selected();
        expect(selected).toHaveLength(0);
      });
    });
  });

  describe("row click", () => {
    it("should sync activeIndex when a row is clicked", async () => {
      // Simulate the row-click handler (CdkVirtualScrollViewport
      // does not render rows in the jsdom/zoneless test environment)
      tableView["onRowClick"](PEOPLE[2]); // Charlie → index 2
      fixture.detectChanges();
      await fixture.whenStable();

      expect(tableView["activeIndex"]()).toBe(2);

      // ArrowDown from index 2 → index 3 (Diana)
      keydown(tableEl, "ArrowDown");
      fixture.detectChanges();

      const selected = tableView["selection"]().selected();
      expect((selected[0] as Person).name).toBe("Diana");
    });
  });

  describe("active row indicator", () => {
    it("should add table-row--active class to the active row", () => {
      keydown(tableEl, "ArrowDown"); // → 0
      fixture.detectChanges();

      const rows = tableEl.querySelectorAll(".table-row");
      expect(rows[0]?.classList.contains("table-row--active")).toBe(true);
      expect(rows[1]?.classList.contains("table-row--active")).toBe(false);
    });

    it("should move the active class when navigating", () => {
      keydown(tableEl, "ArrowDown"); // → 0
      keydown(tableEl, "ArrowDown"); // → 1
      fixture.detectChanges();

      const rows = tableEl.querySelectorAll(".table-row");
      expect(rows[0]?.classList.contains("table-row--active")).toBe(false);
      expect(rows[1]?.classList.contains("table-row--active")).toBe(true);
    });
  });
});
