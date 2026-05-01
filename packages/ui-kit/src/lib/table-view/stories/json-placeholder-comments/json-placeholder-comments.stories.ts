import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableViewCommentsStoryDemo } from "./json-placeholder-comments.story";
import {
  TABLE_VIEW_STORY_ARG_TYPES,
  type TableViewDensityStoryArgs,
} from "../table-view-story-helpers";
import { UIDensity } from "../../../ui-density";

const meta = {
  title: "@theredhead/UI Kit/Table View",
  component: UITableViewCommentsStoryDemo,
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
  decorators: [moduleMetadata({ imports: [UITableViewCommentsStoryDemo] })],
} satisfies Meta<TableViewDensityStoryArgs>;

export default meta;
type Story = StoryObj<TableViewDensityStoryArgs>;

export const JsonPlaceholderComments: Story = {
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
  },
  args: {
    density: "compact",
    caption: "JSONPlaceholder Comments",
    selectionMode: "none",
    showBuiltInPaginator: true,
    showRowIndexIndicator: true,
    showSelectionColumn: true,
    rowClickSelect: false,
    pageSize: undefined,
    disabled: false,
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-table-view-comments-story-demo
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
