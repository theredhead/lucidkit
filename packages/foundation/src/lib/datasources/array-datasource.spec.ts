import { ArrayDatasource } from "./array-datasource";

describe("ArrayDatasource", () => {
  const sampleData = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  let ds: ArrayDatasource<{ id: number; name: string }>;

  beforeEach(() => {
    ds = new ArrayDatasource(sampleData);
  });

  describe("constructor", () => {
    it("should create an instance", () => {
      expect(ds).toBeTruthy();
    });

    it("should make a defensive copy of the input array", () => {
      const original = [1, 2, 3];
      const numDs = new ArrayDatasource(original);
      original.push(4);

      expect(numDs.getNumberOfItems()).toBe(3);
    });
  });

  describe("getNumberOfItems", () => {
    it("should return the number of items", () => {
      expect(ds.getNumberOfItems()).toBe(3);
    });

    it("should return 0 for an empty array", () => {
      const empty = new ArrayDatasource([]);
      expect(empty.getNumberOfItems()).toBe(0);
    });
  });

  describe("getObjectAtRowIndex", () => {
    it("should return the item at the given index", () => {
      expect(ds.getObjectAtRowIndex(0)).toEqual({ id: 1, name: "Alice" });
      expect(ds.getObjectAtRowIndex(1)).toEqual({ id: 2, name: "Bob" });
      expect(ds.getObjectAtRowIndex(2)).toEqual({ id: 3, name: "Charlie" });
    });

    it("should throw RangeError for a negative index", () => {
      expect(() => ds.getObjectAtRowIndex(-1)).toThrow(RangeError);
    });

    it("should throw RangeError for an index equal to length", () => {
      expect(() => ds.getObjectAtRowIndex(3)).toThrow(RangeError);
    });

    it("should throw RangeError for an index beyond the length", () => {
      expect(() => ds.getObjectAtRowIndex(100)).toThrow(RangeError);
    });
  });

  describe("moveItem", () => {
    it("should move an item forward", () => {
      ds.moveItem(0, 2);
      expect(ds.getObjectAtRowIndex(0)).toEqual({ id: 2, name: "Bob" });
      expect(ds.getObjectAtRowIndex(1)).toEqual({ id: 3, name: "Charlie" });
      expect(ds.getObjectAtRowIndex(2)).toEqual({ id: 1, name: "Alice" });
    });

    it("should move an item backward", () => {
      ds.moveItem(2, 0);
      expect(ds.getObjectAtRowIndex(0)).toEqual({ id: 3, name: "Charlie" });
      expect(ds.getObjectAtRowIndex(1)).toEqual({ id: 1, name: "Alice" });
      expect(ds.getObjectAtRowIndex(2)).toEqual({ id: 2, name: "Bob" });
    });

    it("should be a no-op when from === to", () => {
      ds.moveItem(1, 1);
      expect(ds.getObjectAtRowIndex(0)).toEqual({ id: 1, name: "Alice" });
      expect(ds.getObjectAtRowIndex(1)).toEqual({ id: 2, name: "Bob" });
      expect(ds.getObjectAtRowIndex(2)).toEqual({ id: 3, name: "Charlie" });
    });

    it("should not change item count", () => {
      ds.moveItem(0, 2);
      expect(ds.getNumberOfItems()).toBe(3);
    });
  });

  describe("insertItem", () => {
    it("should insert at the beginning", () => {
      ds.insertItem(0, { id: 99, name: "New" });
      expect(ds.getNumberOfItems()).toBe(4);
      expect(ds.getObjectAtRowIndex(0)).toEqual({ id: 99, name: "New" });
      expect(ds.getObjectAtRowIndex(1)).toEqual({ id: 1, name: "Alice" });
    });

    it("should insert in the middle", () => {
      ds.insertItem(1, { id: 99, name: "New" });
      expect(ds.getNumberOfItems()).toBe(4);
      expect(ds.getObjectAtRowIndex(1)).toEqual({ id: 99, name: "New" });
      expect(ds.getObjectAtRowIndex(2)).toEqual({ id: 2, name: "Bob" });
    });

    it("should insert at the end", () => {
      ds.insertItem(3, { id: 99, name: "New" });
      expect(ds.getNumberOfItems()).toBe(4);
      expect(ds.getObjectAtRowIndex(3)).toEqual({ id: 99, name: "New" });
    });
  });

  describe("removeItem", () => {
    it("should remove and return the item at the given index", () => {
      const removed = ds.removeItem(1);
      expect(removed).toEqual({ id: 2, name: "Bob" });
      expect(ds.getNumberOfItems()).toBe(2);
    });

    it("should remove from the beginning", () => {
      const removed = ds.removeItem(0);
      expect(removed).toEqual({ id: 1, name: "Alice" });
      expect(ds.getObjectAtRowIndex(0)).toEqual({ id: 2, name: "Bob" });
    });

    it("should remove from the end", () => {
      const removed = ds.removeItem(2);
      expect(removed).toEqual({ id: 3, name: "Charlie" });
      expect(ds.getNumberOfItems()).toBe(2);
    });

    it("should shift subsequent items down", () => {
      ds.removeItem(0);
      expect(ds.getObjectAtRowIndex(0)).toEqual({ id: 2, name: "Bob" });
      expect(ds.getObjectAtRowIndex(1)).toEqual({ id: 3, name: "Charlie" });
    });
  });
});
