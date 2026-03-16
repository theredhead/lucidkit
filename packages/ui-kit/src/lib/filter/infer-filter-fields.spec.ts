import { describe, expect, it } from "vitest";

import {
  humanizeKey,
  inferFilterFields,
  sniffFieldType,
  type ColumnMeta,
} from "./infer-filter-fields";

// ── sniffFieldType ──────────────────────────────────────────────────

describe("sniffFieldType", () => {
  it('should return "number" for numeric values', () => {
    expect(sniffFieldType(42)).toBe("number");
    expect(sniffFieldType(0)).toBe("number");
    expect(sniffFieldType(-3.14)).toBe("number");
    expect(sniffFieldType(NaN)).toBe("number");
    expect(sniffFieldType(Infinity)).toBe("number");
  });

  it('should return "number" for bigint values', () => {
    expect(sniffFieldType(BigInt(99))).toBe("number");
  });

  it('should return "date" for Date instances', () => {
    expect(sniffFieldType(new Date())).toBe("date");
    expect(sniffFieldType(new Date("2024-01-15"))).toBe("date");
  });

  it('should return "date" for ISO 8601 date strings', () => {
    expect(sniffFieldType("2024-01-15")).toBe("date");
    expect(sniffFieldType("2024-01-15T10:30:00")).toBe("date");
    expect(sniffFieldType("2024-01-15T10:30:00Z")).toBe("date");
    expect(sniffFieldType("2024-01-15T10:30:00+02:00")).toBe("date");
    expect(sniffFieldType("2024-01-15T10:30:00.123Z")).toBe("date");
  });

  it('should return "string" for non-date strings', () => {
    expect(sniffFieldType("hello")).toBe("string");
    expect(sniffFieldType("")).toBe("string");
    expect(sniffFieldType("2024")).toBe("string");
    expect(sniffFieldType("not-a-date")).toBe("string");
  });

  it('should return "string" for null and undefined', () => {
    expect(sniffFieldType(null)).toBe("string");
    expect(sniffFieldType(undefined)).toBe("string");
  });

  it('should return "string" for booleans and objects', () => {
    expect(sniffFieldType(true)).toBe("string");
    expect(sniffFieldType({})).toBe("string");
    expect(sniffFieldType([])).toBe("string");
  });
});

// ── humanizeKey ─────────────────────────────────────────────────────

describe("humanizeKey", () => {
  it("should convert camelCase to Title Case", () => {
    expect(humanizeKey("firstName")).toBe("First Name");
    expect(humanizeKey("createdAt")).toBe("Created At");
  });

  it("should convert snake_case to Title Case", () => {
    expect(humanizeKey("first_name")).toBe("First Name");
    expect(humanizeKey("created_at")).toBe("Created At");
  });

  it("should convert kebab-case to Title Case", () => {
    expect(humanizeKey("first-name")).toBe("First Name");
  });

  it("should handle single-word keys", () => {
    expect(humanizeKey("name")).toBe("Name");
    expect(humanizeKey("email")).toBe("Email");
  });

  it("should handle consecutive uppercase letters", () => {
    expect(humanizeKey("userID")).toBe("User ID");
    expect(humanizeKey("htmlParser")).toBe("Html Parser");
  });
});

// ── inferFilterFields ───────────────────────────────────────────────

describe("inferFilterFields", () => {
  it("should infer string, number, and date types from a sample row", () => {
    const row = { name: "Alice", age: 30, joined: "2024-01-15" };
    const fields = inferFilterFields(row);

    expect(fields).toEqual([
      { key: "name", label: "Name", type: "string" },
      { key: "age", label: "Age", type: "number" },
      { key: "joined", label: "Joined", type: "date" },
    ]);
  });

  it("should use column metadata for keys and labels", () => {
    const row = {
      name: "Alice",
      age: 30,
      joined: "2024-01-15",
      department: "Engineering",
    };
    const columns: ColumnMeta[] = [
      { key: "name", headerText: "Full Name" },
      { key: "department", headerText: "Dept" },
    ];
    const fields = inferFilterFields(row, columns);

    expect(fields).toEqual([
      { key: "name", label: "Full Name", type: "string" },
      { key: "department", label: "Dept", type: "string" },
    ]);
  });

  it("should fall back to humanized key when headerText is empty", () => {
    const row = { firstName: "Alice" };
    const columns: ColumnMeta[] = [{ key: "firstName", headerText: "" }];
    const fields = inferFilterFields(row, columns);

    expect(fields).toEqual([
      { key: "firstName", label: "First Name", type: "string" },
    ]);
  });

  it("should skip column keys not found in the sample row", () => {
    const row = { name: "Alice" };
    const columns: ColumnMeta[] = [
      { key: "name", headerText: "Name" },
      { key: "missing", headerText: "Missing" },
    ];
    const fields = inferFilterFields(row, columns);

    expect(fields).toEqual([{ key: "name", label: "Name", type: "string" }]);
  });

  it("should return empty array for null or undefined sampleRow", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(inferFilterFields(null as any)).toEqual([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(inferFilterFields(undefined as any)).toEqual([]);
  });

  it("should return empty array for an empty sample row", () => {
    expect(inferFilterFields({})).toEqual([]);
  });

  it("should infer Date instance fields as date type", () => {
    const row = { created: new Date("2024-06-01") };
    const fields = inferFilterFields(row);

    expect(fields).toEqual([
      { key: "created", label: "Created", type: "date" },
    ]);
  });

  it("should use all Object.keys when no columns are provided", () => {
    const row = { a: "x", b: 1, c: true };
    const fields = inferFilterFields(row);

    expect(fields).toHaveLength(3);
    expect(fields.map((f) => f.key)).toEqual(["a", "b", "c"]);
  });
});
