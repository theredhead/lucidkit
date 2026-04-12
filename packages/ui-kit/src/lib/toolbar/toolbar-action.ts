import type { UIToolbarItem } from "./toolbar-item.directive";

/**
 * Payload emitted by toolbar tools when the user interacts with them.
 */
export interface ToolActionEvent {

  /** The `id` of the toolbar item that triggered the action. */
  itemId: string;

  /** Reference to the toolbar item instance that triggered the action. */
  itemRef: UIToolbarItem;

  /**
   * The originating mouse event, or `null` for programmatic triggers
   * (e.g. a `UISelectTool` value change).
   */
  event: MouseEvent | null;
}

/**
 * A single item in a {@link UIDropdownTool} dropdown panel.
 */
export interface DropdownToolItem {

  /** Unique identifier for the dropdown item. */
  id: string;

  /** Human-readable label. */
  label: string;

  /** Optional SVG icon content string. */
  icon?: string;

  /** Whether the item is disabled. */
  disabled?: boolean;
}
