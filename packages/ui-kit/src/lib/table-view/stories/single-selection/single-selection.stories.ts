import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableViewSingleSelectDemo } from "./single-selection.story";
import {
  TABLE_VIEW_STORY_ARG_TYPES,
  type TableViewStoryArgs,
} from "../table-view-story-helpers";

const meta = {
  title: "@theredhead/UI Kit/Table View",
  component: UITableViewSingleSelectDemo,
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
  decorators: [moduleMetadata({ imports: [UITableViewSingleSelectDemo] })],
} satisfies Meta<TableViewStoryArgs>;

export default meta;
type Story = StoryObj<TableViewStoryArgs>;

export const SingleSelection: Story = {
  args: {
    caption: "Single Selection",
    selectionMode: "single",
    showBuiltInPaginator: true,
    showRowIndexIndicator: true,
    showSelectionColumn: true,
    rowClickSelect: true,
    pageSize: undefined,
    disabled: false,
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-table-view-single-select-demo
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
