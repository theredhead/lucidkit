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
  type ITreeDatasource,
  type TreeNode,
  UIBreadcrumb,
  UIButton,
  UIDrawer,
  UIIcon,
  UIIcons,
  UISidebarGroup,
  UISidebarItem,
  UISidebarNav,
} from "@theredhead/ui-kit";
import { ArrayTreeDatasource, UISurface } from "@theredhead/foundation";

import type { NavigationNode } from "./navigation-page.utils";

// ── Types ────────────────────────────────────────────────────────────

/**
 * Data payload carried by each node in the navigation tree.
 *
 * The structural properties (`id`, `icon`, `disabled`, `expanded`,
 * `children`) live on the {@link TreeNode} wrapper; this interface
 * holds the domain-specific fields.
 */
export interface NavigationNodeData {
  /** Display label shown in the sidebar and breadcrumb trail. */
  readonly label: string;

  /**
   * Optional trailing badge text (e.g. an unread count).
   * Forwarded to the sidebar item's `[badge]` input.
   */
  readonly badge?: string;

  /**
   * Optional route path for Angular Router integration.
   *
   * When items are produced by `routesToNavigation()`, this is set
   * to the full resolved path segment. Consumers can use it in the
   * `(navigated)` handler to call `router.navigate()`.
   */
  readonly route?: string;
}

/** Template context for the projected content template. */
export interface NavigationPageContext {
  /** The currently active navigation node. */
  readonly $implicit: NavigationNode;
  /** The currently active navigation node (named binding). */
  readonly page: NavigationNode;
}

// ── Component ────────────────────────────────────────────────────────

/**
 * A full-page navigation layout that combines a {@link UIDrawer},
 * a {@link UISidebarNav} with configurable items, a {@link UIBreadcrumb}
 * path, and a main content area.
 *
 * Navigation items are provided as a tree — either via an
 * {@link ITreeDatasource} for dynamic data, or via a convenience
 * `items` input accepting `NavigationNode[]`.
 *
 * Tree nodes with **children** are rendered as collapsible
 * `<ui-sidebar-group>` elements; leaf nodes render as
 * `<ui-sidebar-item>` entries. The breadcrumb trail is built
 * automatically from the node hierarchy.
 *
 * ### Data sources
 *
 * | Input        | Type                                     | Use case                     |
 * |--------------|------------------------------------------|------------------------------|
 * | `datasource` | `ITreeDatasource<NavigationNodeData>`     | Dynamic / async data         |
 * | `items`      | `NavigationNode[]`                       | Static in-memory tree        |
 *
 * When both are set, `datasource` takes precedence.
 *
 * Use the `navItem()` and `navGroup()` factory functions (or
 * `routesToNavigation()` for Angular Router integration) to build
 * the node array ergonomically.
 *
 * @example
 * ```html
 * <ui-navigation-page
 *   [items]="navItems"
 *   [(activePage)]="currentPage"
 *   (navigated)="onNavigate($event)"
 * >
 *   <ng-template #content let-node>
 *     <h2>{{ node.data.label }}</h2>
 *   </ng-template>
 * </ui-navigation-page>
 * ```
 */
@Component({
  selector: "ui-navigation-page",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    UIButton,
    UIDrawer,
    UIIcon,
    UISidebarNav,
    UISidebarItem,
    UISidebarGroup,
    UIBreadcrumb,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  templateUrl: "./navigation-page.component.html",
  styleUrl: "./navigation-page.component.scss",
  host: {
    class: "ui-navigation-page",
    "[class.ui-navigation-page--drawer-open]": "drawerOpen()",
    "[class.ui-navigation-page--sidebar-hidden]": "!sidebarVisible()",
  },
})
export class UINavigationPage {
  // ── Inputs ──────────────────────────────────────────────────────────

  /**
   * Tree datasource providing navigation nodes.
   *
   * Accepts any {@link ITreeDatasource} whose data payload is
   * {@link NavigationNodeData}. Root nodes with `children` render as
   * collapsible groups; leaf nodes render as sidebar items.
   *
   * Takes precedence over the `items` convenience input.
   */
  public readonly datasource = input<
    ITreeDatasource<NavigationNodeData> | undefined
  >(undefined);

  /**
   * Convenience: static array of navigation tree nodes.
   *
   * When set (and no `datasource` is provided), an internal
   * `ArrayTreeDatasource` is created automatically.
   *
   * Build nodes with the `navItem()` / `navGroup()` factories
   * or the `routesToNavigation()` utility.
   */
  public readonly items = input<readonly NavigationNode[]>([]);

  /**
   * Root breadcrumb label displayed as the first item in the trail.
   * Clicking it navigates to the first leaf node.
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

  /** Whether to show the sidebar toggle button before the breadcrumb. */
  public readonly showSidebarToggle = input(true);

  // ── Models ──────────────────────────────────────────────────────────

  /** The currently active node id. Supports two-way binding. */
  public readonly activePage = model<string>("");

