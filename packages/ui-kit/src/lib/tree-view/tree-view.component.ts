import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  type Predicate,
} from "@angular/core";

import { UITreeNode } from "./tree-node.component";
import {
  TreeKeyboardHandler,
  type TreeKeyboardDelegate,
} from "./tree-keyboard-handler";
import type { ITreeDatasource, TreeNode } from "./tree-view.types";
import { UISurface } from "@theredhead/foundation";

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
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-tree-view",
    role: "tree",
    tabindex: "0",
    "[attr.aria-label]": "ariaLabel()",
    "aria-multiselectable": "true",
    "[class.disabled]": "disabled()",
    "(keydown)": "onKeydown($event)",
  },
})
export class UITreeView<T = unknown> implements TreeKeyboardDelegate {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Whether the tree view is disabled. */
  public readonly disabled = input<boolean>(false);

  /** The datasource providing the tree structure. */
  public readonly datasource = input.required<ITreeDatasource<T>>();

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

  /**
   * Optional comparator for sorting tree nodes at all levels.
   *
   * When set, nodes are sorted at the root level and all descendants
   * are recursively sorted using this comparator. The comparator receives
   * two TreeNode<T> values and should return a negative, zero, or positive number
   * indicating their sort order.
   *
   * Pass `undefined` or `null` to clear the sort and restore insertion order.
   *
   * @example
   * ```ts
   * sortComparator: (a, b) => a.data.name.localeCompare(b.data.name)
   * ```
   */
  public readonly sortComparator = input<
    ((a: TreeNode<T>, b: TreeNode<T>) => number) | null | undefined
  >(undefined);

  // ── Model ───────────────────────────────────────────────────────────

  /**
   * The currently selected node(s). Two-way bindable via `[(selected)]`.
   *
   * - Arrow keys replace the selection with the cursor node.
   * - Shift + arrows extend the selection.
   * - Ctrl / ⌘ + click toggles individual nodes.
   * - Escape clears the selection.
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

  /** The cursor node ID — the node with keyboard focus. @internal */
  protected readonly cursorId = signal<string | null>(null);

  /**
   * Extracted keyboard-navigation handler.
   * @internal
   */
  private readonly keyboardHandler = new TreeKeyboardHandler(this);

  /** @internal */
  private readonly el = inject(ElementRef<HTMLElement>);

  // ── Computed ────────────────────────────────────────────────────────

