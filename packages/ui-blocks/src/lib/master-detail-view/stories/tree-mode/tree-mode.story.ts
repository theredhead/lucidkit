import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import {
  ArrayTreeDatasource,
  FilterableArrayDatasource,
  UIAvatar,
  UIFilter,
  UITemplateColumn,
  UITextColumn,
  type FilterFieldDefinition,
  type FilterDescriptor,
  type FilterExpression,
  type TreeNode,
} from "@theredhead/lucid-kit";

import { UIMasterDetailView } from "../../master-detail-view.component";

// ── Demo: Tree Mode ──────────────────────────────────────────────────

interface OrgNode {
  name: string;
  title: string;
  email: string;
}

const ORG_TREE: TreeNode<OrgNode>[] = [
  {
    id: "ceo",
    data: { name: "Alice Chen", title: "CEO", email: "alice@example.com" },
    children: [
      {
        id: "cto",
        data: { name: "Bob Smith", title: "CTO", email: "bob@example.com" },
        children: [
          {
            id: "eng-lead",
            data: {
              name: "Carol Davis",
              title: "Engineering Lead",
              email: "carol@example.com",
            },
            children: [
              {
                id: "dev-1",
                data: {
                  name: "Dan Lee",
                  title: "Senior Developer",
                  email: "dan@example.com",
                },
              },
              {
                id: "dev-2",
                data: {
                  name: "Eve Wong",
                  title: "Developer",
                  email: "eve@example.com",
                },
              },
            ],
          },
          {
            id: "qa-lead",
            data: {
              name: "Frank Miller",
              title: "QA Lead",
              email: "frank@example.com",
            },
            children: [
              {
                id: "qa-1",
                data: {
                  name: "Grace Kim",
                  title: "QA Engineer",
                  email: "grace@example.com",
                },
              },
            ],
          },
        ],
      },
      {
        id: "cfo",
        data: { name: "Helen Park", title: "CFO", email: "helen@example.com" },
        children: [
          {
            id: "acct",
            data: {
              name: "Ivan Brown",
              title: "Senior Accountant",
              email: "ivan@example.com",
            },
          },
        ],
      },
      {
        id: "cmo",
        data: { name: "Julia Adams", title: "CMO", email: "julia@example.com" },
        children: [
          {
            id: "mktg",
            data: {
              name: "Kevin White",
              title: "Marketing Manager",
              email: "kevin@example.com",
            },
          },
        ],
      },
    ],
  },
];

@Component({
  selector: "ui-mdv-tree-demo",
  standalone: true,
  imports: [UIMasterDetailView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./tree-mode.story.scss",
  templateUrl: "./tree-mode.story.html",
})
export class TreeDemo {
  protected readonly treeDatasource = new ArrayTreeDatasource(ORG_TREE);
  protected readonly displayWith = (data: OrgNode): string => data.name;
}
