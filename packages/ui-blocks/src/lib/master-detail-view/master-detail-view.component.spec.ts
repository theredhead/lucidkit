import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  ArrayDatasource,
  ArrayTreeDatasource,
  DatasourceAdapter,
  UITextColumn,
  type ITreeDatasource,
  type TreeNode,
} from "@theredhead/ui-kit";

import { UIMasterDetailView } from "./master-detail-view.component";

interface Person {
  name: string;
  email: string;
  role: string;
}

const PEOPLE: Person[] = [
  { name: "Alice", email: "alice@example.com", role: "Admin" },
  { name: "Bob", email: "bob@example.com", role: "Editor" },
  { name: "Charlie", email: "charlie@example.com", role: "Viewer" },
];

@Component({
  standalone: true,
  imports: [UIMasterDetailView, UITextColumn],
  template: `
    <ui-master-detail-view
      [data]="data()"
      [title]="title()"
      [placeholder]="placeholder()"
      [showFilter]="showFilter()"
      [filterExpanded]="filterExpanded()"
      (selectedChange)="onSelected($event)"
    >
      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="email" headerText="Email" />

      <ng-template #detail let-object>
        <div class="test-detail">
          <h3 class="test-detail-name">{{ object.name }}</h3>
          <p class="test-detail-email">{{ object.email }}</p>
        </div>
      </ng-template>

      <ng-template #filter>
        <div class="test-filter-content">Filter controls here</div>
      </ng-template>
    </ui-master-detail-view>
  `,
})
class TestHost {
  public readonly data = signal<Person[]>(PEOPLE);
  public readonly title = signal("Team");
  public readonly placeholder = signal("Select a person");
  public readonly showFilter = signal(false);
  public readonly filterExpanded = signal(true);
  public readonly selected = signal<Person | undefined>(undefined);

  public onSelected(item: Person | undefined): void {
    this.selected.set(item);
  }
}

