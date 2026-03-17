/**
 * Delegate interface that the {@link TreeKeyboardHandler} uses to
 * query and navigate the tree-view's state.
 *
 * All navigation and selection logic lives in the delegate (the
 * component). The handler is just a thin key-to-intent mapper.
 *
 * Implement this on the host component (or any adapter) to wire up
 * the handler without coupling it to a specific component class.
 */
export interface TreeKeyboardDelegate {
  // ── Queries about the cursor (focused + selected node) ──────────

  /** Whether any node currently has the keyboard cursor. */
  hasCursor(): boolean;

  /** Whether the cursor node is currently expanded. */
  isCursorExpanded(): boolean;

  /** Whether the cursor node has children (is expandable). */
  cursorHasChildren(): boolean;

  // ── Navigation ─────────────────────────────────────────────────
  // When `extend` is true (Shift held), the new cursor position is
  // added to the selection instead of replacing it.

  /** Move cursor to the next visible node. */
  moveCursorDown(extend: boolean): void;

  /** Move cursor to the previous visible node. */
  moveCursorUp(extend: boolean): void;

  /** Move cursor to the first visible node. */
  moveCursorToFirst(extend: boolean): void;

  /** Move cursor to the last visible node. */
  moveCursorToLast(extend: boolean): void;

  /** Move cursor to the parent of the current node. */
  moveCursorToParent(): void;

  // ── Actions on the cursor node ────────────────────────────────

  /** Expand the cursor node. */
  expandCursor(): void;

  /** Collapse the cursor node. */
  collapseCursor(): void;

  /** Activate the cursor node (e.g. emit an activation event). */
  activateCursor(): void;

  /** Clear all selection. */
  clearSelection(): void;
}

/**
 * Keyboard-navigation handler for the tree-view.
 *
 * This class maps keyboard events to semantic tree-navigation intents
 * via the {@link TreeKeyboardDelegate} interface. All mutable state
 * and structural knowledge lives in the delegate — the handler is a
 * pure key → intent mapper.
 *
 * Instantiate it once and call {@link handleKeydown} from the host
 * component's `(keydown)` binding.
 *
 * ### Handled keys
 *
 * | Key            | Action                                                |
 * | -------------- | ----------------------------------------------------- |
 * | `ArrowDown`    | Move cursor down (Shift extends selection)            |
 * | `ArrowUp`      | Move cursor up (Shift extends selection)              |
 * | `ArrowRight`   | Expand node, or move cursor down if already expanded  |
 * | `ArrowLeft`    | Collapse node, or move cursor to parent if collapsed  |
 * | `Enter`        | Activate the cursor node                              |
 * | `Home`         | Move cursor to first node (Shift extends selection)   |
 * | `End`          | Move cursor to last node (Shift extends selection)    |
 * | `Escape`       | Clear all selection                                   |
 */
export class TreeKeyboardHandler {
  private readonly delegate: TreeKeyboardDelegate;

  public constructor(delegate: TreeKeyboardDelegate) {
    this.delegate = delegate;
  }

  /**
   * Handles a `keydown` event on the tree-view host element.
   */
  public handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.delegate.moveCursorDown(event.shiftKey);
        break;

      case "ArrowUp":
        event.preventDefault();
        this.delegate.moveCursorUp(event.shiftKey);
        break;

      case "ArrowRight":
        event.preventDefault();
        if (!this.delegate.hasCursor()) break;
        if (
          this.delegate.cursorHasChildren() &&
          !this.delegate.isCursorExpanded()
        ) {
          this.delegate.expandCursor();
        } else {
          this.delegate.moveCursorDown(event.shiftKey);
        }
        break;

      case "ArrowLeft":
        event.preventDefault();
        if (!this.delegate.hasCursor()) break;
        if (this.delegate.isCursorExpanded()) {
          this.delegate.collapseCursor();
        } else {
          this.delegate.moveCursorToParent();
        }
        break;

      case "Enter":
        event.preventDefault();
        if (this.delegate.hasCursor()) {
          this.delegate.activateCursor();
        }
        break;

      case "Home":
        event.preventDefault();
        this.delegate.moveCursorToFirst(event.shiftKey);
        break;

      case "End":
        event.preventDefault();
        this.delegate.moveCursorToLast(event.shiftKey);
        break;

      case "Escape":
        event.preventDefault();
        this.delegate.clearSelection();
        break;
    }
  }
}
