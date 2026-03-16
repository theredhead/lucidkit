import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  model,
  output,
  signal,
  TemplateRef,
  type Predicate,
} from "@angular/core";

import { UITreeNode } from "./tree-node.component";
import type {
  ITreeDatasource,
  TreeNode,
  TreeSelectionMode,
} from "./tree-view.types";

/**
 * Context provided to a custom node template.
 *
 * @typeParam T - The data payload type.
 */
export interface TreeNodeContext<T = unknown> {
  /** The tree node (also available as the implicit `let-node`). */
  $implicit: TreeNode<T>;
  /** The depth level (0 = root). */
  level: number;
  /** Whether the node is currently expanded. */
  expanded: boolean;
  /** Whether the node has children. */
  hasChildren: boolean;
}

/**
 * A hierarchical tree-view component driven by an {@link ITreeDatasource}.
 *
 * Supports expand/collapse, single/multiple selection, keyboard
 * navigation (arrows, Enter, Space), ARIA tree pattern, and optional
 * custom node templates via content projection.
 *
 * ### Basic usage
 * ```html
 * <ui-tree-view [datasource]="ds" [displayWith]="nodeLabel" />
 * ```
 *
 * ### With custom template
 * ```html
 * <ui-tree-view [datasource]="ds">
 *   <ng-template #nodeTemplate let-node>
 *     <ui-icon [svg]="node.icon" [size]="16" />
 *     <span>{{ node.data.name }}</span>
 *   </ng-template>
 * </ui-tree-view>
 * ```
 */
@Component({
  selector: "ui-tree-view",
  standalone: true,
  imports: [UITreeNode],
  templateUrl: "./tree-view.component.html",
  styleUrl: "./tree-view.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-tree-view",
    role: "tree",
    tabindex: "0",
    "[attr.aria-label]": "ariaLabel()",
    "[attr.aria-multiselectable]": "selectionMode() === 'multiple' || null",
    "(keydown)": "onKeydown($event)",
  },
})
export class UITreeView<T = unknown> {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** The datasource providing the tree structure. */
  public readonly datasource = input.required<ITreeDatasource<T>>();

  /** How selection is handled. Defaults to `'single'`. */
  public readonly selectionMode = input<TreeSelectionMode>("single");

  /** Accessible label for the tree. */
  public readonly ariaLabel = input<string>("Tree view");

  /**
   * Function that returns a display string for a node's data.
   * Used when no custom `#nodeTemplate` is projected.
   * Defaults to `String(node.data)`.
   */
  public readonly displayWith = input<(data: T) => string>((data: T) =>
    String(data),
  );

  /**
   * Optional predicate applied to each node's data payload.
   *
   * When set, only nodes that satisfy the predicate (or whose
   * descendants satisfy it) are rendered. Ancestor nodes of matching
   * descendants are kept visible and auto-expanded so the user can
   * see the full path.
   *
   * Pass `undefined` or `null` to clear the filter.
   */
  public readonly filterPredicate = input<Predicate<T> | null | undefined>(
    undefined,
  );

  // ── Model ───────────────────────────────────────────────────────────

  /**
   * The currently selected node(s). Two-way bindable via `[(selected)]`.
   *
   * In `single` mode this will contain at most one node.
   * In `multiple` mode it may contain many.
   * In `none` mode it will always be empty.
   */
  public readonly selected = model<readonly TreeNode<T>[]>([]);

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emits the node when a node is expanded. */
  public readonly nodeExpanded = output<TreeNode<T>>();

  /** Emits the node when a node is collapsed. */
  public readonly nodeCollapsed = output<TreeNode<T>>();

  /** Emits when a node is activated (double-click or Enter on selected node). */
  public readonly nodeActivated = output<TreeNode<T>>();

  // ── Content query ───────────────────────────────────────────────────

  /**
   * Optional consumer-projected template for rendering each node's content.
   * Receives {@link TreeNodeContext} as its context.
   */
  public readonly nodeTemplate =
    contentChild<TemplateRef<TreeNodeContext<T>>>("nodeTemplate");

