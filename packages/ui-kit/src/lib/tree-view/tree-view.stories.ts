import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UITreeView } from "./tree-view.component";
import { ArrayTreeDatasource } from "./array-tree-datasource";
import type { TreeNode, TreeSelectionMode } from "./tree-view.types";

// ── Demo data ─────────────────────────────────────────────────────────

interface FileEntry {
  name: string;
}

const FILE_TREE: TreeNode<FileEntry>[] = [
  {
    id: "src",
    data: { name: "src" },
    icon: '<path d="M2 4a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 11.828 5H14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z" fill="currentColor"/>',
    children: [
      {
        id: "src/app",
        data: { name: "app" },
        icon: '<path d="M2 4a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 11.828 5H14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z" fill="currentColor"/>',
        children: [
          {
            id: "src/app/main.ts",
            data: { name: "main.ts" },
            icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
          },
          {
            id: "src/app/app.component.ts",
            data: { name: "app.component.ts" },
            icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
          },
          {
            id: "src/app/app.component.html",
            data: { name: "app.component.html" },
            icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
          },
        ],
      },
      {
        id: "src/assets",
        data: { name: "assets" },
        icon: '<path d="M2 4a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 11.828 5H14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z" fill="currentColor"/>',
        children: [
          {
            id: "src/assets/logo.svg",
            data: { name: "logo.svg" },
            icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
          },
        ],
      },
      {
        id: "src/index.html",
        data: { name: "index.html" },
        icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
      },
      {
        id: "src/styles.scss",
        data: { name: "styles.scss" },
        icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
      },
    ],
  },
  {
    id: "package.json",
    data: { name: "package.json" },
    icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
  },
  {
    id: "tsconfig.json",
    data: { name: "tsconfig.json" },
    icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
  },
  {
    id: "readme",
    data: { name: "README.md" },
    icon: '<rect x="3" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1"/><line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" stroke-width="1"/>',
  },
  {
    id: "node_modules",
    data: { name: "node_modules" },
    disabled: true,
    icon: '<path d="M2 4a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 11.828 5H14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z" fill="currentColor"/>',
    children: [{ id: "nm/angular", data: { name: "@angular" } }],
  },
];

// ── Demo components ───────────────────────────────────────────────────

