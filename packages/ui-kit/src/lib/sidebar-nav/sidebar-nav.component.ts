import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  contentChildren,
  input,
  model,
  output,
} from "@angular/core";

import { UIIcon } from "../icon/icon.component";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/lucid-foundation";

/**
 * A single navigation item in the sidebar.
 *
 * @example
 * ```html
 * <ui-sidebar-item label="Dashboard" [icon]="UIIcons.Lucide.Layout.LayoutDashboard" [active]="true" />
 * ```
 */
@Component({
  selector: "ui-sidebar-item",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-sidebar-item",
    "[class.active]": "active()",
    "[class.disabled]": "disabled()",
    "[attr.role]": "'treeitem'",
    "[attr.aria-selected]": "active()",
    "[attr.aria-disabled]": "disabled()",
    "[attr.tabindex]": "disabled() ? -1 : 0",
    "(click)": "onActivate()",
    "(keydown.enter)": "onActivate()",
    "(keydown.space)": "onActivate(); $event.preventDefault()",
  },
  templateUrl: "./sidebar-item.component.html",
  styleUrl: "./sidebar-item.component.scss",
})
export class UISidebarItem {
  /** Display label for this navigation item. */
  public readonly label = input.required<string>();

  /** Optional icon SVG content from the `UIIcons` registry. */
  public readonly icon = input<string>("");

  /** Optional trailing badge text (e.g. a count). */
  public readonly badge = input<string>("");

  /** Whether this item is currently active / selected. */
  public readonly active = input(false);

  /** Whether this item is disabled. */
  public readonly disabled = input(false);

  /** Emitted when the item is activated by the user. */
  public readonly activated = output<void>();

  /** @internal Handle activation. */
  public onActivate(): void {
    if (!this.disabled()) {
      this.activated.emit();
    }
  }
}

/**
 * A collapsible group of navigation items.
 *
 * @example
 * ```html
 * <ui-sidebar-group label="Settings" [icon]="UIIcons.Lucide.Account.Settings">
 *   <ui-sidebar-item label="General" />
 *   <ui-sidebar-item label="Security" />
 * </ui-sidebar-group>
 * ```
 */
@Component({
  selector: "ui-sidebar-group",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-sidebar-group",
    "[class.expanded]": "expanded()",
  },
  templateUrl: "./sidebar-group.component.html",
  styleUrl: "./sidebar-group.component.scss",
})
export class UISidebarGroup {
  /** Display label for the group header. */
  public readonly label = input.required<string>();

  /** Optional icon SVG content from the `UIIcons` registry. */
  public readonly icon = input<string>("");

  /** Whether the group is expanded. Supports two-way binding. */
  public readonly expanded = model(true);

  /** Toggle the expanded state. */
  public toggle(): void {
    this.expanded.update((v) => !v);
  }

  /** @internal Handle keyboard toggle. */
  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggle();
    }
  }
}

/**
 * A vertical sidebar navigation container.
 *
 * Renders a vertical list of `<ui-sidebar-item>` and `<ui-sidebar-group>`
 * components. Supports collapsible groups, active item highlighting,
 * icons, and trailing badges.
 *
 * @example
 * ```html
 * <ui-sidebar-nav ariaLabel="Main navigation">
 *   <ui-sidebar-item label="Dashboard" [icon]="dashboardIcon" [active]="true" />
 *   <ui-sidebar-item label="Projects" [icon]="folderIcon" />
 *   <ui-sidebar-group label="Settings" [icon]="settingsIcon">
 *     <ui-sidebar-item label="General" />
 *     <ui-sidebar-item label="Security" />
 *   </ui-sidebar-group>
 * </ui-sidebar-nav>
 * ```
 */
@Component({
  selector: "ui-sidebar-nav",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
  host: {
    class: "ui-sidebar-nav",
    "[attr.role]": "'navigation'",
    "[attr.aria-label]": "ariaLabel()",
  },
  templateUrl: "./sidebar-nav.component.html",
  styleUrl: "./sidebar-nav.component.scss",
})
export class UISidebarNav {
  /** Accessible label for the navigation landmark. */
  public readonly ariaLabel = input<string>("Sidebar navigation");

  /** Whether the sidebar is in a compact/collapsed icon-only mode. */
  public readonly collapsed = input(false);

  /** All projected sidebar items (direct children). */
  public readonly items = contentChildren(UISidebarItem);
}

/**
 * A container for custom header content above the sidebar navigation.
 *
 * @example
 * ```html
 * <ui-navigation-page>
 *   <header uiSidebarHeader>…</header>
 * </ui-navigation-page>
 * ```
 */
@Directive({
  selector: "[uiSidebarHeader]",
  standalone: true,
  host: { class: "ui-sidebar-header" },
})
export class UISidebarHeader {}

/**
 * A container for custom footer content below the sidebar navigation.
 *
 * @example
 * ```html
 * <ui-navigation-page>
 *   <footer uiSidebarFooter>…</footer>
 * </ui-navigation-page>
 * ```
 */
@Directive({
  selector: "[uiSidebarFooter]",
  standalone: true,
  host: { class: "ui-sidebar-footer" },
})
export class UISidebarFooter {}
