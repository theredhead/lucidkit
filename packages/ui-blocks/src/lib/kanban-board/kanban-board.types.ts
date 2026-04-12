/**
 * Represents a column (lane) in the kanban board.
 *
 * @template T  The shape of the card payload.
 */
export interface KanbanColumn<T = unknown> {

  /** Unique column identifier. */
  readonly id: string;

  /** Display title for the column header. */
  readonly title: string;

  /** Ordered list of cards in this column (mutated during drag operations). */
  cards: KanbanCard<T>[];

  /** Optional accent colour rendered as a top-border stripe. */
  readonly color?: string;
}

/**
 * Represents a single card on the kanban board.
 *
 * @template T  The shape of the card payload.
 */
export interface KanbanCard<T = unknown> {

  /** Unique card identifier. */
  readonly id: string;

  /** Consumer-supplied payload rendered via the card template. */
  readonly data: T;
}

/**
 * Emitted when a card is moved between columns or reordered
 * within the same column.
 *
 * @template T  The shape of the card payload.
 */
export interface KanbanCardMoveEvent<T = unknown> {

  /** The card that was moved. */
  readonly card: KanbanCard<T>;

  /** Column the card came from. */
  readonly previousColumnId: string;

  /** Column the card was dropped into. */
  readonly currentColumnId: string;

  /** Previous index within the source column. */
  readonly previousIndex: number;

  /** New index within the target column. */
  readonly currentIndex: number;
}

/**
 * Template context exposed to the projected card template.
 *
 * @template T  The shape of the card payload.
 */
export interface KanbanCardContext<T = unknown> {

  /** The card instance (also available via `let-card`). */
  readonly $implicit: KanbanCard<T>;

  /** The column the card belongs to. */
  readonly column: KanbanColumn<T>;
}
