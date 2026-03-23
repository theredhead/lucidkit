/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterableArrayDatasource } from "./filterable-array-datasource";

interface TestRow {
  id: number;
  name: string;
  age: number;
  department: string;
}

describe("FilterableArrayDatasource", () => {
  const employees: TestRow[] = [
    { id: 1, name: "Alice", age: 30, department: "Engineering" },
    { id: 2, name: "Bob", age: 25, department: "Marketing" },
    { id: 3, name: "Charlie", age: 35, department: "Engineering" },
    { id: 4, name: "Diana", age: 28, department: "Sales" },
    { id: 5, name: "Eve", age: 40, department: "Engineering" },
  ];

  let ds: FilterableArrayDatasource<TestRow>;

  beforeEach(() => {
    ds = new FilterableArrayDatasource(employees);
  });

  it("should create an instance", () => {
    expect(ds).toBeTruthy();
  });

  describe("without filters", () => {
    it("should return the total number of items", () => {
      expect(ds.getNumberOfItems()).toBe(5);
    });

    it("should return items at any index", () => {
      expect(ds.getObjectAtRowIndex(0)).toEqual(employees[0]);
      expect(ds.getObjectAtRowIndex(4)).toEqual(employees[4]);
    });
  });

  describe("filterBy with row-level predicates", () => {
    it("should filter rows matching the predicate", () => {
      ds.filterBy([{ predicate: ((row: TestRow) => row.age > 30) as any }]);

      expect(ds.getNumberOfItems()).toBe(2);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Charlie");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Eve");
    });

    it("should return all rows when expression is null", () => {
      ds.filterBy([{ predicate: ((row: TestRow) => row.age > 30) as any }]);
      expect(ds.getNumberOfItems()).toBe(2);

      ds.filterBy(null);
      expect(ds.getNumberOfItems()).toBe(5);
    });

    it("should return all rows when expression is empty", () => {
      ds.filterBy([{ predicate: ((row: TestRow) => row.age > 30) as any }]);
      ds.filterBy([]);

      expect(ds.getNumberOfItems()).toBe(5);
    });

    it("should return empty when no rows match", () => {
      ds.filterBy([{ predicate: ((row: TestRow) => row.age > 100) as any }]);

      expect(ds.getNumberOfItems()).toBe(0);
    });

    it("should re-derive from original data, not from previous filter", () => {
      ds.filterBy([
        {
          predicate: ((row: TestRow) =>
            row.department === "Engineering") as any,
        },
      ]);
      expect(ds.getNumberOfItems()).toBe(3);

      ds.filterBy([
        {
          predicate: ((row: TestRow) => row.department === "Sales") as any,
        },
      ]);
      expect(ds.getNumberOfItems()).toBe(1);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Diana");
    });
  });

  describe("filterBy", () => {
    it("should filter by a property-level predicate", () => {
      ds.filterBy([
        {
          property: "department" as const,
          predicate: ((val: string) => val === "Engineering") as any,
        },
      ]);

      expect(ds.getNumberOfItems()).toBe(3);
    });

    it("should filter by a row-level predicate", () => {
      ds.filterBy([
        {
          predicate: ((row: TestRow) =>
            row.age >= 30 && row.department === "Engineering") as any,
        },
      ]);

      expect(ds.getNumberOfItems()).toBe(3);
      // Alice (30, Eng), Charlie (35, Eng), Eve (40, Eng)
    });

    it("should AND multiple predicates", () => {
      ds.filterBy([
        {
          property: "department" as const,
          predicate: ((val: string) => val === "Engineering") as any,
        },
        {
          property: "age" as const,
          predicate: ((val: number) => val > 30) as any,
        },
      ]);

      expect(ds.getNumberOfItems()).toBe(2);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Charlie");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Eve");
    });

    it("should clear filters when given an empty expression", () => {
      ds.filterBy([
        {
          property: "department" as const,
          predicate: ((val: string) => val === "Sales") as any,
        },
      ]);
      expect(ds.getNumberOfItems()).toBe(1);

      ds.filterBy([]);
      expect(ds.getNumberOfItems()).toBe(5);
    });

    it("should clear filters when given null/undefined", () => {
      ds.filterBy([
        {
          property: "department" as const,
          predicate: ((val: string) => val === "Sales") as any,
        },
      ]);

      ds.filterBy(null as any);
      expect(ds.getNumberOfItems()).toBe(5);
    });
  });

  describe("clearFilter", () => {
    it("should restore all rows after a row-level filter", () => {
      ds.filterBy([{ predicate: ((row: TestRow) => row.age > 30) as any }]);
      expect(ds.getNumberOfItems()).toBe(2);

      ds.clearFilter();
      expect(ds.getNumberOfItems()).toBe(5);
    });

    it("should restore all rows after a filterBy expression", () => {
      ds.filterBy([
        {
          property: "department" as const,
          predicate: ((val: string) => val === "Sales") as any,
        },
      ]);
      expect(ds.getNumberOfItems()).toBe(1);

      ds.clearFilter();
      expect(ds.getNumberOfItems()).toBe(5);
    });

    it("should be safe to call when no filter is active", () => {
      expect(() => ds.clearFilter()).not.toThrow();
      expect(ds.getNumberOfItems()).toBe(5);
    });
  });

  describe("bounds checking", () => {
    it("should throw RangeError for negative index on filtered data", () => {
      ds.filterBy([{ predicate: ((row: TestRow) => row.age > 30) as any }]);
      expect(() => ds.getObjectAtRowIndex(-1)).toThrow(RangeError);
    });

    it("should throw RangeError for index beyond filtered length", () => {
      ds.filterBy([{ predicate: ((row: TestRow) => row.age > 30) as any }]);
      // Filtered length is 2
      expect(() => ds.getObjectAtRowIndex(2)).toThrow(RangeError);
    });
  });

  describe("defensive copy", () => {
    it("should not be affected by mutations to the original array", () => {
      const mutable = [...employees];
      const mutableDs = new FilterableArrayDatasource(mutable);
      mutable.push({ id: 6, name: "Frank", age: 22, department: "HR" });

      expect(mutableDs.getNumberOfItems()).toBe(5);
    });
  });
});