  /** The root nodes from the datasource (filtered and sorted when predicates/comparators are set). @internal */
  protected readonly rootNodes = computed<TreeNode<T>[]>(() => {
    const ds = this.datasource();
    let roots = ds.getRootNodes();
    // Only synchronous for now — async support can be added later
    if (!Array.isArray(roots)) return [];

    const predicate = this.filterPredicate();
    if (predicate) {
      roots = this.filterTree(roots, predicate, ds);
    }

    const comparator = this.sortComparator();
    if (comparator) {
      roots = this.sortTree(roots, comparator);
    }

    return roots;
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

  /** Selects the given node, replacing any existing selection. */
  public select(node: TreeNode<T>): void {
    if (node.disabled) return;
    this.selected.set([node]);
    this.cursorId.set(node.id);
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
  protected onNodeClick(payload: {
    node: TreeNode<T>;
    event: MouseEvent;
  }): void {
    const { node, event } = payload;
    if (node.disabled) return;
    if (event.ctrlKey || event.metaKey) {
      // Ctrl / ⌘ + click — toggle this node in the selection
      if (this.isSelected(node)) {
        this.selected.set(this.selected().filter((n) => n.id !== node.id));
      } else {
        this.selected.set([...this.selected(), node]);
      }
    } else {
      // Plain click — replace selection
      this.selected.set([node]);
    }
    this.cursorId.set(node.id);
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
    this.keyboardHandler.handleKeydown(event);

    // Move browser focus to the tree host so the previously focused
    // node-row loses its :focus-visible outline. The visual cursor is
    // managed entirely via the --focused host class.
    this.el.nativeElement.focus({ preventScroll: true });
  }

  // ── TreeKeyboardDelegate implementation ─────────────────────────

  /** @internal */
  public hasCursor(): boolean {
    return this.cursorId() !== null;
  }

  /** @internal */
  public isCursorExpanded(): boolean {
    const id = this.cursorId();
    return id !== null && this.expandedIds().has(id);
  }

  /** @internal */
  public cursorHasChildren(): boolean {
    const node = this.findCursorNode();
    return node !== null && this.datasource().hasChildren(node);
  }

  /** @internal */
  public moveCursorDown(extend: boolean): void {
    const { visible, currentIdx } = this.resolveNavigation();
    if (visible.length === 0) return;
    const nextIdx = Math.min(currentIdx + 1, visible.length - 1);
    this.setCursorAndSelect(visible[nextIdx].node, extend);
  }

  /** @internal */
  public moveCursorUp(extend: boolean): void {
    const { visible, currentIdx } = this.resolveNavigation();
    if (visible.length === 0) return;
    const prevIdx = Math.max(currentIdx - 1, 0);
    this.setCursorAndSelect(visible[prevIdx].node, extend);
  }

  /** @internal */
  public moveCursorToFirst(extend: boolean): void {
    const visible = this.buildVisibleNodes();
    if (visible.length === 0) return;
    this.setCursorAndSelect(visible[0].node, extend);
  }

  /** @internal */
  public moveCursorToLast(extend: boolean): void {
    const visible = this.buildVisibleNodes();
    if (visible.length === 0) return;
    this.setCursorAndSelect(visible[visible.length - 1].node, extend);
  }

  /** @internal */
  public moveCursorToParent(): void {
    const { visible, currentIdx } = this.resolveNavigation();
    if (currentIdx < 0) return;
    const { level } = visible[currentIdx];
    if (level > 0) {
      for (let i = currentIdx - 1; i >= 0; i--) {
        if (visible[i].level < level) {
          this.setCursorAndSelect(visible[i].node, false);
          break;
        }
      }
    }
  }

  /** @internal */
  public expandCursor(): void {
    const node = this.findCursorNode();
    if (node) this.expand(node);
  }

  /** @internal */
  public collapseCursor(): void {
    const node = this.findCursorNode();
    if (node) this.collapse(node);
  }

  /** @internal */
  public activateCursor(): void {
    const node = this.findCursorNode();
    if (node) this.nodeActivated.emit(node);
  }

  /** @internal */
  public clearSelection(): void {
    this.selected.set([]);
    this.cursorId.set(null);
  }

  // ── Private helpers ────────────────────────────────────────────────

  /**
   * Sets the cursor to the given node and updates selection.
   *
   * - `extend = false`: selection is replaced with `[node]`.
   * - `extend = true` (Shift): node is added to the existing selection.
   * @internal
   */
  private setCursorAndSelect(node: TreeNode<T>, extend: boolean): void {
    this.cursorId.set(node.id);
    if (node.disabled) return;
    if (extend) {
      if (!this.isSelected(node)) {
        this.selected.set([...this.selected(), node]);
      }
    } else {
      this.selected.set([node]);
    }
  }

  /**
   * Builds a flat list of visible nodes honouring expand state.
   * @internal
   */
  private buildVisibleNodes(): { node: TreeNode<T>; level: number }[] {
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
   * Returns the visible node list and the index of the cursor node.
   * @internal
   */
  private resolveNavigation(): {
    visible: { node: TreeNode<T>; level: number }[];
    currentIdx: number;
  } {
    const visible = this.buildVisibleNodes();
    const id = this.cursorId();
    const currentIdx = id ? visible.findIndex((v) => v.node.id === id) : -1;
    return { visible, currentIdx };
  }

  /**
   * Finds the cursor node in the visible tree.
   * @internal
   */
  private findCursorNode(): TreeNode<T> | null {
    const id = this.cursorId();
    if (!id) return null;
    const visible = this.buildVisibleNodes();
    return visible.find((v) => v.node.id === id)?.node ?? null;
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

  /**
   * Recursively sorts a tree, applying the comparator at each level
   * (root nodes and all descendants).
   *
   * @internal
   */
  private sortTree(
    nodes: TreeNode<T>[],
    comparator: (a: TreeNode<T>, b: TreeNode<T>) => number,
  ): TreeNode<T>[] {
    const result: TreeNode<T>[] = [];

    for (const node of nodes) {
      const clone: TreeNode<T> = { ...node };

      // Recursively sort children if they exist
      if (node.children && node.children.length > 0) {
        clone.children = this.sortTree(node.children, comparator);
      }

      result.push(clone);
    }

    // Sort at this level
    return result.sort(comparator);
  }
}
