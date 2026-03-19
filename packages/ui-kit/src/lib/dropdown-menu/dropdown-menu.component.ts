import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core";

/** Alignment of the dropdown relative to the trigger. */
export type DropdownAlign = "start" | "end";

/**
 * A single item in a dropdown menu.
 *
 * @example
 * ```html
 * <ui-dropdown-item (action)="onEdit()">Edit</ui-dropdown-item>
 * ```
 */
@Component({
  selector: "ui-dropdown-item",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-dropdown-item",
    "[class.ui-dropdown-item--disabled]": "disabled()",
    "[attr.role]": "'menuitem'",
    "[attr.aria-disabled]": "disabled()",
    "[attr.tabindex]": "disabled() ? -1 : 0",
    "(click)": "onClick()",
    "(keydown.enter)": "onClick()",
    "(keydown.space)": "onClick(); $event.preventDefault()",
  },
  template: `<ng-content />`,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-size: 0.875rem;
      line-height: 1.4;
      border-radius: 0.25rem;
      white-space: nowrap;
      transition: background-color 100ms ease;
    }

    :host(:hover:not(.ui-dropdown-item--disabled)),
    :host(:focus-visible) {
      background: rgba(128, 128, 128, 0.12);
      outline: none;
    }

    :host(.ui-dropdown-item--disabled) {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
})
export class UIDropdownItem {
  /** Whether this item is disabled. */
  public readonly disabled = input(false);

  /** Emitted when the item is activated (click or keyboard). */
  public readonly action = output<void>();

  /** @internal */
  public onClick(): void {
    if (!this.disabled()) {
      this.action.emit();
    }
  }
}

/**
 * A visual divider between menu items.
 *
 * @example
 * ```html
 * <ui-dropdown-divider />
 * ```
 */
@Component({
  selector: "ui-dropdown-divider",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-dropdown-divider",
    role: "separator",
  },
  template: "",
  styles: `
    :host {
      display: block;
      height: 1px;
      margin: 0.25rem 0;
      background: var(--ui-dropdown-border, #d7dce2);
    }
  `,
})
export class UIDropdownDivider {}

/**
 * A dropdown menu triggered by projected content (typically a button).
 *
 * Projects a trigger element and a list of `<ui-dropdown-item>` entries.
 * The menu opens on click and closes when an item is selected, the backdrop
 * is clicked, or Escape is pressed.
 *
 * @example
 * ```html
 * <ui-dropdown-menu>
 *   <ui-button trigger>Actions ▾</ui-button>
 *   <ui-dropdown-item (action)="onEdit()">Edit</ui-dropdown-item>
 *   <ui-dropdown-item (action)="onDelete()">Delete</ui-dropdown-item>
 * </ui-dropdown-menu>
 * ```
 */
@Component({
  selector: "ui-dropdown-menu",
  standalone: true,
  templateUrl: "./dropdown-menu.component.html",
  styleUrl: "./dropdown-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-dropdown-menu",
    "(document:click)": "onDocumentClick($event)",
    "(document:keydown.escape)": "closeMenu()",
  },
})
export class UIDropdownMenu {
  /** Horizontal alignment of the menu relative to the trigger. */
  public readonly align = input<DropdownAlign>("start");

  /** Accessible label for the menu. */
  public readonly ariaLabel = input<string>("Menu");

  /** Whether the menu is currently open. */
  public readonly isOpen = signal(false);

  private readonly elementRef = inject(ElementRef);

  /** Toggle the menu open/closed. */
  public toggleMenu(): void {
    this.isOpen.update((v) => !v);
  }

  /** Close the menu. */
  public closeMenu(): void {
    this.isOpen.set(false);
  }

  /** @internal Handle item click → close menu. */
  public onItemClick(): void {
    this.closeMenu();
  }

  /** @internal Close on outside clicks. */
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }
}