describe("UIMasterDetailView", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let el: HTMLElement;

  /**
   * Performs change detection and flushes Angular effects so that
   * the table-view's internal effect (which populates resolvedRows)
   * has time to run and be reflected in the DOM.
   */
  function detectAndFlush(): void {
    fixture.detectChanges();
    TestBed.flushEffects();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    detectAndFlush();
  });

  it("should create", () => {
    const mdv = el.querySelector("ui-master-detail-view");
    expect(mdv).toBeTruthy();
  });

  it("should have the host class", () => {
    const mdv = el.querySelector("ui-master-detail-view");
    expect(mdv!.classList).toContain("ui-master-detail-view");
  });

  // ── Layout ──────────────────────────────────────────────────────

  describe("layout", () => {
    it("should have a list panel", () => {
      expect(el.querySelector(".mdv-list-panel")).toBeTruthy();
    });

    it("should have a detail panel", () => {
      expect(el.querySelector(".mdv-detail-panel")).toBeTruthy();
    });

    it("should display the title", () => {
      const title = el.querySelector(".mdv-title");
      expect(title?.textContent?.trim()).toBe("Team");
    });

    it("should update the title", () => {
      host.title.set("Staff");
      fixture.detectChanges();
      expect(el.querySelector(".mdv-title")?.textContent?.trim()).toBe("Staff");
    });
  });

  // ── Placeholder ─────────────────────────────────────────────────

  describe("placeholder", () => {
    it("should show placeholder when no item is selected", () => {
      const placeholder = el.querySelector(".mdv-placeholder p");
      expect(placeholder).toBeTruthy();
      expect(placeholder?.textContent?.trim()).toBe("Select a person");
    });

    it("should hide placeholder after selection", () => {
      // Programmatically select (CDK virtual scroll doesn't render in jsdom)
      const mdv = fixture.debugElement.query(
        (de) => de.componentInstance instanceof UIMasterDetailView,
      ).componentInstance as UIMasterDetailView<Person>;
      mdv.selectionModel.select(PEOPLE[0]);
      detectAndFlush();
      expect(el.querySelector(".mdv-placeholder")).toBeNull();
    });
  });

  // ── Table integration ───────────────────────────────────────────

  describe("table", () => {
    it("should render a table-view", () => {
      expect(el.querySelector("ui-table-view")).toBeTruthy();
    });

    it("should discover projected columns", () => {
      const mdv = fixture.debugElement.query(
        (de) => de.componentInstance instanceof UIMasterDetailView,
      );
      expect(mdv).toBeTruthy();
      const mdvInstance = mdv.componentInstance as UIMasterDetailView<Person>;
      expect(mdvInstance.columns().length).toBe(2);
    });

    it("should forward columns to the table-view", () => {
      const tv = fixture.debugElement.query(
        (de) => de.nativeElement.localName === "ui-table-view",
      );
      expect(tv).toBeTruthy();
      const tvInstance = tv.componentInstance;
      expect(tvInstance.externalColumns().length).toBe(2);
      expect(tvInstance.resolvedColumns().length).toBe(2);
    });

    it("should provide data to the table-view datasource", () => {
      // CDK virtual scrolling doesn't render rows in jsdom (no viewport size).
      // Instead verify the datasource exposes the correct number of items.
      const tv = fixture.debugElement.query(
        (de) => de.nativeElement.localName === "ui-table-view",
      );
      const ds: DatasourceAdapter<Person> = tv.componentInstance.datasource();
      expect(ds.totalItems()).toBe(3);
      expect(ds.visibleWindow().length).toBe(3);
    });

    it("should not show pagination", () => {
      expect(el.querySelector("ui-table-footer")).toBeNull();
    });

    it("should not show row index column", () => {
      expect(el.querySelector(".tv-row-index")).toBeNull();
    });
  });

  // ── Selection & detail ──────────────────────────────────────────

  describe("selection", () => {
    it("should show detail template after selecting an item", () => {
      const mdv = fixture.debugElement.query(
        (de) => de.componentInstance instanceof UIMasterDetailView,
      ).componentInstance as UIMasterDetailView<Person>;
      mdv.selectionModel.select(PEOPLE[0]);
      detectAndFlush();

      const detail = el.querySelector(".test-detail");
      expect(detail).toBeTruthy();
      expect(el.querySelector(".test-detail-name")?.textContent?.trim()).toBe(
        "Alice",
      );
      expect(el.querySelector(".test-detail-email")?.textContent?.trim()).toBe(
        "alice@example.com",
      );
    });

    it("should emit selectedChange with the selected item", () => {
      const mdv = fixture.debugElement.query(
        (de) => de.componentInstance instanceof UIMasterDetailView,
      ).componentInstance as UIMasterDetailView<Person>;
      mdv.selectionModel.select(PEOPLE[0]);
      detectAndFlush();

      expect(host.selected()?.name).toBe("Alice");
    });

    it("should update detail when different item is selected", () => {
      const mdv = fixture.debugElement.query(
        (de) => de.componentInstance instanceof UIMasterDetailView,
      ).componentInstance as UIMasterDetailView<Person>;
      mdv.selectionModel.select(PEOPLE[1]);
      detectAndFlush();

      expect(el.querySelector(".test-detail-name")?.textContent?.trim()).toBe(
        "Bob",
      );
    });
  });

  // ── Filter ──────────────────────────────────────────────────────

  describe("filter", () => {
    it("should not show filter by default", () => {
      expect(el.querySelector(".mdv-filter-bar")).toBeNull();
    });

    it("should show filter bar when showFilter is true", () => {
      host.showFilter.set(true);
      fixture.detectChanges();
      expect(el.querySelector(".mdv-filter-bar")).toBeTruthy();
    });

    it("should show filter content when expanded", () => {
      host.showFilter.set(true);
      fixture.detectChanges();
      expect(el.querySelector(".test-filter-content")).toBeTruthy();
    });

    it("should hide filter content when collapsed", () => {
      host.showFilter.set(true);
      host.filterExpanded.set(false);
      fixture.detectChanges();
      expect(el.querySelector(".test-filter-content")).toBeNull();
    });

    it("should toggle filter on button click", () => {
      host.showFilter.set(true);
      fixture.detectChanges();

      const toggle = el.querySelector(
        ".mdv-filter-toggle",
      ) as HTMLButtonElement;
      expect(el.querySelector(".test-filter-content")).toBeTruthy();

      toggle.click();
      fixture.detectChanges();
      expect(el.querySelector(".test-filter-content")).toBeNull();

      toggle.click();
      fixture.detectChanges();
      expect(el.querySelector(".test-filter-content")).toBeTruthy();
    });

    it("should have correct aria-expanded attribute", () => {
      host.showFilter.set(true);
      fixture.detectChanges();

      const toggle = el.querySelector(".mdv-filter-toggle");
      expect(toggle?.getAttribute("aria-expanded")).toBe("true");

      (toggle as HTMLButtonElement)?.click();
      fixture.detectChanges();
      expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    });
  });

  // ── Defaults ────────────────────────────────────────────────────

  describe("defaults", () => {
    it('should default title to "Items"', () => {
      // Create a bare instance
      const bare = TestBed.createComponent(UIMasterDetailView);
      bare.detectChanges();
      expect(bare.componentInstance.title()).toBe("Items");
    });

    it("should default showFilter to undefined (auto-detect)", () => {
      const bare = TestBed.createComponent(UIMasterDetailView);
      bare.detectChanges();
      expect(bare.componentInstance.showFilter()).toBeUndefined();
    });

    it("should default filterExpanded to true", () => {
      const bare = TestBed.createComponent(UIMasterDetailView);
      bare.detectChanges();
      expect(bare.componentInstance.filterExpanded()).toBe(true);
    });
  });

  // ── Datasource input ───────────────────────────────────────────

  describe("datasource input", () => {
    it("should accept an explicit datasource adapter", () => {
      @Component({
        standalone: true,
        imports: [UIMasterDetailView, UITextColumn],
        template: `
          <ui-master-detail-view [datasource]="ds">
            <ui-text-column key="name" headerText="Name" />
            <ng-template #detail let-object>
              <span class="ds-detail">{{ object.name }}</span>
            </ng-template>
          </ui-master-detail-view>
        `,
      })
      class DsHost {
        public readonly ds = new DatasourceAdapter<Person>(
          new ArrayDatasource(PEOPLE),
          100,
        );
      }

      const dsFixture = TestBed.createComponent(DsHost);
      dsFixture.detectChanges();
      TestBed.flushEffects();
      dsFixture.detectChanges();
      // Check via the datasource API (CDK virtual scroll has no viewport in jsdom)
      const tv = dsFixture.debugElement.query(
        (de) => de.nativeElement.localName === "ui-table-view",
      );
      const ds: DatasourceAdapter<Person> = tv.componentInstance.datasource();
      expect(ds.totalItems()).toBe(3);
      expect(ds.visibleWindow().length).toBe(3);
    });
  });
});

