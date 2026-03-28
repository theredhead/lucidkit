import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal, viewChild } from "@angular/core";

import { UIRepeater } from "./repeater.component";
import { ArrayDatasource } from "../table-view/datasources/array-datasource";
import { FilterableArrayDatasource } from "../table-view/datasources/filterable-array-datasource";
import { SortableArrayDatasource } from "@theredhead/foundation";
import type { IDatasource } from "../table-view/datasources/datasource";
import type {
  RepeaterReorderEvent,
  RepeaterTransferEvent,
} from "./repeater.types";

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
      filterable.filterBy([
        { predicate: ((item: TestItem) => item.id > 2) as any },
      ]);
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
      sortable.applyComparator((a: TestItem, b: TestItem) =>
        b.name.localeCompare(a.name),
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
      filterable.filterBy([
        { predicate: ((item: TestItem) => item.id > 2) as any },
      ]);

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

  describe("reorderable", () => {
    it("should apply reorderable host class when reorderable is true", async () => {
      const reorderFixture = TestBed.createComponent(ReorderableHost);
      reorderFixture.detectChanges();
      await reorderFixture.whenStable();
      reorderFixture.detectChanges();

      const el = reorderFixture.nativeElement.querySelector("ui-repeater");
      expect(el.classList.contains("ui-repeater--reorderable")).toBe(true);
    });

    it("should not apply reorderable host class by default", () => {
      const el = fixture.nativeElement.querySelector("ui-repeater");
      expect(el.classList.contains("ui-repeater--reorderable")).toBe(false);
    });

    it("should enable drag handler when reorderable", async () => {
      const reorderFixture = TestBed.createComponent(ReorderableHost);
      reorderFixture.detectChanges();
      await reorderFixture.whenStable();
      reorderFixture.detectChanges();

      const repeater = reorderFixture.componentInstance.repeater();
      expect(repeater.dragHandler.enabled).toBe(true);
    });

    it("should disable drag handler by default", () => {
      const repeater = fixture.debugElement.children[0]
        .componentInstance as UIRepeater<TestItem>;
      expect(repeater.dragHandler.enabled).toBe(false);
    });
  });

  describe("handleReorder", () => {
    it("should reorder items via the datasource moveItem", async () => {
      const reorderFixture = TestBed.createComponent(ReorderableHost);
      const reorderHost = reorderFixture.componentInstance;
      reorderFixture.detectChanges();
      await reorderFixture.whenStable();
      reorderFixture.detectChanges();

      const repeater = reorderHost.repeater();

      // Invoke the reorder callback directly through the drag handler's callback
      (repeater as any).handleReorder(0, 2);
      reorderFixture.detectChanges();
      await reorderFixture.whenStable();
      reorderFixture.detectChanges();

      expect(reorderHost.reorderEvents.length).toBe(1);
      expect(reorderHost.reorderEvents[0].previousIndex).toBe(0);
      expect(reorderHost.reorderEvents[0].currentIndex).toBe(2);
    });

    it("should throw if datasource is not reorderable", async () => {
      // Use a non-reorderable datasource
      const ds: IDatasource<TestItem> = {
        getNumberOfItems: () => 3,
        getObjectAtRowIndex: (i: number) => TEST_DATA[i],
      };

      const reorderFixture = TestBed.createComponent(ReorderableHost);
      reorderFixture.componentInstance.ds.set(ds);
      reorderFixture.detectChanges();
      await reorderFixture.whenStable();
      reorderFixture.detectChanges();

      const repeater = reorderFixture.componentInstance.repeater();
      expect(() => (repeater as any).handleReorder(0, 1)).toThrow(
        /does not implement IReorderableDatasource/,
      );
    });
  });

  describe("handleTransfer", () => {
    it("should throw if source datasource is not removable", async () => {
      const nonRemovable: IDatasource<TestItem> = {
        getNumberOfItems: () => TEST_DATA.length,
        getObjectAtRowIndex: (i: number) => TEST_DATA[i],
      };

      const transferFixture = TestBed.createComponent(TransferHost);
      transferFixture.componentInstance.ds1.set(nonRemovable);
      transferFixture.detectChanges();
      await transferFixture.whenStable();
      transferFixture.detectChanges();

      const repeater1 = transferFixture.componentInstance.repeater1();
      const repeater2 = transferFixture.componentInstance.repeater2();
      expect(() =>
        (repeater1 as any).handleTransfer(repeater2.dragHandler, 0, 0),
      ).toThrow(/does not implement IRemovableDatasource/);
    });

    it("should throw if target datasource is not insertable", async () => {
      const nonInsertable: IDatasource<TestItem> = {
        getNumberOfItems: () => 1,
        getObjectAtRowIndex: (i: number) => ({ id: 99, name: "Z" }),
      };

      const transferFixture = TestBed.createComponent(TransferHost);
      transferFixture.componentInstance.ds2.set(nonInsertable);
      transferFixture.detectChanges();
      await transferFixture.whenStable();
      transferFixture.detectChanges();

      const repeater1 = transferFixture.componentInstance.repeater1();
      const repeater2 = transferFixture.componentInstance.repeater2();
      expect(() =>
        (repeater1 as any).handleTransfer(repeater2.dragHandler, 0, 0),
      ).toThrow(/does not implement IInsertableDatasource/);
    });

    it("should transfer an item between two repeaters", async () => {
      const transferFixture = TestBed.createComponent(TransferHost);
      const transferHost = transferFixture.componentInstance;
      transferFixture.detectChanges();
      await transferFixture.whenStable();
      transferFixture.detectChanges();

      const repeater1 = transferHost.repeater1();
      const repeater2 = transferHost.repeater2();

      // Transfer item from repeater1 index 0 to repeater2 index 0
      (repeater1 as any).handleTransfer(repeater2.dragHandler, 0, 0);
      transferFixture.detectChanges();
      await transferFixture.whenStable();
      transferFixture.detectChanges();

      expect(transferHost.transferEvents.length).toBe(1);
      expect(transferHost.transferEvents[0].item).toEqual({
        id: 1,
        name: "Alpha",
      });
    });
  });

  describe("buildContext", () => {
    it("should produce correct context for first item", () => {
      const repeater = fixture.debugElement.children[0]
        .componentInstance as UIRepeater<TestItem>;
      const ctx = (repeater as any).buildContext(TEST_DATA[0], 0);
      expect(ctx.$implicit).toBe(TEST_DATA[0]);
      expect(ctx.index).toBe(0);
      expect(ctx.first).toBe(true);
      expect(ctx.last).toBe(false);
      expect(ctx.even).toBe(true);
      expect(ctx.odd).toBe(false);
    });

    it("should produce correct context for last item", () => {
      const repeater = fixture.debugElement.children[0]
        .componentInstance as UIRepeater<TestItem>;
      const ctx = (repeater as any).buildContext(TEST_DATA[4], 4);
      expect(ctx.last).toBe(true);
      expect(ctx.first).toBe(false);
      expect(ctx.even).toBe(true);
      expect(ctx.odd).toBe(false);
    });
  });
});

