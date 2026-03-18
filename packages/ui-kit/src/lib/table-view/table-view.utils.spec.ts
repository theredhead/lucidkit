import { describe, it, expect } from "vitest";

import { toComparator } from "./table-view.utils";
import type { SortState } from "./table-view-header/table-view-header.component";

interface TestItem extends Record<string, unknown> {
  name?: string;
  age?: number;
  score?: number;
}

describe("table-view.utils", () => {
  describe("toComparator", () => {
    it("should return null for null state", () => {
      expect(toComparator(null)).toBeNull();
    });

    it("should return null for undefined state", () => {
      expect(toComparator(undefined)).toBeNull();
    });

    it("should create ascending comparator", () => {
      const state: SortState = { key: "name", direction: "asc" };
      const cmp = toComparator(state)!;

      const a: TestItem = { name: "Alice" };
      const b: TestItem = { name: "Bob" };

      expect(cmp(a, b)).toBeLessThan(0); // Alice < Bob
      expect(cmp(b, a)).toBeGreaterThan(0); // Bob > Alice
    });

    it("should create descending comparator", () => {
      const state: SortState = { key: "name", direction: "desc" };
      const cmp = toComparator(state)!;

      const a: TestItem = { name: "Alice" };
      const b: TestItem = { name: "Bob" };

      expect(cmp(a, b)).toBeGreaterThan(0); // Alice > Bob (descending)
      expect(cmp(b, a)).toBeLessThan(0); // Bob < Alice (descending)
    });

    it("should handle equal values", () => {
      const state: SortState = { key: "name", direction: "asc" };
      const cmp = toComparator(state)!;

      const a: TestItem = { name: "Alice" };
      const b: TestItem = { name: "Alice" };

      expect(cmp(a, b)).toBe(0);
    });

    it("should handle missing properties by treating as empty string", () => {
      const state: SortState = { key: "name", direction: "asc" };
      const cmp = toComparator(state)!;

      const a: TestItem = { age: 30 }; // missing name
      const b: TestItem = { name: "Bob" };

      expect(cmp(a, b)).toBeLessThan(0); // empty string < "Bob"
    });

    it("should handle null/undefined properties", () => {
      const state: SortState = { key: "name", direction: "asc" };
      const cmp = toComparator(state)!;

      const a: TestItem = {};
      (a as Record<string, unknown>)["name"] = null;
      const b: TestItem = { name: "Bob" };

      expect(cmp(a, b)).toBeLessThan(0); // "null" < "Bob"
    });

    it("should perform locale-aware comparison", () => {
      const state: SortState = { key: "name", direction: "asc" };
      const cmp = toComparator(state)!;

      const a: TestItem = { name: "Äpple" };
      const b: TestItem = { name: "Banana" };

      expect(cmp(a, b)).toBeLessThan(0); // Äpple < Banana (locale-aware)
    });

    it("should sort multiple items correctly", () => {
      const state: SortState = { key: "score", direction: "asc" };
      const cmp = toComparator(state)!;

      const items: TestItem[] = [{ score: 30 }, { score: 10 }, { score: 20 }];

      items.sort(cmp);

      expect(items.map((i) => i.score)).toEqual([10, 20, 30]);
    });

    it("should sort in descending order", () => {
      const state: SortState = { key: "score", direction: "desc" };
      const cmp = toComparator(state)!;

      const items: TestItem[] = [{ score: 30 }, { score: 10 }, { score: 20 }];

      items.sort(cmp);

      expect(items.map((i) => i.score)).toEqual([30, 20, 10]);
    });
  });
});
