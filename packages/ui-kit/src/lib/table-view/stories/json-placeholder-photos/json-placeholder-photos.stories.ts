import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDensity } from "../../../ui-density";
import { UITableViewPhotosStoryDemo } from "./json-placeholder-photos.story";
import {
  TABLE_VIEW_STORY_ARG_TYPES,
  type TableViewDensityStoryArgs,
} from "../table-view-story-helpers";

const meta = {
  title: "@theredhead/UI Kit/Table View",
  component: UITableViewPhotosStoryDemo,
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
  decorators: [moduleMetadata({ imports: [UITableViewPhotosStoryDemo] })],
} satisfies Meta<TableViewDensityStoryArgs>;

export default meta;
type Story = StoryObj<TableViewDensityStoryArgs>;

export const JsonPlaceholderPhotos: Story = {
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
    density: "generous",
    caption: "JSONPlaceholder Photos",
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
      <ui-table-view-photos-story-demo
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
