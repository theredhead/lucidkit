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

  describe("IDatasource contract", () => {
    it("should implement getNumberOfItems", () => {
      expect(typeof ds.getNumberOfItems).toBe("function");
    });

    it("should implement getObjectAtRowIndex", () => {
      expect(typeof ds.getObjectAtRowIndex).toBe("function");
    });
  });
});
