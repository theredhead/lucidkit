import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIDensityDirective } from "../../../ui-density";
import { UIBadgeColumn } from "../../columns/badge-column/badge-column.component";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { JsonPlaceholderPostsDatasource } from "../../datasources/jsonplaceholder-datasource";
import { UITableView } from "../../table-view.component";
import { type SelectionMode } from "../../../core/selection-model";

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
  template: `
    <ui-table-view
      uiDensity="comfortable"
      tableId="story-posts"
      [caption]="caption()"
      [selectionMode]="selectionMode()"
      [showRowIndexIndicator]="showRowIndexIndicator()"
      [showBuiltInPaginator]="showBuiltInPaginator()"
      [showSelectionColumn]="showSelectionColumn()"
      [rowClickSelect]="rowClickSelect()"
      [pageSize]="pageSize()"
      [disabled]="disabled()"
      [datasource]="adapter"
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
    </ui-table-view>
  `,
})
class UITableViewStoryDemo {
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

import { UITableViewSingleSelectDemo } from "./single-selection.story";

const meta = {
  title: "@theredhead/UI Kit/Table View",
  component: UITableViewStoryDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UITableView` is a full-featured data table with pluggable datasources, declarative columns, sorting, pagination, row selection, and density control.",
      },
    },
  },
  argTypes: {
    caption: {
      control: "text",
      description: "Visible <caption> for the table.",
    },
    selectionMode: {
      control: "select",
      options: ["none", "single", "multiple"],
      description: "Row selection behaviour.",
    },
    showBuiltInPaginator: {
      control: "boolean",
      description: "Show the built-in pagination footer.",
    },
    showRowIndexIndicator: {
      control: "boolean",
      description: "Show a row-index column.",
    },
    showSelectionColumn: {
      control: "boolean",
      description: "Show the checkbox / radio selection column.",
    },
    rowClickSelect: {
      control: "boolean",
      description: "Select a row by clicking anywhere on it.",
    },
    pageSize: {
      control: "number",
      description: "Items per page.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the table.",
    },
  },
  decorators: [moduleMetadata({ imports: [UITableViewSingleSelectDemo] })]
} satisfies Meta<object>;

export default meta;
type Story = StoryObj<object>;

export const SingleSelection: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-table-view-single-select-demo />",
    })
};
