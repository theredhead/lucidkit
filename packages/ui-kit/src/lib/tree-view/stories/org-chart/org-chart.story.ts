import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UITreeView } from "../../tree-view.component";
import { ArrayTreeDatasource } from "../../array-tree-datasource";
import type { TreeNode } from "../../tree-view.types";
import { UIButton } from "../../../button/button.component";

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
  templateUrl: "./org-chart.story.html",
})
export class TreeViewOrgDemo {
  protected readonly ds = new ArrayTreeDatasource(ORG_CHART);
  protected readonly displayWith = (data: Person): string => data.name;
}
