import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDensity } from "../../../ui-density";
import { UITableViewFilteredDemo } from "./filtered-table.story";
import {
  TABLE_VIEW_STORY_ARG_TYPES,
  type TableViewDensityStoryArgs,
} from "../table-view-story-helpers";

const meta = {
  title: "@theredhead/UI Kit/Table View",
  component: UITableViewFilteredDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UITableView` is a full-featured data table with pluggable datasources, declarative columns, sorting, pagination, row selection, and density control.",
      },
    },
  },
  argTypes: TABLE_VIEW_STORY_ARG_TYPES,
  decorators: [moduleMetadata({ imports: [UITableViewFilteredDemo] })],
} satisfies Meta<TableViewDensityStoryArgs>;

export default meta;
type Story = StoryObj<TableViewDensityStoryArgs>;

export const FilteredTable: Story = {
  argTypes: {
    density: {
      control: "inline-radio",
      options: [
        "small",
        "compact",
        "comfortable",
        "generous",
      ] satisfies UIDensity[],
      description:
        "Applies global density tokens through the uiDensity directive.",
    },
    pageSize: {
      control: { type: "number", min: 25, max: 500, step: 25 },
      description: "Initial page size for the 10,000-row datasource.",
    },
  },
  args: {
    density: "comfortable",
    caption: "Employees",
    selectionMode: "single",
    showBuiltInPaginator: true,
    showRowIndexIndicator: true,
    showSelectionColumn: true,
    rowClickSelect: false,
    pageSize: 100,
    disabled: false,
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-table-view-filtered-demo
        [density]="density"
        [caption]="caption"
        [selectionMode]="selectionMode"
        [showBuiltInPaginator]="showBuiltInPaginator"
        [showRowIndexIndicator]="showRowIndexIndicator"
        [showSelectionColumn]="showSelectionColumn"
        [rowClickSelect]="rowClickSelect"
        [pageSize]="pageSize"
        [disabled]="disabled"
      />
    `,
  }),
};
