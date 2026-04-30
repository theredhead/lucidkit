import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITreeView } from "../../tree-view.component";

import { TreeViewFileDemo } from "./file-explorer.story";

const meta = {
  title: "@theredhead/UI Kit/Tree View",
  component: UITreeView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UITreeView` renders hierarchical data as an expandable / collapsible tree.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the tree view.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the tree.",
    },
  },
  decorators: [moduleMetadata({ imports: [TreeViewFileDemo] })]
} satisfies Meta<UITreeView>;

export default meta;
type Story = StoryObj<UITreeView>;

export const FileExplorer: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          "It is datasource-driven, supports multi-select via Ctrl/⌘+click and Shift+arrows, custom node templates, per-node icons, and disabled nodes.",
          "",
          "## Key Features",
          "",
          "- **Datasource-driven** — supply an `ArrayTreeDatasource<T>` (or any `TreeDatasource`) with nested `TreeNode<T>` objects",
          "- **Unified selection** — click to select, Ctrl/⌘+click to toggle, Shift+arrow to extend, Escape to clear",
          "- **Custom templates** — project a `#nodeTemplate` to render rich node content (e.g. org-chart cards)",
          "- **SVG icons** — each `TreeNode` can carry an `icon` string (raw SVG path data) rendered inline",
          "- **Disabled nodes** — set `disabled: true` on a node to make it non-interactive",
          "- **Expand / collapse API** — call `tree.expandAll()` or `tree.collapseAll()` programmatically",
          "- **Accessible** — ARIA tree / treeitem roles with keyboard navigation (arrow keys, Enter, Space)",
          "- **Accessible** — ARIA tree / treeitem roles with keyboard navigation (arrow keys, Enter, Escape)",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `TreeDatasource<T>` | *(required)* | Provides the tree data |",
          "| `displayWith` | `(data: T) => string` | `String()` | Formats a node's data for display text |",
          '| `ariaLabel` | `string` | `"Tree view"` | Accessible label for the tree root |',
          "| `filterPredicate` | `(node: TreeNode<T>) => boolean` | — | Optional filter for visible nodes |",
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `selected` | `readonly TreeNode<T>[]` | Two-way bound array of selected nodes |",
          "",
          "## TreeNode Interface",
          "",
          "```ts",
          "interface TreeNode<T> {",
          "  id: string;",
          "  data: T;",
          "  children?: TreeNode<T>[];",
          "  icon?: string;      // raw SVG path data",
          "  disabled?: boolean;",
          "}",
          "```",
        ].join("\n")
      }
    }
  },
  render: () => ({
      template: "<ui-tree-view-file-demo />",
    })
};