  // ── Internal state ──────────────────────────────────────────────────

  /** Set of expanded node IDs. @internal */
  protected readonly expandedIds = signal(new Set<string>());

  /** The currently focused node ID (for keyboard navigation). @internal */
  protected readonly focusedNodeId = signal<string | null>(null);

  // ── Computed ────────────────────────────────────────────────────────

  /** The root nodes from the datasource (filtered when a predicate is set). @internal */
  protected readonly rootNodes = computed<TreeNode<T>[]>(() => {
    const ds = this.datasource();
    const roots = ds.getRootNodes();
    // Only synchronous for now — async support can be added later
    if (!Array.isArray(roots)) return [];

    const predicate = this.filterPredicate();
    if (!predicate) return roots;

    return this.filterTree(roots, predicate, ds);
  });

  // ── Public methods ──────────────────────────────────────────────────

  /** Expands the given node. */
  public expand(node: TreeNode<T>): void {
    if (node.disabled) return;
    const ds = this.datasource();
    if (!ds.hasChildren(node)) return;

    this.expandedIds.update((ids) => {
      const next = new Set(ids);
      next.add(node.id);
      return next;
    });
    this.nodeExpanded.emit(node);
  }

  /** Collapses the given node. */
  public collapse(node: TreeNode<T>): void {
    this.expandedIds.update((ids) => {
      const next = new Set(ids);
      next.delete(node.id);
      return next;
    });
    this.nodeCollapsed.emit(node);
  }

  /** Toggles the expanded state of the given node. */
  public toggleExpand(node: TreeNode<T>): void {
    if (this.isExpanded(node)) {
      this.collapse(node);
    } else {
      this.expand(node);
    }
  }

  /** Returns whether the given node is currently expanded. */
  public isExpanded(node: TreeNode<T>): boolean {
    return this.expandedIds().has(node.id);
  }

  /** Returns whether the given node is currently selected. */
  public isSelected(node: TreeNode<T>): boolean {
    return this.selected().some((n) => n.id === node.id);
  }

  /** Selects the given node according to the current selection mode. */
  public select(node: TreeNode<T>): void {
    if (node.disabled || this.selectionMode() === "none") return;

    if (this.selectionMode() === "single") {
      this.selected.set([node]);
    } else {
      // Multiple — toggle
      if (this.isSelected(node)) {
        this.selected.set(this.selected().filter((n) => n.id !== node.id));
      } else {
        this.selected.set([...this.selected(), node]);
      }
    }
  }

  /**
   * Expands all nodes in the tree recursively.
   */
  public expandAll(): void {
    const ids = new Set<string>();
    const ds = this.datasource();
    const collect = (nodes: TreeNode<T>[]): void => {
      for (const node of nodes) {
        if (ds.hasChildren(node)) {
          ids.add(node.id);
          const children = ds.getChildren(node);
          if (Array.isArray(children)) collect(children);
        }
      }
    };
    const roots = ds.getRootNodes();
    if (Array.isArray(roots)) collect(roots);
    this.expandedIds.set(ids);
  }

  /** Collapses all nodes in the tree. */
  public collapseAll(): void {
    this.expandedIds.set(new Set());
  }

  // ── Protected methods (template helpers) ────────────────────────────

  /** @internal — handles node click from UITreeNode. */
  protected onNodeClick(node: TreeNode<T>): void {
    this.select(node);
    this.focusedNodeId.set(node.id);
  }

  /** @internal — handles node double-click. */
  protected onNodeDblClick(node: TreeNode<T>): void {
    this.nodeActivated.emit(node);
  }

  /** @internal — handles toggle-expand from UITreeNode. */
  protected onToggleExpand(node: TreeNode<T>): void {
    this.toggleExpand(node);
  }

