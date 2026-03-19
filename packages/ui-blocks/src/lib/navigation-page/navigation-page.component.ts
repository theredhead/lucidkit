import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  input,
  model,
  output,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import {
  type BreadcrumbItem,
  type BreadcrumbVariant,
  type DrawerPosition,
  type DrawerWidth,
  UIBreadcrumb,
  UIDrawer,
  UISidebarGroup,
  UISidebarItem,
  UISidebarNav,
} from "@theredhead/ui-kit";

/** Definition of a single navigation page within a {@link UINavigationPage}. */
export interface NavigationPageItem {
  /** Unique identifier used to match the active page. */
  readonly id: string;

  /** Display label shown in the sidebar and breadcrumb trail. */
  readonly label: string;

  /**
   * Optional icon SVG content from the `UIIcons` registry.
   * Forwarded to the sidebar item's `[icon]` input.
   */
  readonly icon?: string;

  /**
   * Optional trailing badge text (e.g. a count).
   * Forwarded to the sidebar item's `[badge]` input.
   */
  readonly badge?: string;

  /**
   * Optional parent group identifier.
   * Items sharing the same `group` value are rendered inside a
   * collapsible `<ui-sidebar-group>`.
   */
  readonly group?: string;

  /** Whether this item should be disabled. */
  readonly disabled?: boolean;
}

/** Definition of a collapsible group header in the sidebar. */
export interface NavigationGroupDef {
  /** Unique identifier matching the `group` field on {@link NavigationPageItem}. */
  readonly id: string;

  /** Display label for the group header. */
  readonly label: string;

  /**
   * Optional icon SVG content from the `UIIcons` registry.
   * Forwarded to the sidebar group's `[icon]` input.
   */
  readonly icon?: string;

  /** Whether the group starts expanded. Defaults to `true`. */
  readonly expanded?: boolean;
}

/**
 * A full-page navigation layout that combines a {@link UIDrawer},
 * a {@link UISidebarNav} with configurable items, a {@link UIBreadcrumb}
 * path, and a main content area.
 *
 * The sidebar is rendered inside a responsive drawer that can be
 * permanently visible or toggled open/closed on smaller screens.
 * Clicking a nav item emits `navigated` and updates the breadcrumb
 * trail automatically.
 *
 * @example
 * ```html
 * <ui-navigation-page
 *   [pages]="pages"
 *   [groups]="groups"
 *   [(activePage)]="currentPage"
 *   (navigated)="onNavigate($event)"
 * >
 *   <ng-template #content let-page>
 *     <h2>{{ page.label }}</h2>
 *     <p>Content for {{ page.label }}</p>
 *   </ng-template>
 * </ui-navigation-page>
 * ```
 */
@Component({
  selector: "ui-navigation-page",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    UIDrawer,
    UISidebarNav,
    UISidebarItem,
    UISidebarGroup,
    UIBreadcrumb,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./navigation-page.component.html",
  styleUrl: "./navigation-page.component.scss",
  host: {
    class: "ui-navigation-page",
    "[class.ui-navigation-page--drawer-open]": "drawerOpen()",
  },
})
export class UINavigationPage {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** All navigation page definitions. */
  public readonly pages = input.required<readonly NavigationPageItem[]>();

  /**
   * Optional group definitions for collapsible sections.
   * Items whose `group` field matches a group's `id` are nested inside it.
   */
  public readonly groups = input<readonly NavigationGroupDef[]>([]);

  /**
   * Root breadcrumb label displayed as the first item in the trail.
   * Clicking it navigates to the first page.
   */
  public readonly rootLabel = input<string>("Home");

  /** Side the drawer slides in from. */
  public readonly drawerPosition = input<DrawerPosition>("left");

  /** Width of the drawer panel. */
  public readonly drawerWidth = input<DrawerWidth>("medium");

  /** Visual style for the breadcrumb trail. */
  public readonly breadcrumbVariant = input<BreadcrumbVariant>("button");

  /** Accessible label for the navigation landmark. */
  public readonly ariaLabel = input<string>("Page navigation");

  /** Whether the drawer should always be visible (desktop layout). */
  public readonly sidebarPinned = input(true);

  // ── Models ──────────────────────────────────────────────────────────

  /** The currently active page id. Supports two-way binding. */
  public readonly activePage = model<string>("");

  /** Whether the drawer is open (when not pinned). Supports two-way binding. */
  public readonly drawerOpen = model(false);

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emitted when the user navigates to a page. */
  public readonly navigated = output<NavigationPageItem>();

  // ── Content queries ─────────────────────────────────────────────────

  /**
   * Projected template for the main content area.
   * Receives the current {@link NavigationPageItem} as the implicit context.
   *
   * ```html
   * <ng-template #content let-page>
   *   <h2>{{ page.label }}</h2>
   * </ng-template>
   * ```
   */
  public readonly contentTemplate =
    contentChild<TemplateRef<NavigationPageContext>>("content");

  /** Projected sidebar items for custom content above the generated items. */
  public readonly projectedItems = contentChildren(UISidebarItem);

  // ── Computed ────────────────────────────────────────────────────────

  /** The currently active page object. */
  public readonly currentPage = computed(() => {
    const id = this.activePage();
    return this.pages().find((p) => p.id === id) ?? this.pages()[0];
  });

  /** Pages that are not in any group (top-level items). */
  protected readonly topLevelPages = computed(() =>
    this.pages().filter((p) => !p.group),
  );

  /** Resolved group definitions with their child pages. */
  protected readonly resolvedGroups = computed(() =>
    this.groups().map((g) => ({
      ...g,
      children: this.pages().filter((p) => p.group === g.id),
    })),
  );

  /** Breadcrumb trail derived from the active page. */
  protected readonly breadcrumbItems = computed<readonly BreadcrumbItem[]>(
    () => {
      const current = this.currentPage();
      if (!current) {
        return [{ label: this.rootLabel() }];
      }

      const items: BreadcrumbItem[] = [
        { label: this.rootLabel(), url: "/" },
      ];

      // If the page belongs to a group, add the group as an intermediate crumb
      if (current.group) {
        const group = this.groups().find((g) => g.id === current.group);
        if (group) {
          items.push({ label: group.label });
        }
      }

      items.push({ label: current.label });
      return items;
    },
  );

  // ── Public methods ──────────────────────────────────────────────────

  /** Navigate to a page by its definition. */
  public navigate(page: NavigationPageItem): void {
    if (page.disabled) {
      return;
    }
    this.activePage.set(page.id);
    this.navigated.emit(page);

    // Auto-close drawer on navigation when not pinned
    if (!this.sidebarPinned()) {
      this.drawerOpen.set(false);
    }
  }

  /** Navigate to the first page (root breadcrumb click handler). */
  public navigateToRoot(): void {
    const first = this.pages()[0];
    if (first) {
      this.navigate(first);
    }
  }

  /** @internal Handle breadcrumb item clicks. */
  protected onBreadcrumbClick(item: BreadcrumbItem): void {
    if (item.url === "/") {
      this.navigateToRoot();
      return;
    }
    // Try to find a page matching the breadcrumb label
    const page = this.pages().find((p) => p.label === item.label);
    if (page) {
      this.navigate(page);
    }
  }
}

/** Template context for the projected content template. */
export interface NavigationPageContext {
  /** The currently active page. */
  readonly $implicit: NavigationPageItem;
  /** The currently active page (named binding). */
  readonly page: NavigationPageItem;
}
