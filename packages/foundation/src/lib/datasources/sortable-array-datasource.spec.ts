import { describe, it, expect, beforeEach } from "vitest";
import { SortableArrayDatasource } from "./sortable-array-datasource";
import { isSortableDatasource } from "./type-guards";
import { SortDirection } from "../types/sort";

interface Employee {
  id: number;
  name: string;
  age: number;
}

const employees: Employee[] = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
  { id: 3, name: "Charlie", age: 35 },
];

describe("SortableArrayDatasource", () => {
  let ds: SortableArrayDatasource<Employee>;

  beforeEach(() => {
    ds = new SortableArrayDatasource([...employees]);
  });

  it("should create with initial data", () => {
    expect(ds.getNumberOfItems()).toBe(3);
    expect(ds.getObjectAtRowIndex(0).name).toBe("Alice");
  });

  it("should preserve all rows in allRows getter", () => {
    ds.applyComparator((a, b) => b.age - a.age); // reverse sort
    expect(ds.allRows).toEqual(employees);
  });

  describe("applyComparator", () => {
    it("should sort rows by age ascending", () => {
      ds.applyComparator((a, b) => a.age - b.age);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Bob");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Alice");
      expect(ds.getObjectAtRowIndex(2).name).toBe("Charlie");
    });

    it("should sort rows by age descending", () => {
      ds.applyComparator((a, b) => b.age - a.age);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Charlie");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Alice");
      expect(ds.getObjectAtRowIndex(2).name).toBe("Bob");
    });

    it("should sort rows by name alphabetically", () => {
      ds.applyComparator((a, b) => a.name.localeCompare(b.name));
      expect(ds.getObjectAtRowIndex(0).name).toBe("Alice");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Bob");
      expect(ds.getObjectAtRowIndex(2).name).toBe("Charlie");
    });

    it("should clear sort when passed null", () => {
      ds.applyComparator((a, b) => b.age - a.age);
      ds.applyComparator(null);
      expect(ds.getNumberOfItems()).toBe(3);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Alice");
    });

    it("should clear sort when passed undefined", () => {
      ds.applyComparator((a, b) => a.age - b.age);
      ds.applyComparator(undefined);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Alice");
    });

    it("should not mutate original data", () => {
      const originalData = [...employees];
      ds.applyComparator((a, b) => b.age - a.age);
      expect(employees).toEqual(originalData);
    });
  });

  describe("getObjectAtRowIndex", () => {
    it("should throw for negative index", () => {
      expect(() => ds.getObjectAtRowIndex(-1)).toThrow(RangeError);
    });

    it("should throw for out-of-bounds index", () => {
      expect(() => ds.getObjectAtRowIndex(5)).toThrow(RangeError);
    });
  });

  describe("sortBy (ISortableDatasource)", () => {
    it("should be recognised by isSortableDatasource type guard", () => {
      expect(isSortableDatasource(ds)).toBe(true);
    });

    it("should sort by a single column ascending", () => {
      ds.sortBy([{ columnKey: "name", direction: SortDirection.Ascending }]);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Alice");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Bob");
      expect(ds.getObjectAtRowIndex(2).name).toBe("Charlie");
    });

    it("should sort by a single column descending", () => {
      ds.sortBy([{ columnKey: "name", direction: SortDirection.Descending }]);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Charlie");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Bob");
      expect(ds.getObjectAtRowIndex(2).name).toBe("Alice");
    });

    it("should support multi-column sort with tie-breakers", () => {
      const data = [
        { id: 1, name: "Alice", age: 30 },
        { id: 2, name: "Alice", age: 25 },
        { id: 3, name: "Bob", age: 35 },
      ];
      const multiDs = new SortableArrayDatasource(data);
      multiDs.sortBy([
        { columnKey: "name", direction: SortDirection.Ascending },
        { columnKey: "age", direction: SortDirection.Ascending },
      ]);
      // Both Alices grouped, younger first (string comparison: "25" < "30")
      expect(multiDs.getObjectAtRowIndex(0).age).toBe(25);
      expect(multiDs.getObjectAtRowIndex(1).age).toBe(30);
      expect(multiDs.getObjectAtRowIndex(2).name).toBe("Bob");
    });

    it("should clear sort when given null", () => {
      ds.sortBy([{ columnKey: "name", direction: SortDirection.Descending }]);
      ds.sortBy(null);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Alice");
    });

    it("should clear sort when given empty array", () => {
      ds.sortBy([{ columnKey: "name", direction: SortDirection.Descending }]);
      ds.sortBy([]);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Alice");
    });
  });
});
