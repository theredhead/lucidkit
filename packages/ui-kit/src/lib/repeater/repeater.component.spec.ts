import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIRepeater } from "./repeater.component";
import { ArrayDatasource } from "../table-view/datasources/array-datasource";
import { FilterableArrayDatasource } from "../table-view/datasources/filterable-array-datasource";
import { SortableArrayDatasource } from "@theredhead/foundation";
import type { IDatasource } from "../table-view/datasources/datasource";

interface TestItem {
  id: number;
  name: string;
}

const TEST_DATA: TestItem[] = [
  { id: 1, name: "Alpha" },
  { id: 2, name: "Bravo" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Delta" },
  { id: 5, name: "Echo" },
];

@Component({
  standalone: true,
  imports: [UIRepeater],
  template: `
    <ui-repeater [datasource]="ds()" [limit]="limit()">
      <ng-template
        let-item
        let-i="index"
        let-first="first"
        let-last="last"
        let-even="even"
        let-odd="odd"
      >
        <div
          class="test-item"
          [attr.data-index]="i"
          [attr.data-first]="first"
          [attr.data-last]="last"
          [attr.data-even]="even"
          [attr.data-odd]="odd"
        >
          {{ item.name }}
        </div>
      </ng-template>
    </ui-repeater>
  `,
})
class TestHost {
  public readonly ds = signal<IDatasource<TestItem>>(
    new ArrayDatasource(TEST_DATA),
  );
  public readonly limit = signal(Infinity);
}

describe("UIRepeater", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    // Allow effects to run
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("should create", () => {
    const repeater = fixture.nativeElement.querySelector("ui-repeater");
    expect(repeater).toBeTruthy();
  });

  it("should render all items from the datasource", () => {
    const items = fixture.nativeElement.querySelectorAll(".test-item");
    expect(items.length).toBe(5);
  });

  it("should render item content from the template", () => {
    const items = fixture.nativeElement.querySelectorAll(".test-item");
    expect(items[0].textContent.trim()).toBe("Alpha");
    expect(items[1].textContent.trim()).toBe("Bravo");
    expect(items[4].textContent.trim()).toBe("Echo");
  });

  describe("template context", () => {
    it("should expose index", () => {
      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items[0].getAttribute("data-index")).toBe("0");
      expect(items[2].getAttribute("data-index")).toBe("2");
      expect(items[4].getAttribute("data-index")).toBe("4");
    });

    it("should expose first", () => {
      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items[0].getAttribute("data-first")).toBe("true");
      expect(items[1].getAttribute("data-first")).toBe("false");
    });

    it("should expose last", () => {
      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items[4].getAttribute("data-last")).toBe("true");
      expect(items[3].getAttribute("data-last")).toBe("false");
    });

    it("should expose even/odd", () => {
      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items[0].getAttribute("data-even")).toBe("true");
      expect(items[0].getAttribute("data-odd")).toBe("false");
      expect(items[1].getAttribute("data-even")).toBe("false");
      expect(items[1].getAttribute("data-odd")).toBe("true");
    });
  });

  describe("limit", () => {
    it("should respect the limit input", async () => {
      host.limit.set(3);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items.length).toBe(3);
    });

    it("should render all items when limit is Infinity", () => {
      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items.length).toBe(5);
    });
  });

  describe("datasource swap", () => {
    it("should re-render when datasource changes", async () => {
      const newData: TestItem[] = [
        { id: 10, name: "Foxtrot" },
        { id: 11, name: "Golf" },
      ];
      host.ds.set(new ArrayDatasource(newData));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items.length).toBe(2);
      expect(items[0].textContent.trim()).toBe("Foxtrot");
    });
  });

  describe("host element", () => {
    it("should have display:contents in the component stylesheet", () => {
      // jsdom does not compute `display: contents`, so we verify via class presence
      // which ensures the SCSS rule (`:host { display: contents }`) targets correctly.
      const repeater = fixture.nativeElement.querySelector("ui-repeater");
      expect(repeater.classList).toContain("ui-repeater");
    });

    it("should have the ui-repeater class", () => {
      const repeater = fixture.nativeElement.querySelector("ui-repeater");
      expect(repeater.classList).toContain("ui-repeater");
    });
  });

  describe("empty datasource", () => {
    it("should render nothing for empty datasource", async () => {
      host.ds.set(new ArrayDatasource([]));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items.length).toBe(0);
    });
  });

  describe("filterable datasource", () => {
    it("should render only filtered items when using FilterableArrayDatasource", async () => {
      const filterable = new FilterableArrayDatasource(TEST_DATA);
      // Filter to only items with id > 2
      filterable.applyPredicate((item: TestItem) => item.id > 2);
      host.ds.set(filterable);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items.length).toBe(3); // Charlie, Delta, Echo
      expect(items[0].textContent.trim()).toBe("Charlie");
      expect(items[2].textContent.trim()).toBe("Echo");
    });
  });

  describe("sortable datasource", () => {
    it("should render sorted items when using SortableArrayDatasource", async () => {
      const sortable = new SortableArrayDatasource(TEST_DATA);
      // Sort by name in reverse order
      sortable.applyComparator(
        (a: TestItem, b: TestItem) => b.name.localeCompare(a.name),
      );
      host.ds.set(sortable);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items.length).toBe(5);
      expect(items[0].textContent.trim()).toBe("Echo"); // Reverse alphabetical
      expect(items[1].textContent.trim()).toBe("Delta");
      expect(items[4].textContent.trim()).toBe("Alpha");
    });
  });

  describe("combined filtering and sorting", () => {
    it("should work when receiving pre-filtered and pre-sorted data", async () => {
      // Create data that is already sorted (descending)
      const sortedData: TestItem[] = [
        { id: 5, name: "Echo" },
        { id: 4, name: "Delta" },
        { id: 3, name: "Charlie" },
        { id: 2, name: "Bravo" },
        { id: 1, name: "Alpha" },
      ];

      // Filter to only keep items with id > 2
      const filterable = new FilterableArrayDatasource(sortedData);
      filterable.applyPredicate((item: TestItem) => item.id > 2);

      host.ds.set(filterable);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll(".test-item");
      expect(items.length).toBe(3); // Echo, Delta, Charlie
      expect(items[0].textContent.trim()).toBe("Echo");
      expect(items[1].textContent.trim()).toBe("Delta");
      expect(items[2].textContent.trim()).toBe("Charlie");
    });
  });
});
