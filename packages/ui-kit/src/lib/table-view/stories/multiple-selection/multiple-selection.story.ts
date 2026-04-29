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

@Component({
  selector: "ui-table-view-multi-select-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
  ],
  templateUrl: "./multiple-selection.story.html",
})
export class UITableViewMultiSelectDemo {
  readonly adapter = new JsonPlaceholderPostsDatasource(25);
  readonly selectionModel = new SelectionModel<any>(
    "multiple",
    (row) => row.id,
  );
  readonly selectedJson = signal("(none)");
  readonly selectedCount = signal(0);

  onSelectionChange(rows: readonly unknown[]): void {
    this.selectedCount.set(rows.length);
    this.selectedJson.set(
      rows.length > 0
        ? JSON.stringify(
            rows.map((r: any) => ({ id: r.id, title: r.title })),
            null,
            2,
          )
        : "(none)",
    );
  }
}
