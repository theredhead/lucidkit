import type { Predicate } from "@angular/core";

import type { FilterDescriptor, FilterFieldDefinition } from "./filter.types";
import { ANY_FIELD_KEY } from "./filter.types";
import { toFilterExpression, toPredicate } from "./filter.utils";

interface TestRow {
  name: string;
  age: number;
  joined: string;
}

const fields: FilterFieldDefinition<TestRow>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "age", label: "Age", type: "number" },
  { key: "joined", label: "Joined", type: "date" },
];

describe("filter.utils", () => {
  // ---------------------------------------------------------------------------
  // toPredicate
  // ---------------------------------------------------------------------------
  describe("toPredicate", () => {
    it("should return undefined when there are no rules", () => {
      const descriptor: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [],
      };
      expect(toPredicate(descriptor, fields)).toBeUndefined();
    });

    it("should return undefined when rules reference unknown fields", () => {
      const descriptor: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [{ id: 1, field: "unknown", operator: "equals", value: "x" }],
      };
      expect(toPredicate(descriptor, fields)).toBeUndefined();
    });

    // ── String operators ─────────────────────────────────────────────

    describe("string operators", () => {
      const row: TestRow = { name: "Alice", age: 30, joined: "2024-01-15" };

      function buildPred(operator: string, value: string): Predicate<TestRow> {
        const d: FilterDescriptor<TestRow> = {
          junction: "and",
          rules: [{ id: 1, field: "name", operator: operator as any, value }],
        };
        return toPredicate(d, fields)!;
      }

      it("contains", () => {
        expect(buildPred("contains", "lic")(row)).toBe(true);
        expect(buildPred("contains", "xyz")(row)).toBe(false);
      });

      it("notContains", () => {
        expect(buildPred("notContains", "xyz")(row)).toBe(true);
        expect(buildPred("notContains", "lic")(row)).toBe(false);
      });

      it("equals (case-insensitive)", () => {
        expect(buildPred("equals", "alice")(row)).toBe(true);
        expect(buildPred("equals", "Bob")(row)).toBe(false);
      });

      it("notEquals", () => {
        expect(buildPred("notEquals", "Bob")(row)).toBe(true);
        expect(buildPred("notEquals", "alice")(row)).toBe(false);
      });

      it("startsWith", () => {
        expect(buildPred("startsWith", "Ali")(row)).toBe(true);
        expect(buildPred("startsWith", "ice")(row)).toBe(false);
      });

      it("endsWith", () => {
        expect(buildPred("endsWith", "ice")(row)).toBe(true);
        expect(buildPred("endsWith", "Ali")(row)).toBe(false);
      });

      it("isEmpty", () => {
        const empty = { ...row, name: "" };
        expect(buildPred("isEmpty", "")(empty)).toBe(true);
        expect(buildPred("isEmpty", "")(row)).toBe(false);
      });

      it("isNotEmpty", () => {
        expect(buildPred("isNotEmpty", "")(row)).toBe(true);
        const empty = { ...row, name: "" };
        expect(buildPred("isNotEmpty", "")(empty)).toBe(false);
      });
    });

    // ── Any field ────────────────────────────────────────────────────

    describe("Any field (__any__)", () => {
      const row: TestRow = { name: "Alice", age: 30, joined: "2024-01-15" };

      function buildAnyPred(
        operator: string,
        value: string,
      ): Predicate<TestRow> {
        const d: FilterDescriptor<TestRow> = {
          junction: "and",
          rules: [
            {
              id: 1,
              field: ANY_FIELD_KEY as any,
              operator: operator as any,
              value,
            },
          ],
        };
        return toPredicate(d, fields)!;
      }

      it("contains should match when any field value includes the term", () => {
        expect(buildAnyPred("contains", "ali")(row)).toBe(true);
        expect(buildAnyPred("contains", "30")(row)).toBe(true);
        expect(buildAnyPred("contains", "2024")(row)).toBe(true);
      });

      it("contains should not match when no field value includes the term", () => {
        expect(buildAnyPred("contains", "xyz")(row)).toBe(false);
      });

      it("equals should match when any field value equals the term", () => {
        expect(buildAnyPred("equals", "Alice")(row)).toBe(true);
        expect(buildAnyPred("equals", "30")(row)).toBe(true);
      });

      it("equals should not match partial values", () => {
        expect(buildAnyPred("equals", "Ali")(row)).toBe(false);
      });

      it("startsWith should match when any field value starts with the term", () => {
        expect(buildAnyPred("startsWith", "Ali")(row)).toBe(true);
        expect(buildAnyPred("startsWith", "2024")(row)).toBe(true);
      });

      it("isEmpty should match when any field value is empty", () => {
        const emptyRow: TestRow = { name: "", age: 0, joined: "" };
        expect(buildAnyPred("isEmpty", "")(emptyRow)).toBe(true);
        expect(buildAnyPred("isEmpty", "")(row)).toBe(false);
      });

      it("should work with AND junction alongside regular rules", () => {
        const d: FilterDescriptor<TestRow> = {
          junction: "and",
          rules: [
            {
              id: 1,
              field: ANY_FIELD_KEY as any,
              operator: "contains" as any,
              value: "Alice",
            },
            { id: 2, field: "age", operator: "greaterThan" as any, value: "20" },
          ],
        };
        const pred = toPredicate(d, fields)!;
        expect(pred(row)).toBe(true);
        expect(pred({ name: "Alice", age: 10, joined: "" })).toBe(false);
      });

      it("should work with OR junction", () => {
        const d: FilterDescriptor<TestRow> = {
          junction: "or",
          rules: [
            {
              id: 1,
              field: ANY_FIELD_KEY as any,
              operator: "contains" as any,
              value: "xyz",
            },
            { id: 2, field: "name", operator: "equals" as any, value: "Alice" },
          ],
        };
        const pred = toPredicate(d, fields)!;
        expect(pred(row)).toBe(true);
      });
    });

    // ── Number operators ─────────────────────────────────────────────

    describe("number operators", () => {
      const row: TestRow = { name: "Alice", age: 30, joined: "2024-01-15" };

      function buildPred(
        operator: string,
        value: string,
        valueTo?: string,
      ): Predicate<TestRow> {
        const d: FilterDescriptor<TestRow> = {
          junction: "and",
          rules: [
            { id: 1, field: "age", operator: operator as any, value, valueTo },
          ],
        };
        return toPredicate(d, fields)!;
      }

      it("equals", () => {
        expect(buildPred("equals", "30")(row)).toBe(true);
        expect(buildPred("equals", "25")(row)).toBe(false);
      });

      it("notEquals", () => {
        expect(buildPred("notEquals", "25")(row)).toBe(true);
        expect(buildPred("notEquals", "30")(row)).toBe(false);
      });

      it("greaterThan", () => {
        expect(buildPred("greaterThan", "29")(row)).toBe(true);
        expect(buildPred("greaterThan", "30")(row)).toBe(false);
      });

      it("greaterThanOrEqual", () => {
        expect(buildPred("greaterThanOrEqual", "30")(row)).toBe(true);
        expect(buildPred("greaterThanOrEqual", "31")(row)).toBe(false);
      });

      it("lessThan", () => {
        expect(buildPred("lessThan", "31")(row)).toBe(true);
        expect(buildPred("lessThan", "30")(row)).toBe(false);
      });

      it("lessThanOrEqual", () => {
        expect(buildPred("lessThanOrEqual", "30")(row)).toBe(true);
        expect(buildPred("lessThanOrEqual", "29")(row)).toBe(false);
      });

      it("between", () => {
        expect(buildPred("between", "20", "40")(row)).toBe(true);
        expect(buildPred("between", "31", "50")(row)).toBe(false);
      });

      it("isEmpty", () => {
        const empty = { ...row, age: null as any };
        expect(buildPred("isEmpty", "")(empty)).toBe(true);
        expect(buildPred("isEmpty", "")(row)).toBe(false);
      });

      it("isNotEmpty", () => {
        expect(buildPred("isNotEmpty", "")(row)).toBe(true);
        const empty = { ...row, age: null as any };
        expect(buildPred("isNotEmpty", "")(empty)).toBe(false);
      });
    });

    // ── Date operators ───────────────────────────────────────────────

    describe("date operators", () => {
      const row: TestRow = { name: "Alice", age: 30, joined: "2024-06-15" };

      function buildPred(
        operator: string,
        value: string,
        extra?: Partial<{ valueTo: string; unit: string }>,
      ): Predicate<TestRow> {
        const d: FilterDescriptor<TestRow> = {
          junction: "and",
          rules: [
            {
              id: 1,
              field: "joined",
              operator: operator as any,
              value,
              valueTo: extra?.valueTo,
              unit: extra?.unit as any,
            },
          ],
        };
        return toPredicate(d, fields)!;
      }

      it("equals", () => {
        expect(buildPred("equals", "2024-06-15")(row)).toBe(true);
        expect(buildPred("equals", "2024-06-16")(row)).toBe(false);
      });

      it("before", () => {
        expect(buildPred("before", "2024-07-01")(row)).toBe(true);
        expect(buildPred("before", "2024-01-01")(row)).toBe(false);
      });

      it("after", () => {
        expect(buildPred("after", "2024-01-01")(row)).toBe(true);
        expect(buildPred("after", "2025-01-01")(row)).toBe(false);
      });

      it("between", () => {
        expect(
          buildPred("between", "2024-01-01", { valueTo: "2024-12-31" })(row),
        ).toBe(true);
        expect(
          buildPred("between", "2025-01-01", { valueTo: "2025-12-31" })(row),
        ).toBe(false);
      });

      it("isEmpty", () => {
        const empty = { ...row, joined: "" };
        expect(buildPred("isEmpty", "")(empty)).toBe(true);
        expect(buildPred("isEmpty", "")(row)).toBe(false);
      });

      it("isNotEmpty", () => {
        expect(buildPred("isNotEmpty", "")(row)).toBe(true);
        const empty = { ...row, joined: "" };
        expect(buildPred("isNotEmpty", "")(empty)).toBe(false);
      });
    });

    // ── Junction ─────────────────────────────────────────────────────

    describe("junction", () => {
      const rows: TestRow[] = [
        { name: "Alice", age: 30, joined: "2024-01-01" },
        { name: "Bob", age: 25, joined: "2024-01-01" },
        { name: "Charlie", age: 35, joined: "2024-01-01" },
      ];

      it("AND: all rules must match", () => {
        const descriptor: FilterDescriptor<TestRow> = {
          junction: "and",
          rules: [
            { id: 1, field: "name", operator: "startsWith", value: "Ali" },
            { id: 2, field: "age", operator: "greaterThan", value: "28" },
          ],
        };

        const pred = toPredicate(descriptor, fields)!;
        const result = rows.filter(pred);
        // Only Alice: name starts with "Ali" AND age > 28
        expect(result.length).toBe(1);
        expect(result[0].name).toBe("Alice");
      });

      it("OR: any rule may match", () => {
        const descriptor: FilterDescriptor<TestRow> = {
          junction: "or",
          rules: [
            { id: 1, field: "name", operator: "equals", value: "bob" },
            { id: 2, field: "age", operator: "greaterThan", value: "34" },
          ],
        };

        const pred = toPredicate(descriptor, fields)!;
        const result = rows.filter(pred);
        // Bob (name match) + Charlie (age > 34)
        expect(result.length).toBe(2);
        expect(result.map((r) => r.name)).toEqual(["Bob", "Charlie"]);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // toFilterExpression
  // ---------------------------------------------------------------------------
  describe("toFilterExpression", () => {
    it("should return empty array when there are no rules", () => {
      const descriptor: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [],
      };
      expect(toFilterExpression(descriptor, fields)).toEqual([]);
    });

    it("should produce property-level predicates for AND junction", () => {
      const descriptor: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          { id: 1, field: "name", operator: "contains", value: "A" },
          { id: 2, field: "age", operator: "greaterThan", value: "20" },
        ],
      };

      const expr = toFilterExpression(descriptor, fields);
      expect(expr.length).toBe(2);
      // Each entry should have a `property` key
      expect("property" in expr[0]).toBe(true);
      expect("property" in expr[1]).toBe(true);
    });

    it("should produce a single row-level predicate for OR junction", () => {
      const descriptor: FilterDescriptor<TestRow> = {
        junction: "or",
        rules: [
          { id: 1, field: "name", operator: "contains", value: "A" },
          { id: 2, field: "age", operator: "greaterThan", value: "20" },
        ],
      };

      const expr = toFilterExpression(descriptor, fields);
      expect(expr.length).toBe(1);
      // Single row-level entry (no `property`)
      expect("property" in expr[0]).toBe(false);
    });

    it("AND expression should filter correctly", () => {
      const descriptor: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [{ id: 1, field: "name", operator: "startsWith", value: "A" }],
      };

      const expr = toFilterExpression(descriptor, fields);
      const entry = expr[0];
      if ("property" in entry) {
        expect(entry.property).toBe("name");
        expect(entry.predicate("Alice")).toBe(true);
        expect(entry.predicate("Bob")).toBe(false);
      } else {
        throw new Error("Expected property-level entry");
      }
    });

    it("OR expression should filter correctly", () => {
      const rows: TestRow[] = [
        { name: "Alice", age: 30, joined: "2024-01-01" },
        { name: "Bob", age: 25, joined: "2024-01-01" },
        { name: "Charlie", age: 35, joined: "2024-01-01" },
      ];

      const descriptor: FilterDescriptor<TestRow> = {
        junction: "or",
        rules: [
          { id: 1, field: "name", operator: "equals", value: "alice" },
          { id: 2, field: "age", operator: "greaterThan", value: "34" },
        ],
      };

      const expr = toFilterExpression(descriptor, fields);
      const pred = expr[0];
      if ("predicate" in pred && !("property" in pred)) {
        const result = rows.filter(pred.predicate);
        expect(result.length).toBe(2);
        expect(result.map((r) => r.name)).toEqual(["Alice", "Charlie"]);
      } else {
        throw new Error("Expected row-level entry");
      }
    });

    it("should return empty array when rules reference unknown fields", () => {
      const descriptor: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [{ id: 1, field: "unknown", operator: "equals", value: "x" }],
      };
      expect(toFilterExpression(descriptor, fields)).toEqual([]);
    });

    it("AND with Any field rule should produce a row-level entry for it", () => {
      const descriptor: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          {
            id: 1,
            field: ANY_FIELD_KEY as any,
            operator: "contains" as any,
            value: "Alice",
          },
          { id: 2, field: "age", operator: "greaterThan" as any, value: "20" },
        ],
      };

      const expr = toFilterExpression(descriptor, fields);
      // Any-field rule becomes row-level, age rule stays property-level
      expect(expr.length).toBe(2);
      const anyEntry = expr.find((e) => !("property" in e));
      const propEntry = expr.find((e) => "property" in e);
      expect(anyEntry).toBeDefined();
      expect(propEntry).toBeDefined();
    });

    it("OR with Any field rule should filter correctly", () => {
      const rows: TestRow[] = [
        { name: "Alice", age: 30, joined: "2024-01-01" },
        { name: "Bob", age: 25, joined: "2024-01-01" },
      ];

      const descriptor: FilterDescriptor<TestRow> = {
        junction: "or",
        rules: [
          {
            id: 1,
            field: ANY_FIELD_KEY as any,
            operator: "contains" as any,
            value: "Alice",
          },
        ],
      };

      const expr = toFilterExpression(descriptor, fields);
      expect(expr.length).toBe(1);
      const entry = expr[0];
      if ("predicate" in entry && !("property" in entry)) {
        expect(entry.predicate(rows[0])).toBe(true);
        expect(entry.predicate(rows[1])).toBe(false);
      } else {
        throw new Error("Expected row-level entry");
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Date operators — inTheLast
  // ---------------------------------------------------------------------------
  describe("date operator: inTheLast", () => {
    const now = new Date();

    function buildDatePred(value: string, unit: string) {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          {
            id: 1,
            field: "joined",
            operator: "inTheLast",
            value,
            unit: unit as any,
          },
        ],
      };
      return toPredicate(d, fields)!;
    }

    it("inTheLast days — recent date passes", () => {
      const recent = new Date();
      recent.setDate(recent.getDate() - 3);
      const row: TestRow = {
        name: "X",
        age: 1,
        joined: recent.toISOString(),
      };
      expect(buildDatePred("7", "days")(row)).toBe(true);
    });

    it("inTheLast days — old date fails", () => {
      const old = new Date();
      old.setDate(old.getDate() - 30);
      const row: TestRow = {
        name: "X",
        age: 1,
        joined: old.toISOString(),
      };
      expect(buildDatePred("7", "days")(row)).toBe(false);
    });

    it("inTheLast weeks", () => {
      const recent = new Date();
      recent.setDate(recent.getDate() - 10);
      const row: TestRow = {
        name: "X",
        age: 1,
        joined: recent.toISOString(),
      };
      expect(buildDatePred("2", "weeks")(row)).toBe(true);
    });

    it("inTheLast months", () => {
      const recent = new Date();
      recent.setMonth(recent.getMonth() - 1);
      const row: TestRow = {
        name: "X",
        age: 1,
        joined: recent.toISOString(),
      };
      expect(buildDatePred("2", "months")(row)).toBe(true);
    });

    it("inTheLast years", () => {
      const recent = new Date();
      recent.setFullYear(recent.getFullYear() - 1);
      recent.setDate(recent.getDate() + 10); // just within 2 years
      const row: TestRow = {
        name: "X",
        age: 1,
        joined: recent.toISOString(),
      };
      expect(buildDatePred("2", "years")(row)).toBe(true);
    });

    it("inTheLast defaults to days when unit is not specified", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          {
            id: 1,
            field: "joined",
            operator: "inTheLast",
            value: "7",
            // no unit specified
          },
        ],
      };
      const pred = toPredicate(d, fields)!;
      const recent = new Date();
      recent.setDate(recent.getDate() - 3);
      const row: TestRow = {
        name: "X",
        age: 1,
        joined: recent.toISOString(),
      };
      expect(pred(row)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Default / unknown operator fallback
  // ---------------------------------------------------------------------------
  describe("unknown operator fallback", () => {
    it("should return true for unknown string operator", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          { id: 1, field: "name", operator: "nonexistent" as any, value: "x" },
        ],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: "anything", age: 0, joined: "" })).toBe(true);
    });

    it("should return true for unknown number operator", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          { id: 1, field: "age", operator: "nonexistent" as any, value: "5" },
        ],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: "x", age: 99, joined: "" })).toBe(true);
    });

    it("should return true for unknown date operator", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          {
            id: 1,
            field: "joined",
            operator: "nonexistent" as any,
            value: "2024-01-01",
          },
        ],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: "x", age: 0, joined: "2024-01-01" })).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Edge cases: null / undefined values
  // ---------------------------------------------------------------------------
  describe("edge cases", () => {
    it("string contains with null value in row should not throw", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [{ id: 1, field: "name", operator: "contains", value: "x" }],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: null as any, age: 0, joined: "" })).toBe(false);
    });

    it("number isEmpty with empty string value", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [{ id: 1, field: "age", operator: "isEmpty", value: "" }],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: "x", age: "" as any, joined: "" })).toBe(true);
    });

    it("number isNotEmpty with empty string value", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [{ id: 1, field: "age", operator: "isNotEmpty", value: "" }],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: "x", age: "" as any, joined: "" })).toBe(false);
    });

    it("date equals with invalid date string should not match", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          { id: 1, field: "joined", operator: "equals", value: "2024-01-01" },
        ],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: "x", age: 0, joined: "not-a-date" })).toBe(false);
    });

    it("date before with null date should not match", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          { id: 1, field: "joined", operator: "before", value: "2030-01-01" },
        ],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: "x", age: 0, joined: null as any })).toBe(false);
    });

    it("date after with numeric timestamp should parse", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [
          { id: 1, field: "joined", operator: "after", value: "2020-01-01" },
        ],
      };
      const pred = toPredicate(d, fields)!;
      // numeric timestamp (ms since epoch for 2024-06-15)
      expect(pred({ name: "x", age: 0, joined: Date.now() as any })).toBe(true);
    });

    it("string isEmpty with null row value", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [{ id: 1, field: "name", operator: "isEmpty", value: "" }],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: null as any, age: 0, joined: "" })).toBe(true);
    });

    it("string isNotEmpty with null row value", () => {
      const d: FilterDescriptor<TestRow> = {
        junction: "and",
        rules: [{ id: 1, field: "name", operator: "isNotEmpty", value: "" }],
      };
      const pred = toPredicate(d, fields)!;
      expect(pred({ name: null as any, age: 0, joined: "" })).toBe(false);
    });
  });
});
