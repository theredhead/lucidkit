import type { FilterFieldDefinition, FilterFieldType } from "./filter.types";

/**
 * Metadata describing a projected table column — used to derive
 * field keys and human-readable labels.
 *
 * This intentionally avoids importing `UITableViewColumn` so the
 * utility can be tested without Angular DI.
 */
export interface ColumnMeta {
  /** Property key on the row object. */
  key: string;
  /** Human-readable header text (may be empty). */
  headerText: string;
}

/**
 * Converts a camelCase or snake_case key into a human-readable label.
 *
 * @example
 * ```ts
 * humanizeKey("firstName");  // "First Name"
 * humanizeKey("created_at"); // "Created At"
 * ```
 */
export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z\d])([A-Z])/g, "$1 $2") // camelCase → spaced
    .replace(/[_-]+/g, " ") // snake_case / kebab-case → spaced
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
}

/**
 * Sniffs the runtime type of a value and maps it to a
 * {@link FilterFieldType}.
 *
 * - `number` → `"number"`
 * - `Date` instance → `"date"`
 * - ISO 8601 date strings (YYYY-MM-DD…) → `"date"`
 * - everything else → `"string"`
 */
export function sniffFieldType(value: unknown): FilterFieldType {
  if (value == null) return "string";

  if (typeof value === "number" || typeof value === "bigint") return "number";

  if (value instanceof Date) return "date";

  if (typeof value === "string") {
    // ISO 8601 date patterns: "2024-01-15", "2024-01-15T10:30:00", "2024-01-15T10:30:00Z"
    if (
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/.test(
        value,
      )
    ) {
      const parsed = Date.parse(value);
      if (!isNaN(parsed)) return "date";
    }
  }

  return "string";
}

/**
 * Infers {@link FilterFieldDefinition}s from a sample data row and
 * optional column metadata.
 *
 * ### Inference strategy
 *
 * 1. **Keys** — taken from `columns` (if provided), otherwise from
 *    `Object.keys(sampleRow)`.
 * 2. **Labels** — use the column's `headerText` when available,
 *    otherwise humanise the key (`firstName` → `"First Name"`).
 * 3. **Types** — determined by inspecting the sample row value via
 *    {@link sniffFieldType}.
 *
 * @typeParam T - The row object type.
 * @param sampleRow  A representative data row (typically the first).
 * @param columns    Optional array of column metadata to constrain
 *                   and label the fields.
 * @returns An array of inferred filter field definitions.
 *
 * @example
 * ```ts
 * const fields = inferFilterFields(
 *   { name: "Alice", age: 30, joined: "2024-01-15" },
 * );
 * // → [
 * //   { key: "name",   label: "Name",   type: "string" },
 * //   { key: "age",    label: "Age",    type: "number" },
 * //   { key: "joined", label: "Joined", type: "date"   },
 * // ]
 * ```
 */
export function inferFilterFields<T extends Record<string, unknown>>(
  sampleRow: T,
  columns?: readonly ColumnMeta[],
): FilterFieldDefinition<T>[] {
  if (!sampleRow) return [];

  const keys: string[] =
    columns && columns.length > 0
      ? columns.map((c) => c.key)
      : Object.keys(sampleRow);

  const columnMap = new Map<string, ColumnMeta>();
  if (columns) {
    for (const col of columns) {
      columnMap.set(col.key, col);
    }
  }

  return keys
    .filter((key) => key in sampleRow)
    .map((key) => {
      const col = columnMap.get(key);
      const label = col?.headerText ? col.headerText : humanizeKey(key);
      const type = sniffFieldType(sampleRow[key]);

      return { key, label, type } as FilterFieldDefinition<T>;
    });
}
