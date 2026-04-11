import type { SelectOption } from "@theredhead/lucid-kit";

/**
 * Supported field types for a property sheet row.
 *
 * Each type maps to a specific editor widget:
 * - `'string'` → `<ui-input type="text">`
 * - `'number'` → `<ui-input type="number">`
 * - `'boolean'` → `<ui-checkbox>`
 * - `'select'` → `<ui-select>`
 * - `'color'` → `<ui-color-picker>`
 * - `'slider'` → `<ui-slider>`
 */
export type PropertyFieldType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "color"
  | "slider";

/**
 * Definition for a single property field in a {@link UIPropertySheet}.
 *
 * @typeParam T - The data object type.
 */
export interface PropertyFieldDefinition<T = Record<string, unknown>> {
  /** The key on the data object this field reads/writes. */
  readonly key: string & keyof T;

  /** Human-readable label. */
  readonly label: string;

  /** Editor type. */
  readonly type: PropertyFieldType;

  /**
   * Category/group name. Fields with the same group are rendered
   * together under a shared heading.
   */
  readonly group?: string;

  /** Placeholder text (string / number fields). */
  readonly placeholder?: string;

  /** Whether this field is read-only. */
  readonly readonly?: boolean;

  /** Options for `'select'` fields. */
  readonly options?: readonly SelectOption[];

  /** Minimum value for `'number'` / `'slider'` fields. */
  readonly min?: number;

  /** Maximum value for `'number'` / `'slider'` fields. */
  readonly max?: number;

  /** Step for `'number'` / `'slider'` fields. */
  readonly step?: number;
}

/**
 * Event emitted when a property value changes.
 *
 * @typeParam T - The data object type.
 */
export interface PropertyChangeEvent<T = Record<string, unknown>> {
  /** The field key that changed. */
  readonly key: string & keyof T;

  /** The new value. */
  readonly value: unknown;

  /** The complete, updated data object. */
  readonly data: T;
}
