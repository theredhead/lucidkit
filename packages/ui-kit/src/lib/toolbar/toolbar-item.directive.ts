import { Directive, input, output } from "@angular/core";
import type { ToolActionEvent } from "./toolbar-action";

/**
 * Abstract base directive for all toolbar tool components.
 *
 * Concrete tool components extend this class and register themselves via
 * DI forwarding so {@link UIToolbar} can discover them through
 * `contentChildren(UIToolbarItem)`.
 *
 * ```ts
 * providers: [
 *   { provide: UIToolbarItem, useExisting: forwardRef(() => MyTool) }
 * ]
 * ```
 */
@Directive({ standalone: true })
export abstract class UIToolbarItem {

  /** Unique identifier for this toolbar item. */
  public readonly id = input.required<string>();

  /** Human-readable label shown in the tool. */
  public readonly label = input<string>("");

  /** SVG inner-content string for an optional icon (use `UIIcons.Lucide.*`). */
  public readonly icon = input<string | undefined>(undefined);

  /** Tooltip text shown on pointer hover. */
  public readonly tooltip = input<string>("");

  /** Accessible label forwarded to the native element as `aria-label`. */
  public readonly ariaLabel = input<string>("");

  /** Whether this item is disabled. */
  public readonly disabled = input<boolean>(false);

  /** Emitted when the user triggers an action on this item. */
  public readonly itemAction = output<ToolActionEvent>();

  /**
   * Emit a {@link ToolActionEvent} for this item.
   *
   * @param event - The originating mouse event, or `null` for
   *   programmatic triggers.
   */
  protected emitAction(event: MouseEvent | null): void {
    this.itemAction.emit({ itemId: this.id(), itemRef: this, event });
  }

  /**
   * Prevent mouse activation from stealing focus from the surface the toolbar
   * is commanding, such as a contenteditable editor.
   *
   * Keyboard users can still move focus to toolbar controls normally.
   *
   * @param event - The originating mouse event.
   * @internal
   */
  protected preserveCommandTargetFocus(event: MouseEvent): void {
    if (!this.disabled()) {
      event.preventDefault();
    }
  }

  /**
   * Deactivate (un-check / un-press) this item.
   *
   * No-op by default. Overridden by {@link UIToggleTool} to set
   * `checked` to `false`, enabling radio-style exclusivity in
   * {@link UIToggleGroupTool}.
   */
  public deactivate(): void {
    // intentionally empty
  }
}
