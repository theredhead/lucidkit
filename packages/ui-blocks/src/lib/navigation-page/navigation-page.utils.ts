import type { TreeNode } from "@theredhead/ui-kit";

import type { NavigationNodeData } from "./navigation-page.component";

/**
 * Convenience type alias for a navigation tree node.
 *
 * A `NavigationNode` is a {@link TreeNode} whose data payload is
 * {@link NavigationNodeData}. Leaf nodes render as sidebar items;
 * nodes with `children` render as collapsible sidebar groups.
 */
export type NavigationNode = TreeNode<NavigationNodeData>;

// ── Factory helpers ──────────────────────────────────────────────────

/**
 * Creates a leaf navigation node (sidebar item).
 *
 * @param id    - Unique identifier (also used as the active-page key).
 * @param label - Display text in the sidebar and breadcrumb.
 * @param options - Optional icon, badge, route, and disabled state.
 * @returns A {@link NavigationNode} without children.
 *
 * @example
 * ```ts
 * navItem('dashboard', 'Dashboard', {
 *   icon: UIIcons.Lucide.Layout.LayoutDashboard,
 *   badge: '3',
 * })
 * ```
 */
export function navItem(
  id: string,
  label: string,
  options?: {
    readonly icon?: string;
    readonly badge?: string;
    readonly route?: string;
    readonly disabled?: boolean;
  },
): NavigationNode {
  return {
    id,
    data: {
      label,
      badge: options?.badge,
      route: options?.route,
    },
    icon: options?.icon,
    disabled: options?.disabled,
  };
}

/**
 * Creates a group navigation node (collapsible sidebar group).
 *
 * @param id       - Unique identifier for the group.
 * @param label    - Display text for the group header.
 * @param children - Child navigation nodes rendered inside the group.
 * @param options  - Optional icon and expanded state.
 * @returns A {@link NavigationNode} with children.
 *
 * @example
 * ```ts
 * navGroup('settings', 'Settings', [
 *   navItem('general', 'General'),
 *   navItem('security', 'Security'),
 * ], { icon: UIIcons.Lucide.Account.Settings })
 * ```
 */
export function navGroup(
  id: string,
  label: string,
  children: readonly NavigationNode[],
  options?: {
    readonly icon?: string;
    readonly expanded?: boolean;
  },
): NavigationNode {
  return {
    id,
    data: { label },
    icon: options?.icon,
    expanded: options?.expanded ?? true,
    children: [...children],
  };
}

// ── Router integration ───────────────────────────────────────────────

/**
 * Shape of a route entry compatible with Angular's `Route` type.
 *
 * This is intentionally a structural type so consumers can pass
 * `inject(Router).config` directly without the library depending
 * on `@angular/router`.
 *
 * Routes are only included in the output when they carry
 * `data.navLabel`. Additional metadata keys:
 *
 * | Key             | Type      | Maps to                      |
 * |-----------------|-----------|------------------------------|
 * | `navLabel`      | `string`  | `data.label`                 |
 * | `navIcon`       | `string`  | `node.icon`                  |
 * | `navBadge`      | `string`  | `data.badge`                 |
 * | `navDisabled`   | `boolean` | `node.disabled`              |
 * | `navExpanded`   | `boolean` | `node.expanded` (for groups) |
 */
export interface NavigationRouteConfig {
  readonly path?: string;
  readonly data?: Readonly<Record<string, unknown>>;
  readonly children?: readonly NavigationRouteConfig[];
}

/**
 * Converts an Angular-Router-compatible route config array into
 * {@link NavigationNode NavigationNode[]} for use with
 * {@link UINavigationPage}.
 *
 * Only routes that include `data: { navLabel: '…' }` are emitted.
 * Child routes are recursively processed, producing group nodes
 * when a parent has navigable children.
 *
 * @param routes     - The route configuration (e.g. `inject(Router).config`).
 * @param parentPath - Internal: accumulated path prefix for nested routes.
 * @returns An array of navigation tree nodes.
 *
 * @example
 * ```ts
 * // In your app component:
 * private readonly router = inject(Router);
 * readonly navItems = routesToNavigation(this.router.config);
 * ```
 */
export function routesToNavigation(
  routes: readonly NavigationRouteConfig[],
  parentPath = "",
): NavigationNode[] {
  const nodes: NavigationNode[] = [];

  for (const route of routes) {
    const data = route.data;
    if (!data?.["navLabel"]) {
      // Skip routes without navigation metadata, but recurse into children
      if (route.children?.length) {
        const childPath = joinPath(parentPath, route.path);
        nodes.push(...routesToNavigation(route.children, childPath));
      }
      continue;
    }

    const fullPath = joinPath(parentPath, route.path);
    const children = route.children
      ? routesToNavigation(route.children, fullPath)
      : undefined;

    nodes.push({
      id: fullPath || "/",
      data: {
        label: data["navLabel"] as string,
        badge: (data["navBadge"] as string) ?? undefined,
        route: fullPath || "/",
      },
      icon: (data["navIcon"] as string) ?? undefined,
      disabled: (data["navDisabled"] as boolean) ?? false,
      expanded: (data["navExpanded"] as boolean) ?? true,
      children: children?.length ? children : undefined,
    });
  }

  return nodes;
}

/** @internal Join two path segments, avoiding double slashes. */
function joinPath(parent: string, segment?: string): string {
  if (!segment) {
    return parent;
  }
  if (!parent) {
    return segment;
  }
  return `${parent}/${segment}`.replace(/\/+/g, "/");
}