  /** Whether the drawer is open (when not pinned). Supports two-way binding. */
  public readonly drawerOpen = model(false);

  /** Whether the sidebar panel is visible. Supports two-way binding. Defaults to shown. */
  public readonly sidebarVisible = model(true);

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emitted when the user navigates to a node. */
  public readonly navigated = output<NavigationNode>();

  // ── Content queries ─────────────────────────────────────────────────

  /**
   * Projected template for the main content area.
   * Receives the current {@link NavigationNode} as the implicit context.
   *
   * ```html
   * <ng-template #content let-node>
   *   <h2>{{ node.data.label }}</h2>
   * </ng-template>
   * ```
   */
  public readonly contentTemplate =
    contentChild<TemplateRef<NavigationPageContext>>("content");

  /** Projected sidebar items for custom content above the generated items. */
  public readonly projectedItems = contentChildren(UISidebarItem);

  // ── Computed ────────────────────────────────────────────────────────

  /** Icon for the sidebar toggle button. @internal */
  protected readonly sidebarToggleIcon = computed(() =>
    this.sidebarVisible()
      ? UIIcons.Lucide.Arrows.PanelLeftClose
      : UIIcons.Lucide.Arrows.PanelLeftOpen,
  );

  /** Resolved datasource — from the input or auto-created from items. */
  protected readonly resolvedDatasource = computed(() => {
    const ds = this.datasource();
    if (ds) {
      return ds;
    }
    return new ArrayTreeDatasource<NavigationNodeData>(
      this.items() as TreeNode<NavigationNodeData>[],
    );
  });

  /** Root nodes from the resolved datasource. */
  protected readonly rootNodes = computed<readonly NavigationNode[]>(() => {
    const ds = this.resolvedDatasource();
    const roots = ds.getRootNodes();
    // Support only synchronous datasources for now
    return Array.isArray(roots) ? roots : [];
  });

  /** The currently active navigation node. */
  public readonly currentPage = computed(() => {
    const id = this.activePage();
    return this.findNodeById(id, this.rootNodes()) ?? this.firstLeaf();
  });

  /** Breadcrumb trail derived from the active node and its ancestors. */
  protected readonly breadcrumbItems = computed<readonly BreadcrumbItem[]>(
    () => {
      const current = this.currentPage();
      if (!current) {
        return [{ label: this.rootLabel() }];
      }

      const items: BreadcrumbItem[] = [{ label: this.rootLabel(), url: "/" }];

      // If the node is a child of a group, add the group crumb
      const parent = this.findParent(current.id, this.rootNodes());
      if (parent) {
        items.push({ label: parent.data.label });
      }

      items.push({ label: current.data.label });
      return items;
    },
  );

  // ── Public methods ──────────────────────────────────────────────────

  /** Navigate to a node by its tree-node reference. */
  public navigate(node: NavigationNode): void {
    if (node.disabled) {
      return;
    }
    this.activePage.set(node.id);
    this.navigated.emit(node);

    // Auto-close drawer on navigation when not pinned
    if (!this.sidebarPinned()) {
      this.drawerOpen.set(false);
    }
  }

  /** Navigate to the first leaf node (root breadcrumb click handler). */
  public navigateToRoot(): void {
    const first = this.firstLeaf();
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
    // Try to find a node matching the breadcrumb label
    const node = this.findNodeByLabel(item.label, this.rootNodes());
    if (node) {
      this.navigate(node);
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────

  /**
   * Finds a node by `id` anywhere in the tree (depth-first).
   * @internal
   */
  private findNodeById(
    id: string,
    nodes: readonly NavigationNode[],
  ): NavigationNode | undefined {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children?.length) {
        const found = this.findNodeById(id, node.children);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  /**
   * Finds a node by `data.label` anywhere in the tree (depth-first).
   * @internal
   */
  private findNodeByLabel(
    label: string,
    nodes: readonly NavigationNode[],
  ): NavigationNode | undefined {
    for (const node of nodes) {
      if (node.data.label === label) {
        return node;
      }
      if (node.children?.length) {
        const found = this.findNodeByLabel(label, node.children);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  /**
   * Finds the parent node of a given child `id`.
   * @internal
   */
  private findParent(
    childId: string,
    nodes: readonly NavigationNode[],
  ): NavigationNode | undefined {
    for (const node of nodes) {
      if (node.children?.some((c) => c.id === childId)) {
        return node;
      }
      if (node.children?.length) {
        const found = this.findParent(childId, node.children);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  /**
   * Returns the first leaf node (no children) in the tree.
   * @internal
   */
  private firstLeaf(): NavigationNode | undefined {
    const roots = this.rootNodes();
    for (const node of roots) {
      if (!node.children?.length) {
        return node;
      }
      // First child of a group
      const leaf = node.children.find((c) => !c.children?.length);
      if (leaf) {
        return leaf;
      }
    }
    return roots[0];
  }
}