@Component({
  selector: "ui-tree-view-file-demo",
  standalone: true,
  imports: [UITreeView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-tree-view
      [datasource]="ds"
      [displayWith]="displayWith"
      ariaLabel="File explorer"
    />
  `,
})
class TreeViewFileDemo {
  protected readonly ds = new ArrayTreeDatasource(FILE_TREE);
  protected readonly displayWith = (data: FileEntry): string => data.name;
}

@Component({
  selector: "ui-tree-view-selection-demo",
  standalone: true,
  imports: [UITreeView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; gap: 2rem; align-items: flex-start;">
      <ui-tree-view
        [datasource]="ds"
        [displayWith]="displayWith"
        [selectionMode]="selectionMode()"
        [(selected)]="selected"
        ariaLabel="File explorer"
        style="flex: 1"
      />
      <div style="flex: 1; font-size: 0.85rem;">
        <p><strong>Mode:</strong> {{ selectionMode() }}</p>
        <div style="margin-bottom: 0.5rem;">
          <button (click)="selectionMode.set('single')">Single</button>
          <button (click)="selectionMode.set('multiple')">Multiple</button>
          <button (click)="selectionMode.set('none')">None</button>
        </div>
        <p><strong>Selected:</strong></p>
        <pre
          style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; overflow: auto;"
          >{{ selectedNames() }}</pre
        >
      </div>
    </div>
  `,
})
class TreeViewSelectionDemo {
  protected readonly ds = new ArrayTreeDatasource(FILE_TREE);
  protected readonly displayWith = (data: FileEntry): string => data.name;
  protected readonly selectionMode = signal<TreeSelectionMode>("single");
  protected readonly selected = signal<readonly TreeNode<FileEntry>[]>([]);

  protected readonly selectedNames = () =>
    this.selected()
      .map((n) => n.data.name)
      .join("\n") || "(none)";
}

// ── Org chart demo ────────────────────────────────────────────────────

interface Person {
  name: string;
  title: string;
}

const ORG_CHART: TreeNode<Person>[] = [
  {
    id: "ceo",
    data: { name: "Alice Chen", title: "CEO" },
    children: [
      {
        id: "cto",
        data: { name: "Bob Smith", title: "CTO" },
        children: [
          {
            id: "eng-lead",
            data: { name: "Carol Davis", title: "Engineering Lead" },
            children: [
              { id: "dev-1", data: { name: "Dan Lee", title: "Developer" } },
              { id: "dev-2", data: { name: "Eve Wong", title: "Developer" } },
            ],
          },
          {
            id: "qa-lead",
            data: { name: "Frank Miller", title: "QA Lead" },
            children: [
              { id: "qa-1", data: { name: "Grace Kim", title: "QA Engineer" } },
            ],
          },
        ],
      },
      {
        id: "cfo",
        data: { name: "Helen Park", title: "CFO" },
        children: [
          {
            id: "accountant",
            data: { name: "Ivan Brown", title: "Senior Accountant" },
          },
        ],
      },
      {
        id: "cmo",
        data: { name: "Julia Adams", title: "CMO" },
        children: [
          {
            id: "marketing",
            data: { name: "Kevin White", title: "Marketing Manager" },
          },
        ],
      },
    ],
  },
];

@Component({
  selector: "ui-tree-view-org-demo",
  standalone: true,
  imports: [UITreeView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-tree-view
      [datasource]="ds"
      [displayWith]="displayWith"
      ariaLabel="Organization chart"
    >
      <ng-template #nodeTemplate let-node>
        <div style="line-height: 1.3">
          <strong>{{ node.data.name }}</strong>
          <div style="font-size: 0.75rem; opacity: 0.7;">
            {{ node.data.title }}
          </div>
        </div>
      </ng-template>
    </ui-tree-view>
  `,
})
class TreeViewOrgDemo {
  protected readonly ds = new ArrayTreeDatasource(ORG_CHART);
  protected readonly displayWith = (data: Person): string => data.name;
}

// ── Expand / collapse demo ────────────────────────────────────────────

@Component({
  selector: "ui-tree-view-expand-demo",
  standalone: true,
  imports: [UITreeView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="margin-bottom: 0.75rem;">
      <button (click)="tree.expandAll()">Expand All</button>
      <button (click)="tree.collapseAll()">Collapse All</button>
    </div>
    <ui-tree-view
      #tree
      [datasource]="ds"
      [displayWith]="displayWith"
      ariaLabel="File explorer"
    />
  `,
})
class TreeViewExpandDemo {
  protected readonly ds = new ArrayTreeDatasource(FILE_TREE);
  protected readonly displayWith = (data: FileEntry): string => data.name;
}

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<UITreeView> = {
  title: "@theredhead/UI Kit/Tree View",
  component: UITreeView,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        TreeViewFileDemo,
        TreeViewSelectionDemo,
        TreeViewOrgDemo,
        TreeViewExpandDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UITreeView>;

/** File explorer – icons, nested folders, and a disabled node_modules folder. */
export const FileExplorer: Story = {
  render: () => ({
    template: `<ui-tree-view-file-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `const ds = new ArrayTreeDatasource<FileEntry>(FILE_TREE);

<ui-tree-view
  [datasource]="ds"
  [displayWith]="displayWith"
  ariaLabel="File explorer"
/>`,
        language: "html",
      },
    },
  },
};

/** Interactive selection demo — toggle between single, multiple, and none modes. */
export const Selection: Story = {
  render: () => ({
    template: `<ui-tree-view-selection-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-tree-view
  [datasource]="ds"
  [selectionMode]="selectionMode()"
  [(selected)]="selected"
/>`,
        language: "html",
      },
    },
  },
};

/** Org chart with a custom template showing name + title. */
export const OrgChart: Story = {
  render: () => ({
    template: `<ui-tree-view-org-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-tree-view [datasource]="ds" [displayWith]="displayWith">
  <ng-template #nodeTemplate let-node>
    <div>
      <strong>{{ node.data.name }}</strong>
      <div style="font-size: 0.75rem;">{{ node.data.title }}</div>
    </div>
  </ng-template>
</ui-tree-view>`,
        language: "html",
      },
    },
  },
};

/** Expand / collapse all via the public API. */
export const ExpandCollapse: Story = {
  render: () => ({
    template: `<ui-tree-view-expand-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<button (click)="tree.expandAll()">Expand All</button>
<button (click)="tree.collapseAll()">Collapse All</button>

<ui-tree-view
  #tree
  [datasource]="ds"
  [displayWith]="displayWith"
/>`,
        language: "html",
      },
    },
  },
};
