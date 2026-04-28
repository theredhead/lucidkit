import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FilterableArrayDatasource, UITextColumn } from "@theredhead/lucid-kit";

import { UISearchView } from "./search-view.component";

interface Product {
  name: string;
  category: string;
  price: number;
}

const PRODUCTS: Product[] = [
  { name: "Widget A", category: "Hardware", price: 29.99 },
  { name: "Widget B", category: "Software", price: 49.99 },
  { name: "Widget C", category: "Hardware", price: 19.99 },
  { name: "Gadget X", category: "Software", price: 99.99 },
  { name: "Gadget Y", category: "Hardware", price: 59.99 },
];

@Component({
  standalone: true,
  imports: [UISearchView, UITextColumn],
  template: `
    <ui-search-view
      [datasource]="ds()"
      [title]="title()"
      [placeholder]="placeholder()"
      [showFilter]="showFilter()"
      [filterExpanded]="filterExpanded()"
      [filterModeLocked]="filterModeLocked()"
      [showPagination]="showPagination()"
      [layout]="layout()"
    >
      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="category" headerText="Category" />
    </ui-search-view>
  `,
})
class TestHost {
  public readonly ds = signal<FilterableArrayDatasource<Product>>(
    new FilterableArrayDatasource(PRODUCTS),
  );
  public readonly title = signal("Products");
  public readonly placeholder = signal("No products found");
  public readonly showFilter = signal<boolean | undefined>(undefined);
  public readonly filterExpanded = signal(true);
  public readonly filterModeLocked = signal(false);
  public readonly showPagination = signal(true);
  public readonly layout = signal<"table" | "custom">("table");
}

@Component({
  standalone: true,
  imports: [UISearchView],
  template: `
    <ui-search-view [datasource]="ds()" layout="custom" [showFilter]="false">
      <ng-template #results let-items>
        <div class="custom-grid">
          @for (item of items; track item.name) {
            <div class="custom-card">{{ item.name }}</div>
          }
        </div>
      </ng-template>
    </ui-search-view>
  `,
})
class CustomLayoutHost {
  public readonly ds = signal<FilterableArrayDatasource<Product>>(
    new FilterableArrayDatasource(PRODUCTS),
  );
}

function detectAndFlush(fixture: ComponentFixture<unknown>): void {
  fixture.detectChanges();
  TestBed.flushEffects();
  fixture.detectChanges();
}

