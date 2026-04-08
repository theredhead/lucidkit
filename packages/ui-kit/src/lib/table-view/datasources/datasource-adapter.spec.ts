import { DatasourceAdapter } from "./datasource-adapter";
import { ArrayDatasource } from "./array-datasource";
import type { IDatasource, IActiveDatasource, RowResult } from "./datasource";
import { Emitter } from "./datasource";
import type {
  RowChangedNotification,
  RowRangeChangedNotification,
} from "./datasource";

describe("DatasourceAdapter", () => {
  const sampleData = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  describe("constructor", () => {
    it("should create with default page size", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds);

      expect(adapter).toBeTruthy();
      expect(adapter.pageIndex()).toBe(0);
    });

    it("should accept a custom initial page size", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      expect(adapter.pageSize()).toBe(10);
    });

    it("should throw RangeError for zero page size", () => {
      const ds = new ArrayDatasource(sampleData);
      expect(() => new DatasourceAdapter(ds, 0)).toThrow(RangeError);
    });

    it("should throw RangeError for negative page size", () => {
      const ds = new ArrayDatasource(sampleData);
      expect(() => new DatasourceAdapter(ds, -5)).toThrow(RangeError);
    });

    it("should throw RangeError for non-finite page size", () => {
      const ds = new ArrayDatasource(sampleData);
      expect(() => new DatasourceAdapter(ds, Infinity)).toThrow(RangeError);
      expect(() => new DatasourceAdapter(ds, NaN)).toThrow(RangeError);
    });
  });

  describe("totalItems", () => {
    it("should set totalItems synchronously for ArrayDatasource", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      expect(adapter.totalItems()).toBe(25);
    });

    it("should set totalItems asynchronously for async datasources", async () => {
      const asyncDs: IDatasource<string> = {
        getNumberOfItems: () => Promise.resolve(42),
        getObjectAtRowIndex: (i: number): RowResult<string> => `row-${i}`,
      };
      const adapter = new DatasourceAdapter(asyncDs, 10);

      // Initially null before the promise resolves
      expect(adapter.totalItems()).toBeNull();

      // Wait for the promise to resolve
      await new Promise((r) => setTimeout(r, 0));
      expect(adapter.totalItems()).toBe(42);
    });
  });

  describe("visibleRange", () => {
    it("should compute range from pageIndex and pageSize", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      expect(adapter.visibleRange()).toEqual({ start: 0, length: 10 });
    });

    it("should update when pageIndex changes", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      adapter.pageIndex.set(1);
      expect(adapter.visibleRange()).toEqual({ start: 10, length: 10 });

      adapter.pageIndex.set(2);
      expect(adapter.visibleRange()).toEqual({ start: 20, length: 10 });
    });

    it("should update when pageSize changes", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      adapter.pageSize.set(5);
      expect(adapter.visibleRange()).toEqual({ start: 0, length: 5 });
    });
  });

  describe("visibleWindow", () => {
    it("should return the first page of items", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      const window = adapter.visibleWindow();
      expect(window.length).toBe(10);
      expect(window[0]).toEqual({ id: 1, name: "Item 1" });
      expect(window[9]).toEqual({ id: 10, name: "Item 10" });
    });

    it("should return items for the current page", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      adapter.pageIndex.set(1);
      const window = adapter.visibleWindow();
      expect(window.length).toBe(10);
      expect(window[0]).toEqual({ id: 11, name: "Item 11" });
    });

    it("should clamp to totalItems on the last page", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      adapter.pageIndex.set(2);
      const window = adapter.visibleWindow();
      // 25 total, page 2 starts at 20 → only 5 items left
      expect(window.length).toBe(5);
      expect(window[0]).toEqual({ id: 21, name: "Item 21" });
      expect(window[4]).toEqual({ id: 25, name: "Item 25" });
    });
  });

  describe("page navigation", () => {
    it("should allow navigating forward and backward", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      expect(adapter.pageIndex()).toBe(0);

      adapter.pageIndex.set(1);
      expect(adapter.pageIndex()).toBe(1);
      expect(adapter.visibleWindow()[0]).toEqual({ id: 11, name: "Item 11" });

      adapter.pageIndex.set(0);
      expect(adapter.pageIndex()).toBe(0);
      expect(adapter.visibleWindow()[0]).toEqual({ id: 1, name: "Item 1" });
    });
  });

  // ── Active datasource integration ──────────────────────────────────

  /** Helper: plain datasource with IActiveDatasource emitters. */
  function createActiveDatasource(data: typeof sampleData) {
    const items = [...data];
    return {
      noteRowChanged: new Emitter<RowChangedNotification>(),
      noteRowRangeChanged: new Emitter<RowRangeChangedNotification>(),
      getNumberOfItems: () => items.length,
      getObjectAtRowIndex: (i: number) => items[i],
      /** Mutate in-place so tests can verify the adapter picks up changes. */
      _items: items,
    };
  }

  describe("noteRowChanged", () => {
    it("should invalidate visibleWindow when noteRowChanged fires", () => {
      const ds = createActiveDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      const before = adapter.visibleWindow();
      expect(before[0]).toEqual({ id: 1, name: "Item 1" });

      // Mutate the underlying data and notify
      ds._items[0] = { id: 1, name: "Updated Item 1" };
      ds.noteRowChanged.emit({ rowIndex: 0 });

      const after = adapter.visibleWindow();
      expect(after[0]).toEqual({ id: 1, name: "Updated Item 1" });
    });

    it("should not invalidate when noteRowChanged fires after dispose", () => {
      const ds = createActiveDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      // Read once to establish a cached computed value
      expect(adapter.visibleWindow()[0]).toEqual({ id: 1, name: "Item 1" });

      adapter.dispose();

      ds._items[0] = { id: 1, name: "Updated Item 1" };
      ds.noteRowChanged.emit({ rowIndex: 0 });

      // visibleWindow should still return the cached value
      expect(adapter.visibleWindow()[0]).toEqual({ id: 1, name: "Item 1" });
    });
  });

  describe("noteRowRangeChanged", () => {
    it("should invalidate visibleWindow and refresh totalItems when noteRowRangeChanged fires", () => {
      const ds = createActiveDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      expect(adapter.totalItems()).toBe(25);

      // Add an item and notify
      ds._items.push({ id: 26, name: "Item 26" });
      ds.noteRowRangeChanged.emit({ range: { start: 25, length: 1 } });

      expect(adapter.totalItems()).toBe(26);
      // The visible window should have been invalidated (re-fetched)
      expect(adapter.visibleWindow().length).toBe(10);
    });

    it("should not invalidate when noteRowRangeChanged fires after dispose", () => {
      const ds = createActiveDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      const totalBefore = adapter.totalItems();
      adapter.dispose();

      ds._items.push({ id: 26, name: "Item 26" });
      ds.noteRowRangeChanged.emit({ range: { start: 25, length: 1 } });

      // totalItems should remain unchanged after dispose
      expect(adapter.totalItems()).toBe(totalBefore);
    });
  });

  describe("dispose", () => {
    it("should be safe to call multiple times", () => {
      const ds = createActiveDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      expect(() => {
        adapter.dispose();
        adapter.dispose();
      }).not.toThrow();
    });

    it("should work for plain datasources without emitters", () => {
      const ds = new ArrayDatasource(sampleData);
      const adapter = new DatasourceAdapter(ds, 10);

      expect(() => adapter.dispose()).not.toThrow();
    });
  });
});
