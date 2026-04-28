 
import { FilterableArrayDatasource } from "./filterable-array-datasource";
import type { FilterExpression } from "../../filter/filter.types";

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

  describe("filterBy with serializable descriptors", () => {
    it("should filter rows matching a numeric rule", () => {
      const expression: FilterExpression<TestRow> = {
        junction: "and",
        rules: [
          {
            id: 1,
            field: "age",
            operator: "greaterThan",
            value: "30",
          },
        ],
      };

      ds.filterBy(expression);

      expect(ds.getNumberOfItems()).toBe(2);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Charlie");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Eve");
    });

    it("should return all rows when expression is null", () => {
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "age",
            operator: "greaterThan",
            value: "30",
          },
        ],
      });
      expect(ds.getNumberOfItems()).toBe(2);

      ds.filterBy(null);
      expect(ds.getNumberOfItems()).toBe(5);
    });

    it("should return all rows when expression is empty", () => {
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "age",
            operator: "greaterThan",
            value: "30",
          },
        ],
      });
      ds.filterBy({ junction: "and", rules: [] });

      expect(ds.getNumberOfItems()).toBe(5);
    });

    it("should return empty when no rows match", () => {
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "age",
            operator: "greaterThan",
            value: "100",
          },
        ],
      });

      expect(ds.getNumberOfItems()).toBe(0);
    });

    it("should re-derive from original data, not from previous filter", () => {
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "department",
            operator: "equals",
            value: "Engineering",
          },
        ],
      });
      expect(ds.getNumberOfItems()).toBe(3);

      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 2,
            field: "department",
            operator: "equals",
            value: "Sales",
          },
        ],
      });
      expect(ds.getNumberOfItems()).toBe(1);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Diana");
    });

    it("should AND multiple rules", () => {
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "department",
            operator: "equals",
            value: "Engineering",
          },
          {
            id: 2,
            field: "age",
            operator: "greaterThan",
            value: "30",
          },
        ],
      });

      expect(ds.getNumberOfItems()).toBe(2);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Charlie");
      expect(ds.getObjectAtRowIndex(1).name).toBe("Eve");
    });

    it("should support the any-field simple search rule", () => {
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "__any__",
            operator: "contains",
            value: "eve",
          },
        ],
      });

      expect(ds.getNumberOfItems()).toBe(1);
      expect(ds.getObjectAtRowIndex(0).name).toBe("Eve");
    });
  });

  describe("clearFilter", () => {
    it("should restore all rows after a descriptor filter", () => {
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "age",
            operator: "greaterThan",
            value: "30",
          },
        ],
      });
      expect(ds.getNumberOfItems()).toBe(2);

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
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "age",
            operator: "greaterThan",
            value: "30",
          },
        ],
      });
      expect(() => ds.getObjectAtRowIndex(-1)).toThrow(RangeError);
    });

    it("should throw RangeError for index beyond filtered length", () => {
      ds.filterBy({
        junction: "and",
        rules: [
          {
            id: 1,
            field: "age",
            operator: "greaterThan",
            value: "30",
          },
        ],
      });
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
