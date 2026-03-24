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

/**
 * Event emitted when items are reordered within a single repeater via drag-and-drop.
 */
export interface RepeaterReorderEvent {
  /** The index the item was dragged from. */
  readonly previousIndex: number;
  /** The index the item was dropped at. */
  readonly currentIndex: number;
}

/**
 * Event emitted when an item is transferred between two connected repeaters.
 *
 * @typeParam T - The item type.
 */
export interface RepeaterTransferEvent<T> {
  /** The transferred item. */
  readonly item: T;
  /** The index in the source repeater. */
  readonly previousIndex: number;
  /** The index in the target repeater. */
  readonly currentIndex: number;
}