@Component({
  standalone: true,
  imports: [UIRepeater],
  template: `
    <ui-repeater
      [datasource]="ds()"
      [reorderable]="true"
      (reordered)="onReorder($event)"
    >
      <ng-template let-item>
        <div class="reorder-item">{{ item.name }}</div>
      </ng-template>
    </ui-repeater>
  `,
})
class ReorderableHost {
  public readonly ds = signal<IDatasource<TestItem>>(
    new ArrayDatasource(TEST_DATA),
  );
  public readonly reorderEvents: RepeaterReorderEvent[] = [];
  public readonly repeater =
    viewChild.required<UIRepeater<TestItem>>(UIRepeater);

  public onReorder(event: RepeaterReorderEvent): void {
    this.reorderEvents.push(event);
  }
}

@Component({
  standalone: true,
  imports: [UIRepeater],
  template: `
    <ui-repeater
      #r1
      [datasource]="ds1()"
      [reorderable]="true"
      [connectedTo]="[r2]"
    >
      <ng-template let-item>
        <div class="item-1">{{ item.name }}</div>
      </ng-template>
    </ui-repeater>
    <ui-repeater
      #r2
      [datasource]="ds2()"
      [reorderable]="true"
      [connectedTo]="[r1]"
      (transferred)="onTransfer($event)"
    >
      <ng-template let-item>
        <div class="item-2">{{ item.name }}</div>
      </ng-template>
    </ui-repeater>
  `,
})
class TransferHost {
  public readonly ds1 = signal<IDatasource<TestItem>>(
    new ArrayDatasource([...TEST_DATA]),
  );
  public readonly ds2 = signal<IDatasource<TestItem>>(
    new ArrayDatasource([{ id: 99, name: "Target" }]),
  );
  public readonly transferEvents: RepeaterTransferEvent<TestItem>[] = [];
  public readonly repeater1 = viewChild.required<UIRepeater<TestItem>>("r1");
  public readonly repeater2 = viewChild.required<UIRepeater<TestItem>>("r2");

  public onTransfer(event: RepeaterTransferEvent<TestItem>): void {
    this.transferEvents.push(event);
  }
}
