/**
 * Template context exposed to each item rendered by the repeater.
 *
 * @typeParam T - The item type.
 */
export interface RepeaterItemContext<T> {
  /** The item object (also available via the implicit `let-item` variable). */
  readonly $implicit: T;
  /** Zero-based index within the current visible window. */
  readonly index: number;
  /** Zero-based absolute index in the full datasource. */
  readonly absoluteIndex: number;
  /** Whether this is the first item in the visible window. */
  readonly first: boolean;
  /** Whether this is the last item in the visible window. */
  readonly last: boolean;
  /** Whether the index is even. */
  readonly even: boolean;
  /** Whether the index is odd. */
  readonly odd: boolean;
}