  /** @internal — handles keyboard events on the tree. */
  protected onKeydown(event: KeyboardEvent): void {
    const visible = this.getVisibleNodes();
    if (visible.length === 0) return;

    const focusedId = this.focusedNodeId();
    const currentIdx = focusedId
      ? visible.findIndex((v) => v.node.id === focusedId)
      : -1;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const nextIdx = Math.min(currentIdx + 1, visible.length - 1);
        this.focusedNodeId.set(visible[nextIdx].node.id);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prevIdx = Math.max(currentIdx - 1, 0);
        this.focusedNodeId.set(visible[prevIdx].node.id);
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        if (currentIdx >= 0) {
          const { node } = visible[currentIdx];
          if (this.datasource().hasChildren(node) && !this.isExpanded(node)) {
            this.expand(node);
          } else {
            // Move to first child
            const nextIdx = Math.min(currentIdx + 1, visible.length - 1);
            this.focusedNodeId.set(visible[nextIdx].node.id);
          }
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (currentIdx >= 0) {
          const { node, level } = visible[currentIdx];
          if (this.isExpanded(node)) {
            this.collapse(node);
          } else if (level > 0) {
            // Move to parent
            for (let i = currentIdx - 1; i >= 0; i--) {
              if (visible[i].level < level) {
                this.focusedNodeId.set(visible[i].node.id);
                break;
              }
            }
          }
        }
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (currentIdx >= 0) {
          const { node } = visible[currentIdx];
          if (this.isSelected(node)) {
            this.nodeActivated.emit(node);
          } else {
            this.select(node);
          }
        }
        break;
      }
      case " ": {
        event.preventDefault();
        if (currentIdx >= 0) {
          this.select(visible[currentIdx].node);
        }
        break;
      }
      case "Home": {
        event.preventDefault();
        if (visible.length > 0) {
          this.focusedNodeId.set(visible[0].node.id);
        }
        break;
      }
      case "End": {
        event.preventDefault();
        if (visible.length > 0) {
          this.focusedNodeId.set(visible[visible.length - 1].node.id);
        }
        break;
      }
    }
  }

  // ── Private helpers ────────────────────────────────────────────────

  /**
   * Builds a flat list of visible nodes (honoring expand state) for
   * keyboard navigation.
   */
  private getVisibleNodes(): { node: TreeNode<T>; level: number }[] {
    const result: { node: TreeNode<T>; level: number }[] = [];
    const ds = this.datasource();

    const walk = (nodes: TreeNode<T>[], level: number): void => {
      for (const node of nodes) {
        result.push({ node, level });
        if (this.isExpanded(node)) {
          const children = ds.getChildren(node);
          if (Array.isArray(children)) {
            walk(children, level + 1);
          }
        }
      }
    };

    const roots = ds.getRootNodes();
    if (Array.isArray(roots)) walk(roots, 0);
    return result;
  }

  /**
   * Recursively filters a tree, keeping nodes whose data matches the
   * predicate or whose descendants match. Ancestor nodes of matching
   * descendants are preserved and marked as expanded so the match is
   * visible.
   */
  private filterTree(
    nodes: TreeNode<T>[],
    predicate: Predicate<T>,
    ds: ITreeDatasource<T>,
  ): TreeNode<T>[] {
    const result: TreeNode<T>[] = [];

    for (const node of nodes) {
      const selfMatch = predicate(node.data);

      // Recursively filter children
      const rawChildren = ds.getChildren(node);
      const filteredChildren = Array.isArray(rawChildren)
        ? this.filterTree(rawChildren, predicate, ds)
        : [];

      if (selfMatch || filteredChildren.length > 0) {
        // Keep the node — if children matched, auto-expand
        const clone: TreeNode<T> = {
          ...node,
          children:
            filteredChildren.length > 0 ? filteredChildren : node.children,
          expanded: filteredChildren.length > 0 ? true : node.expanded,
        };
        result.push(clone);

        // Also add to expanded IDs so the tree renders them open
        if (filteredChildren.length > 0) {
          this.expandedIds.update((ids) => {
            if (ids.has(node.id)) return ids;
            const next = new Set(ids);
            next.add(node.id);
            return next;
          });
        }
      }
    }

    return result;
  }
}