describe("UISearchView", () => {
  describe("table layout", () => {
    let fixture: ComponentFixture<TestHost>;
    let host: TestHost;
    let el: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHost],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHost);
      host = fixture.componentInstance;
      detectAndFlush(fixture);
      el = fixture.nativeElement;
    });

    it("should create", () => {
      const view = el.querySelector("ui-search-view");
      expect(view).toBeTruthy();
    });

    describe("header", () => {
      it("should display the title", () => {
        const title = el.querySelector(".sv-title");
        expect(title?.textContent?.trim()).toBe("Products");
      });

      it("should display the item count", () => {
        const count = el.querySelector(".sv-count");
        expect(count?.textContent?.trim()).toBe("5 items");
      });
    });

    describe("defaults", () => {
      it("should default layout to table", () => {
        const table = el.querySelector("ui-table-view");
        expect(table).toBeTruthy();
      });

      it("should auto-detect filter visibility from FilterableArrayDatasource", () => {
        const filterBar = el.querySelector(".sv-filter-bar");
        expect(filterBar).toBeTruthy();
      });

      it("should show pagination by default", () => {
        const pagination = el.querySelector("ui-pagination");
        expect(pagination).toBeTruthy();
      });
    });

    describe("filter", () => {
      it("should hide filter when showFilter is false", () => {
        host.showFilter.set(false);
        detectAndFlush(fixture);

        const filterBar = el.querySelector(".sv-filter-bar");
        expect(filterBar).toBeFalsy();
      });

      it("should show filter when showFilter is true", () => {
        host.showFilter.set(true);
        detectAndFlush(fixture);

        const filterBar = el.querySelector(".sv-filter-bar");
        expect(filterBar).toBeTruthy();
      });

      it("should toggle filter panel", () => {
        const toggle = el.querySelector<HTMLButtonElement>(".sv-filter-toggle");
        expect(toggle).toBeTruthy();

        toggle!.click();
        detectAndFlush(fixture);

        const content = el.querySelector(".sv-filter-content");
        expect(content).toBeFalsy();

        toggle!.click();
        detectAndFlush(fixture);

        const contentAgain = el.querySelector(".sv-filter-content");
        expect(contentAgain).toBeTruthy();
      });

      it("should hide toggle when filterModeLocked is true", () => {
        host.filterModeLocked.set(true);
        detectAndFlush(fixture);

        const toggle = el.querySelector(".sv-filter-toggle");
        expect(toggle).toBeFalsy();
      });
    });

    describe("pagination", () => {
      it("should hide pagination when showPagination is false", () => {
        host.showPagination.set(false);
        detectAndFlush(fixture);

        const pagination = el.querySelector("ui-pagination");
        expect(pagination).toBeFalsy();
      });
    });

    describe("empty state", () => {
      it("should show table outline and placeholder when no results", () => {
        host.ds.set(new FilterableArrayDatasource<Product>([]));
        detectAndFlush(fixture);

        const table = el.querySelector("ui-table-view");
        expect(table).toBeTruthy();

        const empty = el.querySelector(".sv-empty p");
        expect(empty?.textContent?.trim()).toBe("No products found");
      });
    });
  });

  describe("custom layout", () => {
    let fixture: ComponentFixture<CustomLayoutHost>;
    let el: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CustomLayoutHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CustomLayoutHost);
      detectAndFlush(fixture);
      el = fixture.nativeElement;
    });

    it("should render the custom results template", () => {
      const grid = el.querySelector(".custom-grid");
      expect(grid).toBeTruthy();
    });

    it("should render all items in custom template", () => {
      const cards = el.querySelectorAll(".custom-card");
      expect(cards.length).toBe(5);
    });
  });

  describe("saved searches", () => {
    let fixture: ComponentFixture<SavedSearchHost>;
    let host: SavedSearchHost;
    let el: HTMLElement;

    beforeEach(async () => {
      localStorage.clear();
      await TestBed.configureTestingModule({
        imports: [SavedSearchHost],
      }).compileComponents();

      fixture = TestBed.createComponent(SavedSearchHost);
      host = fixture.componentInstance;
      detectAndFlush(fixture);
      el = fixture.nativeElement;
    });

    afterEach(() => {
      localStorage.clear();
    });

    it("should show saved search controls when storageKey is set", () => {
      const searchView = fixture.debugElement.children[0]
        .componentInstance as UISearchView<Product>;
      expect(searchView.storageKey()).toBe("test-searches");
    });

    it("should save and load a search", () => {
      const searchView = fixture.debugElement.children[0]
        .componentInstance as UISearchView<Product>;

      searchView.saveNewSearch("My Filter");
      detectAndFlush(fixture);

      const list = (searchView as any).savedSearches();
      expect(list.length).toBe(1);
      expect(list[0].name).toBe("My Filter");

      const savedId = list[0].id;
      searchView.loadSavedSearch(savedId);
      detectAndFlush(fixture);

      expect((searchView as any).selectedSearchId()).toBe(savedId);
    });

    it("should delete a saved search", () => {
      const searchView = fixture.debugElement.children[0]
        .componentInstance as UISearchView<Product>;

      searchView.saveNewSearch("Temp Filter");
      detectAndFlush(fixture);

      const savedId = (searchView as any).savedSearches()[0].id;
      searchView.deleteSavedSearch(savedId);
      detectAndFlush(fixture);

      expect((searchView as any).savedSearches().length).toBe(0);
      expect((searchView as any).selectedSearchId()).toBe("");
    });

    it("should not save with empty name", () => {
      const searchView = fixture.debugElement.children[0]
        .componentInstance as UISearchView<Product>;

      searchView.saveNewSearch("   ");
      detectAndFlush(fixture);

      expect((searchView as any).savedSearches().length).toBe(0);
    });

    it("should load empty string to reset selection", () => {
      const searchView = fixture.debugElement.children[0]
        .componentInstance as UISearchView<Product>;

      searchView.saveNewSearch("Test");
      detectAndFlush(fixture);

      const savedId = (searchView as any).savedSearches()[0].id;
      searchView.loadSavedSearch(savedId);
      detectAndFlush(fixture);

      searchView.loadSavedSearch("");
      expect((searchView as any).selectedSearchId()).toBe("");
    });
  });

  describe("filter expression change", () => {
    let fixture: ComponentFixture<TestHost>;
    let host: TestHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHost],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHost);
      host = fixture.componentInstance;
      detectAndFlush(fixture);
    });

    it("should update total items after filter application", () => {
      const searchView = fixture.debugElement.children[0]
        .componentInstance as UISearchView<Product>;

      // Apply a filter via the public method
      const ds = host.ds() as FilterableArrayDatasource<Product>;
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "price",
            operator: "greaterThan",
            value: "50",
          },
        ],
      });
      detectAndFlush(fixture);

      // Count should update
      expect(ds.getNumberOfItems()).toBe(2);
    });

    it("should toggle filter panel via toggleFilter", () => {
      const searchView = fixture.debugElement.children[0]
        .componentInstance as UISearchView<Product>;
      const initial = (searchView as any).filterCollapsed();

      searchView.toggleFilter();
      expect((searchView as any).filterCollapsed()).toBe(!initial);

      searchView.toggleFilter();
      expect((searchView as any).filterCollapsed()).toBe(initial);
    });
  });
});

@Component({
  standalone: true,
  imports: [UISearchView, UITextColumn],
  template: `
    <ui-search-view
      [datasource]="ds()"
      storageKey="test-searches"
      [showFilter]="true"
      [filterExpanded]="true"
    >
      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="category" headerText="Category" />
    </ui-search-view>
  `,
})
class SavedSearchHost {
  public readonly ds = signal<FilterableArrayDatasource<Product>>(
    new FilterableArrayDatasource(PRODUCTS),
  );
}
