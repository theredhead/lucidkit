import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";

/** Side from which the drawer slides in. */
export type DrawerPosition = "left" | "right";

/** Drawer width presets or a custom CSS value. */
export type DrawerWidth = "narrow" | "medium" | "wide" | string;

/**
 * A slide-in side panel for navigation, detail views, or form sidebars.
 *
 * The drawer slides in from the left or right edge with an overlay backdrop.
 * It supports content projection and two-way binding on the `open` state.
 *
 * @example
 * ```html
 * <ui-drawer [(open)]="sidebarOpen" position="left" width="medium">
 *   <h2>Navigation</h2>
 *   <nav>...</nav>
 * </ui-drawer>
 * ```
 */
@Component({
  selector: "ui-drawer",
  standalone: true,
  templateUrl: "./drawer.component.html",
  styleUrl: "./drawer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-drawer",
    "[class.ui-drawer--open]": "open()",
    "[class.ui-drawer--left]": "position() === 'left'",
    "[class.ui-drawer--right]": "position() === 'right'",
  },
})
export class UIDrawer {
  /** Whether the drawer is open. Supports two-way binding via `[(open)]`. */
  public readonly open = model(false);

  /** Side from which the drawer slides in. */
  public readonly position = input<DrawerPosition>("left");

  /**
   * Drawer width. Use a preset (`"narrow"`, `"medium"`, `"wide"`)
   * or any CSS length value (e.g. `"400px"`, `"30vw"`).
   */
  public readonly width = input<DrawerWidth>("medium");

  /** Whether clicking the backdrop closes the drawer. */
  public readonly closeOnBackdropClick = input(true);

  /** Whether pressing Escape closes the drawer. */
  public readonly closeOnEscape = input(true);

  /** Accessible label for the drawer panel. */
  public readonly ariaLabel = input<string>("Side panel");

  /** Emitted when the drawer is closed by the user. */
  public readonly closed = output<void>();

  /** Close the drawer and emit the `closed` event. */
  public close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  /** Handle backdrop clicks. */
  protected onBackdropClick(): void {
    if (this.closeOnBackdropClick()) {
      this.close();
    }
  }

  /** Handle keyboard events on the drawer. */
  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.closeOnEscape()) {
      event.stopPropagation();
      this.close();
    }
  }

  /** Resolve width to a CSS value. */
  protected resolvedWidth(): string {
    const w = this.width();
    switch (w) {
      case "narrow":
        return "16rem";
      case "medium":
        return "24rem";
      case "wide":
        return "36rem";
      default:
        return w;
    }
  }
}
