import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UITreeView } from "../../tree-view.component";
import { ArrayTreeDatasource } from "../../array-tree-datasource";
import type { TreeNode } from "../../tree-view.types";
import { UIButton } from "../../../button/button.component";

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

// ── Expand / collapse demo ────────────────────────────────────────────

@Component({
  selector: "ui-tree-view-expand-demo",
  standalone: true,
  imports: [UITreeView, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./expand-collapse.story.html",
})
export class TreeViewExpandDemo {
  protected readonly ds = new ArrayTreeDatasource(FILE_TREE);
  protected readonly displayWith = (data: FileEntry): string => data.name;
}