// ── Tree mode ─────────────────────────────────────────────────────

interface Department {
  name: string;
}

const TREE_DATA: TreeNode<Department>[] = [
  {
    id: "eng",
    data: { name: "Engineering" },
    children: [
      { id: "eng-fe", data: { name: "Frontend" } },
      { id: "eng-be", data: { name: "Backend" } },
    ],
  },
  {
    id: "design",
    data: { name: "Design" },
    children: [{ id: "design-ux", data: { name: "UX" } }],
  },
  {
    id: "hr",
    data: { name: "HR" },
  },
];

@Component({
  standalone: true,
  imports: [UIMasterDetailView],
  template: `
    <ui-master-detail-view
      [treeDatasource]="treeDatasource()"
      [treeDisplayWith]="displayWith"
      title="Departments"
      placeholder="Select a department"
      (selectedChange)="onSelected($event)"
    >
      <ng-template #detail let-dept>
        <div class="test-tree-detail">
          <h3 class="test-tree-detail-name">{{ dept.name }}</h3>
        </div>
      </ng-template>
    </ui-master-detail-view>
  `,
})
class TreeTestHost {
  public readonly treeDatasource = signal<ITreeDatasource<Department>>(
    new ArrayTreeDatasource(TREE_DATA),
  );
  public readonly displayWith = (data: Department): string => data.name;
  public readonly selected = signal<Department | undefined>(undefined);

  public onSelected(item: Department | undefined): void {
    this.selected.set(item);
  }
}

describe("UIMasterDetailView (tree mode)", () => {
  let treeFixture: ComponentFixture<TreeTestHost>;
  let treeHost: TreeTestHost;
  let treeEl: HTMLElement;

  function detectAndFlushTree(): void {
    treeFixture.detectChanges();
    TestBed.flushEffects();
    treeFixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).compileComponents();
    treeFixture = TestBed.createComponent(TreeTestHost);
    treeHost = treeFixture.componentInstance;
    treeEl = treeFixture.nativeElement;
    detectAndFlushTree();
  });

  it("should render a tree-view instead of a table-view", () => {
    expect(treeEl.querySelector("ui-tree-view")).toBeTruthy();
    expect(treeEl.querySelector("ui-table-view")).toBeNull();
  });

  it("should render root-level tree nodes", () => {
    const nodes = treeEl.querySelectorAll("ui-tree-view > ui-tree-node");
    expect(nodes.length).toBe(3);
  });

  it("should display node labels using treeDisplayWith", () => {
    const label = treeEl.querySelector(".tv-node-label");
    expect(label?.textContent?.trim()).toBe("Engineering");
  });

  it("should show the placeholder when no node is selected", () => {
    expect(treeEl.querySelector(".mdv-placeholder")).toBeTruthy();
    expect(
      treeEl.querySelector(".mdv-placeholder p")?.textContent?.trim(),
    ).toBe("Select a department");
  });

  it("should show detail after selecting a tree node", () => {
    const row = treeEl.querySelector(".tv-node-row") as HTMLElement;
    row.click();
    detectAndFlushTree();

    expect(treeEl.querySelector(".test-tree-detail")).toBeTruthy();
    expect(
      treeEl.querySelector(".test-tree-detail-name")?.textContent?.trim(),
    ).toBe("Engineering");
  });

  it("should emit selectedChange with the node data", () => {
    const row = treeEl.querySelector(".tv-node-row") as HTMLElement;
    row.click();
    detectAndFlushTree();

    expect(treeHost.selected()?.name).toBe("Engineering");
  });

  it("should update detail when a different node is selected", () => {
    const rows = treeEl.querySelectorAll(
      "ui-tree-view > ui-tree-node > .tv-node-row",
    );
    (rows[2] as HTMLElement).click(); // HR
    detectAndFlushTree();

    expect(
      treeEl.querySelector(".test-tree-detail-name")?.textContent?.trim(),
    ).toBe("HR");
  });

  it("should display the title", () => {
    expect(treeEl.querySelector(".mdv-title")?.textContent?.trim()).toBe(
      "Departments",
    );
  });

  it("should use the tree wrapper class", () => {
    expect(treeEl.querySelector(".mdv-tree-wrapper")).toBeTruthy();
    expect(treeEl.querySelector(".mdv-table-wrapper")).toBeNull();
  });
});
