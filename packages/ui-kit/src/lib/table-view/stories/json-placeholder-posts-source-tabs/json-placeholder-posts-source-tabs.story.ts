/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { UISourceTabs, type UISourceTab } from "@theredhead/lucid-blocks";

import { UIFilter } from "../../../filter/filter.component";
import type {
  FilterExpression,
  FilterFieldDefinition,
} from "../../../filter/filter.types";
import { UIDensity, UIDensityDirective } from "../../../ui-density";
import { UIBadgeColumn } from "../../columns/badge-column/badge-column.component";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITemplateColumn } from "../../columns/template-column/template-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { FilterableArrayDatasource } from "../../datasources/filterable-array-datasource";
import {
  JsonPlaceholderCommentsDatasource,
  JsonPlaceholderPhotosDatasource,
  JsonPlaceholderPostsDatasource,
} from "../../datasources/jsonplaceholder-datasource";
import { UITableView } from "../../table-view.component";
import { SelectionModel, type SelectionMode } from "../../../core/selection-model";
import { UIButton } from "../../../button/button.component";

const JSON_PLACEHOLDER_POSTS_SOURCE_TABS: readonly UISourceTab[] = [
  {
    label: "Markup",
    language: "HTML",
    filename: "posts-table.component.html",
    code: `<ui-table-view
  uiDensity="comfortable"
  caption="JSONPlaceholder Posts"
  tableId="posts-table"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="datasource"
>
  <ui-number-column
    key="id"
    headerText="ID"
    [sortable]="true"
    [format]="{ maximumFractionDigits: 0 }"
  />
  <ui-number-column
    key="userId"
    headerText="User ID"
    [sortable]="true"
    [format]="{ maximumFractionDigits: 0 }"
  />
  <ui-text-column
    key="title"
    headerText="Title"
    [truncate]="true"
    [sortable]="true"
  />
  <ui-badge-column key="userId" headerText="Owner" variant="neutral" />
</ui-table-view>`,
  },
  {
    label: "TypeScript",
    language: "TypeScript",
    filename: "posts-table.component.ts",
    code: `import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  JsonPlaceholderPostsDatasource,
  UIBadgeColumn,
  UIDensityDirective,
  UINumberColumn,
  UITableView,
  UITextColumn,
} from "@theredhead/lucid-kit";

@Component({
  selector: "app-posts-table",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
  ],
  templateUrl: "./posts-table.component.html",
  styleUrl: "./posts-table.component.scss",
})
export class PostsTableComponent {
  protected readonly datasource = new JsonPlaceholderPostsDatasource(25);
}`,
  },
  {
    label: "Styles",
    language: "SCSS",
    filename: "posts-table.component.scss",
    code: `:host {
  display: block;
}

ui-table-view {
  max-inline-size: 100%;
}`,
  },
];

@Component({
  selector: "ui-table-view-source-tabs-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISourceTabs],
  templateUrl: "./json-placeholder-posts-source-tabs.story.html",
})
export class UITableViewSourceTabsDemo {
  public readonly tabs = JSON_PLACEHOLDER_POSTS_SOURCE_TABS;
}
