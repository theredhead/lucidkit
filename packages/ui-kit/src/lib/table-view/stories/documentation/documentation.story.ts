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
  selector: "ui-table-view-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
  ],
  templateUrl: "./documentation.story.html",
})
export class UITableViewStoryDemo {
  readonly caption = input<string>("JSONPlaceholder Posts");
  readonly selectionMode = input<SelectionMode>("none");
  readonly showBuiltInPaginator = input<boolean>(true);
  readonly showRowIndexIndicator = input<boolean>(true);
  readonly showSelectionColumn = input<boolean>(true);
  readonly rowClickSelect = input<boolean>(false);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input<boolean>(false);

  readonly adapter = new JsonPlaceholderPostsDatasource(25);
}
