import { Predicate } from "@angular/core";

/**
 * Describes one or more filter criteria for a datasource.
 *
 * Each element is either:
 * - **Property-level** – targets a single column; the predicate receives
 *   the value of that property (`T[K]`).
 * - **Row-level** – no `property` key; the predicate receives the
 *   entire row object (`T`).
 *
 * @typeParam T - The row object type.
 * @typeParam K - The specific property key (inferred when `property` is provided).
 */
export type FilterExpression<T, K extends keyof T = keyof T> =
  | {
      /** The property of `T` to filter on. */
      property: K;
      /** Predicate that receives the property's value and returns `true` to keep the row. */
      predicate: Predicate<T[K]>;
    }
  | {
      /** Predicate that receives the full row object and returns `true` to keep it. */
      predicate: Predicate<T>;
    }[];
