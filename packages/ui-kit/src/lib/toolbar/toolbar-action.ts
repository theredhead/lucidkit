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
   * (e.g. a {@link UISelectTool} value change).
   */
  event: MouseEvent | null;
}

/**
 * A single item in a {@link UIDropdownTool} dropdown panel.
 */
export interface DropdownToolItem {
  /** Unique identifier for the dropdown item. */
  id: string;

  /** Human-readable label. Shown as a tooltip in `'icon-grid'` display mode. */
  label: string;

  /** Optional SVG icon content string. Required for `'icon-grid'` display mode. */
  icon?: string;

  /** Whether the item is disabled. */
  disabled?: boolean;
}

/**
 * Controls how items are rendered inside a {@link UIDropdownTool} panel.
 *
 * - `'list'`      — icon + label in a vertical list (traditional menu style)
 * - `'icon-grid'` — icon-only buttons in a compact grid; labels are shown as
 *                   native tooltips on hover. Best when all items have icons.
 */
export type DropdownToolDisplayMode = "list" | "icon-grid";
