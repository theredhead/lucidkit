import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { UIIcon } from "../icon/icon.component";
import type { TreeNodeContext } from "./tree-view.component";
import type { ITreeDatasource, TreeNode } from "./tree-view.types";

/**
 * Recursive node renderer for {@link UITreeView}.
 *
 * Renders a single tree item with an expand/collapse toggle, optional
 * icon, label (or custom template), and recursively renders children
 * when the node is expanded.
 *
 * @internal — consumed by `UITreeView`; not intended for direct use.
 */
@Component({
  selector: "ui-tree-node",
  standalone: true,
  imports: [NgTemplateOutlet, UIIcon],
  templateUrl: "./tree-node.component.html",
  styleUrl: "./tree-node.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-tree-node",
    role: "treeitem",
    "[attr.aria-expanded]": "hasChildren() ? isExpanded() : null",
    "[attr.aria-selected]": "isSelected()",
    "[attr.aria-disabled]": "node().disabled || null",
    "[attr.aria-level]": "level() + 1",
    "[class.ui-tree-node--selected]": "isSelected()",
    "[class.ui-tree-node--focused]": "isFocused()",
    "[class.ui-tree-node--disabled]": "node().disabled",
    "[class.ui-tree-node--leaf]": "!hasChildren()",
  },
})
export class UITreeNode<T = unknown> {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** The tree node to render. */
  public readonly node = input.required<TreeNode<T>>();

  /** Depth level (0 = root). */
  public readonly level = input.required<number>();

  /** The tree datasource (for child resolution). */
  public readonly datasource = input.required<ITreeDatasource<T>>();

  /** Whether this node is currently expanded. */
  public readonly isExpanded = input.required<boolean>();

  /** Whether this node has children. */
  public readonly hasChildren = input.required<boolean>();

  /** Whether this node is currently selected. */
  public readonly isSelected = input.required<boolean>();

  /** Whether this node is currently focused (keyboard navigation). */
  public readonly isFocused = input.required<boolean>();

  /** Function to display the node label when no custom template is projected. */
  public readonly displayWith = input.required<(data: T) => string>();

  /** Set of expanded node IDs (forwarded to child nodes). */
  public readonly expandedIds = input.required<ReadonlySet<string>>();

  /** Set of selected node IDs as node references (forwarded for checking). */
  public readonly selectedNodes = input.required<readonly TreeNode<T>[]>();

  /** Focused node ID (forwarded to children). */
  public readonly focusedNodeId = input.required<string | null>();

  /** Optional custom template for node content. */
  public readonly nodeTemplate = input<TemplateRef<TreeNodeContext<T>> | null>(
    null,
  );

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emits when the node row is clicked (for selection). */
  public readonly nodeClick = output<TreeNode<T>>();

  /** Emits when the node row is double-clicked (for activation). */
  public readonly nodeDblClick = output<TreeNode<T>>();

  /** Emits when the expand/collapse toggle is clicked. */
  public readonly toggleExpand = output<TreeNode<T>>();

  // ── Protected helpers ───────────────────────────────────────────────

  /** @internal — template context for the custom node template. */
  protected get templateContext(): TreeNodeContext<T> {
    return {
      $implicit: this.node(),
      level: this.level(),
      expanded: this.isExpanded(),
      hasChildren: this.hasChildren(),
    };
  }

  /** @internal — the child nodes to render when expanded. */
  protected get children(): TreeNode<T>[] {
    const ds = this.datasource();
    const result = ds.getChildren(this.node());
    return Array.isArray(result) ? result : [];
  }

  /** @internal — whether a given child node is expanded. */
  protected isChildExpanded(child: TreeNode<T>): boolean {
    return this.expandedIds().has(child.id);
  }

  /** @internal — whether a given child node has children. */
  protected childHasChildren(child: TreeNode<T>): boolean {
    return this.datasource().hasChildren(child);
  }

  /** @internal — whether a given child node is selected. */
  protected isChildSelected(child: TreeNode<T>): boolean {
    return this.selectedNodes().some((n) => n.id === child.id);
  }

  /** @internal — whether a given child node is focused. */
  protected isChildFocused(child: TreeNode<T>): boolean {
    return this.focusedNodeId() === child.id;
  }

  /** @internal — handle click on the toggle chevron. */
  protected onToggleClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleExpand.emit(this.node());
  }

  /** @internal — handle click on the node row. */
  protected onRowClick(): void {
    this.nodeClick.emit(this.node());
  }

  /** @internal — handle double-click on the node row. */
  protected onRowDblClick(): void {
    this.nodeDblClick.emit(this.node());
  }

  /** @internal — forward child events upward. */
  protected onChildNodeClick(node: TreeNode<T>): void {
    this.nodeClick.emit(node);
  }

  /** @internal — forward child events upward. */
  protected onChildNodeDblClick(node: TreeNode<T>): void {
    this.nodeDblClick.emit(node);
  }

  /** @internal — forward child events upward. */
  protected onChildToggleExpand(node: TreeNode<T>): void {
    this.toggleExpand.emit(node);
  }

  /** @internal — indentation padding for the current level. */
  protected get indentPx(): number {
    return this.level() * 20;
  }
}
