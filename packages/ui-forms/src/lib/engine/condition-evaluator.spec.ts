import { describe, expect, it } from "vitest";

import { evaluateCondition } from "./condition-evaluator";
import type {
  Condition,
  ConditionGroup,
  FieldCondition,
} from "../types/condition.types";
import type { FormValues } from "../types/form-schema.types";

describe("evaluateCondition", () => {
  const values: FormValues = {
    name: "Alice",
    age: 30,
    country: "NL",
    tags: ["admin", "editor"],
    empty: "",
    nil: null,
  };

  describe("equals", () => {
    it("should return true when values match", () => {
      const cond: FieldCondition = {
        field: "name",
        operator: "equals",
        value: "Alice",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return false when values differ", () => {
      const cond: FieldCondition = {
        field: "name",
        operator: "equals",
        value: "Bob",
      };
      expect(evaluateCondition(cond, values)).toBe(false);
    });
  });

  describe("notEquals", () => {
    it("should return true when values differ", () => {
      const cond: FieldCondition = {
        field: "name",
        operator: "notEquals",
        value: "Bob",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return false when values match", () => {
      const cond: FieldCondition = {
        field: "name",
        operator: "notEquals",
        value: "Alice",
      };
      expect(evaluateCondition(cond, values)).toBe(false);
    });
  });

  describe("contains", () => {
    it("should return true for string containing substring", () => {
      const cond: FieldCondition = {
        field: "name",
        operator: "contains",
        value: "lic",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return true for array containing value", () => {
      const cond: FieldCondition = {
        field: "tags",
        operator: "contains",
        value: "admin",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return false when not contained", () => {
      const cond: FieldCondition = {
        field: "tags",
        operator: "contains",
        value: "viewer",
      };
      expect(evaluateCondition(cond, values)).toBe(false);
    });
  });

  describe("notContains", () => {
    it("should return true when not contained", () => {
      const cond: FieldCondition = {
        field: "tags",
        operator: "notContains",
        value: "viewer",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return false when contained", () => {
      const cond: FieldCondition = {
        field: "tags",
        operator: "notContains",
        value: "admin",
      };
      expect(evaluateCondition(cond, values)).toBe(false);
    });
  });

  describe("empty / notEmpty", () => {
    it("should return true for null field with empty", () => {
      const cond: FieldCondition = {
        field: "nil",
        operator: "empty",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return true for empty string with empty", () => {
      const cond: FieldCondition = {
        field: "empty",
        operator: "empty",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return false for non-empty field with empty", () => {
      const cond: FieldCondition = {
        field: "name",
        operator: "empty",
      };
      expect(evaluateCondition(cond, values)).toBe(false);
    });

    it("should return true for non-empty field with notEmpty", () => {
      const cond: FieldCondition = {
        field: "name",
        operator: "notEmpty",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return false for null field with notEmpty", () => {
      const cond: FieldCondition = {
        field: "nil",
        operator: "notEmpty",
      };
      expect(evaluateCondition(cond, values)).toBe(false);
    });
  });

  describe("greaterThan / lessThan", () => {
    it("should evaluate greaterThan correctly", () => {
      const cond: FieldCondition = {
        field: "age",
        operator: "greaterThan",
        value: 18,
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should evaluate lessThan correctly", () => {
      const cond: FieldCondition = {
        field: "age",
        operator: "lessThan",
        value: 50,
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return false for non-numeric field", () => {
      const cond: FieldCondition = {
        field: "name",
        operator: "greaterThan",
        value: 10,
      };
      expect(evaluateCondition(cond, values)).toBe(false);
    });
  });

  describe("greaterThanOrEqual / lessThanOrEqual", () => {
    it("should return true when equal for greaterThanOrEqual", () => {
      const cond: FieldCondition = {
        field: "age",
        operator: "greaterThanOrEqual",
        value: 30,
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return true when equal for lessThanOrEqual", () => {
      const cond: FieldCondition = {
        field: "age",
        operator: "lessThanOrEqual",
        value: 30,
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });
  });

  describe("in / notIn", () => {
    it("should return true when value is in array", () => {
      const cond: FieldCondition = {
        field: "country",
        operator: "in",
        value: ["NL", "BE", "DE"],
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });

    it("should return false when value is not in array", () => {
      const cond: FieldCondition = {
        field: "country",
        operator: "in",
        value: ["US", "UK"],
      };
      expect(evaluateCondition(cond, values)).toBe(false);
    });

    it("should return true when value is not in array for notIn", () => {
      const cond: FieldCondition = {
        field: "country",
        operator: "notIn",
        value: ["US", "UK"],
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });
  });

  describe("condition groups", () => {
    it("should evaluate 'every' mode — all conditions must pass", () => {
      const group: ConditionGroup = {
        mode: "every",
        conditions: [
          { field: "name", operator: "equals", value: "Alice" },
          { field: "age", operator: "greaterThan", value: 18 },
        ],
      };
      expect(evaluateCondition(group, values)).toBe(true);
    });

    it("should fail 'every' mode when one condition fails", () => {
      const group: ConditionGroup = {
        mode: "every",
        conditions: [
          { field: "name", operator: "equals", value: "Alice" },
          { field: "age", operator: "greaterThan", value: 50 },
        ],
      };
      expect(evaluateCondition(group, values)).toBe(false);
    });

    it("should evaluate 'some' mode — any condition must pass", () => {
      const group: ConditionGroup = {
        mode: "some",
        conditions: [
          { field: "name", operator: "equals", value: "Bob" },
          { field: "age", operator: "greaterThan", value: 18 },
        ],
      };
      expect(evaluateCondition(group, values)).toBe(true);
    });

    it("should fail 'some' mode when all conditions fail", () => {
      const group: ConditionGroup = {
        mode: "some",
        conditions: [
          { field: "name", operator: "equals", value: "Bob" },
          { field: "age", operator: "greaterThan", value: 50 },
        ],
      };
      expect(evaluateCondition(group, values)).toBe(false);
    });

    it("should default to 'every' mode when mode is not specified", () => {
      const group: Condition = {
        conditions: [
          { field: "name", operator: "equals", value: "Alice" },
          { field: "country", operator: "equals", value: "NL" },
        ],
      } as ConditionGroup;
      expect(evaluateCondition(group, values)).toBe(true);
    });
  });

  describe("unknown field", () => {
    it("should treat missing field as undefined", () => {
      const cond: FieldCondition = {
        field: "nonexistent",
        operator: "empty",
      };
      expect(evaluateCondition(cond, values)).toBe(true);
    });
  });
});
