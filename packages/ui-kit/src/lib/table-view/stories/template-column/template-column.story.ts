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

// ---------------------------------------------------------------------------
// Template column demo
// ---------------------------------------------------------------------------

@Component({
  selector: "ui-table-view-template-col-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UITemplateColumn,
    UIDensityDirective,
    UIButton,
  ],
  templateUrl: "./template-column.story.html",
  styleUrl: "./template-column.story.scss",
})
export class UITableViewTemplateColDemo {
  readonly adapter = new JsonPlaceholderPostsDatasource(25);
  readonly lastAction = signal("Click a button to see the action here…");

  onAction(action: string, row: any): void {
    this.lastAction.set(
      `${action.toUpperCase()}: ${JSON.stringify({ id: row.id, title: row.title }, null, 2)}`,
    );
  }
}
