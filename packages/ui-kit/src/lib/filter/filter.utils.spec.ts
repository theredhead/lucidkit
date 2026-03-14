import type { Predicate } from "@angular/core";

import type { FilterDescriptor, FilterFieldDefinition } from "./filter.types";
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
  });
});
